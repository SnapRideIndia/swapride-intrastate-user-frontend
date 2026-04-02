import { Image, ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BusSelction.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import TopDateTabBar from '../../../components/common/TopDateTabBar/TopDateTabBar';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import BusSelectionCard from '../../../components/domain/busSelection/card/BusSelectionCard/BusSelectionCard';
import BusSelectionCardSkeleton from '../../../components/domain/busSelection/card/BusSelectionCard/BusSelectionCardSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveDateIndex, setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations, useSaveLocation, useSearchTrips } from '../../../hooks/useSearch';
import { useInitiateRoundTrip } from '../../../hooks/useBooking';
import { format, isToday, addDays } from 'date-fns';
import { FindCommuteCard } from '../../../components/domain/booking/FindCommuteCard/FindCommuteCard';
import { SwTopModal } from '../../../components/common/SwTopModal/SwTopModal';
import { Alert } from 'react-native';
import { SwLocationSearchBottomSheet } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import type { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import { useLocationSheetBackHandler } from '../../../hooks/useLocationSheetBackHandler';
import { NoResults } from '../../../components/common/NoResults/NoResults';
import DatePicker from 'react-native-date-picker';
import { CommuteDateTab } from '../../../types/commuteDates.types';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { ICommute, Timing } from '../../../types/commute.types';

const BusSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.BUS_SELECTION_SCREEN>>();
  const { isReturnLeg, outbound } = route.params || {};
  const dispatch = useDispatch();
  const {
    commuteData,
    dateTabs: storedTabs,
    activeDateIndex: storedActiveIndex,
    searchBaseParams,
    officeTimings,
  } = useSelector((store: RootState) => store.commute);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(searchBaseParams?.pickup?.placeName || searchBaseParams?.pickup?.address || '');
  const [dropLocation, setDropLocation] = useState(searchBaseParams?.dropoff?.placeName || searchBaseParams?.dropoff?.address || '');
  const [pickupAddress, setPickupAddress] = useState(searchBaseParams?.pickup?.address || '');
  const [dropoffAddress, setDropoffAddress] = useState(searchBaseParams?.dropoff?.address || '');
  const [pickupCoords, setPickupCoords] = useState(
    searchBaseParams ? { lat: searchBaseParams.pickup.latitude, lng: searchBaseParams.pickup.longitude } : null,
  );
  const [dropoffCoords, setDropoffCoords] = useState(
    searchBaseParams ? { lat: searchBaseParams.dropoff.latitude, lng: searchBaseParams.dropoff.longitude } : null,
  );

  const { mutate: searchTrips, isPending: isSearchingTrips } = useSearchTrips(
    (data: any) => {
      // Successful response – store trips (can be empty array) and close edit modal
      dispatch(setCommuteData(data));
      setIsEditModalVisible(false);
    },
    (e: any) => {
      // On error, stop infinite refetch loop by marking commuteData as an empty list
      // so the effect knows we've already attempted and can show an empty/failed state.
      dispatch(setCommuteData([]));
      console.warn('Search trips failed:', e?.message || e);
    },
  );

  const handleSwapLocations = useCallback(() => {
    const tempCoords = pickupCoords;
    const tempLocation = pickupLocation;
    const tempAddress = pickupAddress;

    setPickupCoords(dropoffCoords);
    setPickupLocation(dropLocation);
    setPickupAddress(dropoffAddress);

    setDropoffCoords(tempCoords);
    setDropLocation(tempLocation);
    setDropoffAddress(tempAddress);
  }, [pickupCoords, dropoffCoords, pickupLocation, dropLocation, pickupAddress, dropoffAddress]);

  useEffect(() => {
    console.log('BusSelection searchBaseParams updated ===>', searchBaseParams);
    if (searchBaseParams) {
      setPickupLocation(searchBaseParams.pickup.placeName || searchBaseParams.pickup.address || '');
      setDropLocation(searchBaseParams.dropoff.placeName || searchBaseParams.dropoff.address || '');
      setPickupAddress(searchBaseParams.pickup.address || '');
      setDropoffAddress(searchBaseParams.dropoff.address || '');
      setPickupCoords({ lat: searchBaseParams.pickup.latitude, lng: searchBaseParams.pickup.longitude });
      setDropoffCoords({ lat: searchBaseParams.dropoff.latitude, lng: searchBaseParams.dropoff.longitude });
    }
  }, [searchBaseParams]);

  const locationSheetRef = useRef<BottomSheetModal>(null);

  const onModalBack = useCallback(() => {
    if (isEditModalVisible) {
      setIsEditModalVisible(false);
      return true;
    }
    return false;
  }, [isEditModalVisible]);

  const { onChange: onSheetChange, onClose: onSheetClose } = useLocationSheetBackHandler(locationSheetRef, onModalBack);
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop' | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);
  const [isSavedAndRecentLoading, setSavedAndRecentLoading] = useState(false);
  const [isSearchResultsLoading, setSearchResultsLoading] = useState(false);
  const sessionTokenRef = useRef<string | null>(null);

  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const [activeTabIndex, setActiveTabIndex] = useState(storedActiveIndex ?? 0);

  const { mutate: initiateRoundTrip, isPending: isInitiatingRoundTrip } = useInitiateRoundTrip(
    (data: any) => {
      navigation.navigate(ScreenNames.CONFIRM_BOOKING_DETAILS, { bookingId: data.outboundBookingId });
    },
    (error: any) => {
      Alert.alert('Booking Failed', error?.message || 'Something went wrong');
    },
  );

  const handleProceed = useCallback(
    (result: ICommute, timing: Timing) => {
      if (isReturnLeg && outbound) {
        const payload = {
          outbound: {
            tripId: outbound.timing.tripId,
            pickupStopId: outbound.result.pickup.pointId,
            dropoffStopId: outbound.result.dropoff.pointId,
            totalAmount: outbound.result.baseFare,
          },
          returnTrip: {
            tripId: timing.tripId,
            pickupStopId: result.pickup.pointId,
            dropoffStopId: result.dropoff.pointId,
            totalAmount: result.baseFare,
          },
        };
        initiateRoundTrip(payload);
      } else {
        navigation.navigate(ScreenNames.BOOKING_OPTIONS, {
          outbound: { result, timing },
        });
      }
    },
    [isReturnLeg, outbound, initiateRoundTrip, navigation],
  );

  const loadSavedAndRecent = useCallback(
    async (type: 'pickup' | 'drop') => {
      try {
        const [saved, recent] = await Promise.all([getSavedLocationItems(), getRecentSearchItems(type)]);
        setSavedAddresses(saved);
        setRecentSearches(recent);
      } catch (e) {
        setSavedAddresses([]);
        setRecentSearches([]);
      } finally {
        setSavedAndRecentLoading(false);
      }
    },
    [getRecentSearchItems, getSavedLocationItems],
  );
  const refetchSaved = useCallback(() => {
    if (activeLocationField) loadSavedAndRecent(activeLocationField);
  }, [activeLocationField, loadSavedAndRecent]);
  const { saveLocation } = useSaveLocation(refetchSaved);

  const openLocationSheet = useCallback(
    (field: 'pickup' | 'drop') => {
      setActiveLocationField(field);
      setLocationQuery('');
      setSearchResults([]);
      setSearchResultsLoading(false);
      setSavedAndRecentLoading(true);
      loadSavedAndRecent(field);
      locationSheetRef.current?.present();
    },
    [loadSavedAndRecent],
  );

  const handleSelectLocation = useCallback(
    async (item: SwLocationSearchItem) => {
      const field = activeLocationField;
      if (!field) return;

      const placeName = item.title;
      const fullAddress = item.subtitle || item.title;
      const coords = { lat: item.latitude || 0, lng: item.longitude || 0 };

      if (field === 'pickup') {
        setPickupLocation(placeName);
        setPickupAddress(fullAddress);
        setPickupCoords(coords);
      } else {
        setDropLocation(placeName);
        setDropoffAddress(fullAddress);
        setDropoffCoords(coords);
      }

      locationSheetRef.current?.close();
    },
    [activeLocationField],
  );

  useEffect(() => {
    if (locationQuery.length > 2) {
      if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
      setSearchResultsLoading(true);
      getPlaceAutocompleteItems(locationQuery, sessionTokenRef.current)
        .then(setSearchResults)
        .finally(() => setSearchResultsLoading(false));
    } else {
      setSearchResults([]);
      setSearchResultsLoading(false);
    }
  }, [locationQuery, getPlaceAutocompleteItems]);

  const fallbackTabs = useMemo<CommuteDateTab[]>(() => {
    const today = new Date();

    return Array.from({ length: 10 }).map((_, index) => {
      const date = addDays(today, index);
      const title = isToday(date) ? 'Today' : format(date, 'EEE, do MMM');
      return {
        id: format(date, 'yyyy-MM-dd'),
        title,
        date: format(date, 'yyyy-MM-dd'),
      };
    });
  }, []);

  const [localDateTabs, setLocalDateTabs] = useState<CommuteDateTab[]>(storedTabs?.length ? storedTabs : fallbackTabs);

  useEffect(() => {
    if (storedTabs?.length) {
      setLocalDateTabs(storedTabs);
    } else {
      setLocalDateTabs(fallbackTabs);
    }
  }, [storedTabs, fallbackTabs]);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarPickerDate, setCalendarPickerDate] = useState<Date>(new Date());

  const openCalendar = useCallback(() => {
    const currentTab = localDateTabs[activeTabIndex];
    if (currentTab?.date) {
      setCalendarPickerDate(new Date(`${currentTab.date}T00:00:00`));
    } else {
      setCalendarPickerDate(new Date());
    }
    setIsDatePickerOpen(true);
  }, [activeTabIndex, localDateTabs]);

  const handleCalendarConfirm = useCallback(
    (d: Date) => {
      const dateKey = format(d, 'yyyy-MM-dd');
      const existingIdx = localDateTabs.findIndex(t => t.date === dateKey);

      if (existingIdx >= 0) {
        setActiveTabIndex(existingIdx);
        setIsDatePickerOpen(false);
        return;
      }

      const customTab: CommuteDateTab = {
        id: dateKey,
        date: dateKey,
        title: format(d, 'EEE, do MMM'),
      };

      const nextTabs = [...localDateTabs, customTab].slice(0, 5);
      setLocalDateTabs(nextTabs);
      setActiveTabIndex(nextTabs.length - 1);
      setIsDatePickerOpen(false);
    },
    [localDateTabs],
  );

  const handleEditSubmit = () => {
    if (!pickupCoords || !dropoffCoords) return;

    const baseParams = {
      pickup: {
        latitude: pickupCoords.lat,
        longitude: pickupCoords.lng,
        address: pickupAddress || pickupLocation,
        placeName: pickupLocation || undefined,
      },
      dropoff: {
        latitude: dropoffCoords.lat,
        longitude: dropoffCoords.lng,
        address: dropoffAddress || dropLocation,
        placeName: dropLocation || undefined,
      },
      userLocation: {
        latitude: searchBaseParams?.userLocation?.latitude || 17.385,
        longitude: searchBaseParams?.userLocation?.longitude || 78.4867,
      },
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs: localDateTabs,
        activeDateIndex: activeTabIndex,
        searchBaseParams: baseParams,
        officeTimings: officeTimings ?? null,
      }),
    );

    dispatch(setCommuteData(null));
    const tripDate = tabs[activeTabIndex].date;
    const apiParams: any = {
      ...baseParams,
      tripDate,
    };
    if (officeTimings) {
      apiParams.officeTimings = officeTimings;
    }

    searchTrips(apiParams);
    setIsEditModalVisible(false);
  };

  const tabs = localDateTabs;

  useEffect(() => {
    if (!searchBaseParams) return;
    const tab = tabs[activeTabIndex] as any;
    const tripDate = tab?.date;
    if (!tripDate) return;
    // Only trigger the initial fetch when we don't yet have data (null).
    // This avoids repeatedly refetching when the API legitimately returns an empty list.
    if (commuteData !== null) return;
    if (isSearchingTrips) return;

    const params: any = { ...searchBaseParams, tripDate };
    if (officeTimings) {
      params.officeTimings = officeTimings;
    }
    searchTrips(params);
  }, [searchBaseParams, tabs, activeTabIndex, commuteData, isSearchingTrips, officeTimings, searchTrips]);

  const handleTabPress = useCallback(
    (index: number) => {
      const tab = tabs[index] as any;
      const tripDate = tab?.date;

      if (!tripDate || !searchBaseParams) {
        return;
      }

      setActiveTabIndex(index);
      dispatch(setActiveDateIndex(index));

      dispatch(setCommuteData(null));

      const params: any = { ...searchBaseParams, tripDate };
      if (officeTimings) {
        params.officeTimings = officeTimings;
      }
      searchTrips(params);
    },
    [dispatch, searchBaseParams, searchTrips, tabs, isReturnLeg, officeTimings],
  );

  useEffect(() => {
    if (storedActiveIndex !== undefined && storedActiveIndex !== activeTabIndex) {
      setActiveTabIndex(storedActiveIndex);
    }
  }, [storedActiveIndex]);

  const HeaderTitle = useMemo(() => {
    const pickup = searchBaseParams?.pickup?.placeName || pickupLocation || searchBaseParams?.pickup?.address?.split(',')[0] || 'Pickup';
    const drop = searchBaseParams?.dropoff?.placeName || dropLocation || searchBaseParams?.dropoff?.address?.split(',')[0] || 'Dropoff';

    return (
      <View style={styles.headerTitleContainer}>
        <Text variant="bold" style={styles.headerTitleText} numberOfLines={1}>
          {pickup}
        </Text>
        <Text style={styles.headerArrow}>→</Text>
        <Text variant="bold" style={styles.headerTitleText} numberOfLines={1}>
          {drop}
        </Text>
      </View>
    );
  }, [searchBaseParams, pickupLocation, dropLocation, styles]);

  const hasCommuteResults = Array.isArray(commuteData) && commuteData.length > 0;
  // Show skeletons only while the API call is in-flight *before* we have any data (null state).
  const showSkeletonCards = isSearchingTrips && commuteData === null;

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={HeaderTitle} onEdit={() => setIsEditModalVisible(true)} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation, HeaderTitle]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TopDateTabBar tabs={tabs} activeIndex={activeTabIndex} onTabPress={handleTabPress} onPressCalendar={openCalendar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {!showSkeletonCards && hasCommuteResults && (
          <View style={styles.bannerCard}>
            <Text variant="semi-bold" style={styles.bannerText}>
              Showing nearest stops & bus timings on your route
            </Text>
            <Image source={ImageSource.shuttel} style={styles.shuttel} />
          </View>
        )}

        {showSkeletonCards &&
          Array.from({ length: 3 }).map((_, idx) => <BusSelectionCardSkeleton key={`skeleton-${idx}`} />)}

        {!showSkeletonCards &&
          commuteData?.map((item, idx) => (
          <BusSelectionCard key={`${item.routeId}-${idx}`} showLabel={true} data={item} onProceed={timing => handleProceed(item, timing)} />
        ))}

        {!isSearchingTrips && commuteData !== null && commuteData.length === 0 && (
          <NoResults
            image={ImageSource.shuttel}
            title="No buses available"
            subtitle="We couldn't find buses on this route. Try another route or nearby stop."
            imageStyle={{ width: 140, height: 140 }}
          />
        )}
      </ScrollView>

      <SwTopModal isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} title="Search Bus">
        <FindCommuteCard
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropLocation={dropLocation}
          setDropLocation={setDropLocation}
          onPressPickup={() => openLocationSheet('pickup')}
          onPressDrop={() => openLocationSheet('drop')}
          onSwapLocations={handleSwapLocations}
          dateTabs={localDateTabs}
          activeDateIndex={activeTabIndex}
          onPressDateTab={setActiveTabIndex}
          onPressCalendar={openCalendar}
          onSubmit={handleEditSubmit}
          isSearching={isSearchingTrips}
          canSubmit={!!pickupCoords && !!dropoffCoords}
          containerStyle={{ borderWidth: 0, elevation: 0, shadowOpacity: 0, paddingTop: 0, paddingHorizontal: 24, paddingBottom: 12 }}
        />
      </SwTopModal>

      <DatePicker
        modal
        mode="date"
        open={isDatePickerOpen}
        date={calendarPickerDate}
        minimumDate={new Date()}
        onConfirm={handleCalendarConfirm}
        onCancel={() => setIsDatePickerOpen(false)}
      />

      <SwLocationSearchBottomSheet
        ref={locationSheetRef}
        title={activeLocationField === 'pickup' ? 'Search Pickup Address' : 'Search Drop Address'}
        query={locationQuery}
        onChangeQuery={setLocationQuery}
        searchResults={searchResults}
        isSearchResultsLoading={isSearchResultsLoading}
        isSavedAddressesLoading={isSavedAndRecentLoading}
        isRecentSearchesLoading={isSavedAndRecentLoading}
        showUseCurrentLocation={false}
        savedAddresses={savedAddresses}
        recentSearches={recentSearches}
        onPressItem={handleSelectLocation}
        onSaveLocation={saveLocation}
        onSaveLocationPress={(item) => {
          locationSheetRef.current?.dismiss();
          navigation.navigate(ScreenNames.ADD_EDIT_LOCATION_SCREEN, {
            mode: 'add',
            prefilledLocation: { id: item.id, title: item.title, subtitle: item.subtitle, latitude: item.latitude, longitude: item.longitude },
          });
        }}
        onChange={onSheetChange}
        onClose={() => {
          onSheetClose();
          setLocationQuery('');
          setSearchResults([]);
          sessionTokenRef.current = null;
        }}
      />
    </SafeAreaView>
  );
};

export default BusSelection;
