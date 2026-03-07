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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveDateIndex, setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations, useSearchTrips } from '../../../hooks/useSearch';
import { useInitiateRoundTrip } from '../../../hooks/useBooking';
import { format, isToday, addDays } from 'date-fns';
import { FindCommuteCard } from '../../../components/domain/booking/FindCommuteCard/FindCommuteCard';
import { SwTopModal } from '../../../components/common/SwTopModal/SwTopModal';
import { ActivityIndicator, Alert } from 'react-native';
import {
  SwLocationSearchBottomSheet,
  SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import { useLocationSheetBackHandler } from '../../../hooks/useLocationSheetBackHandler';
import { EmptyCommuteData } from '../../../components/domain/busSelection/EmptyCommuteData';
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
  } = useSelector((store: RootState) => store.commute);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(searchBaseParams?.pickupName || '');
  const [dropLocation, setDropLocation] = useState(searchBaseParams?.dropoffName || '');
  const [pickupCoords, setPickupCoords] = useState(
    searchBaseParams ? { lat: searchBaseParams.pickupLat, lng: searchBaseParams.pickupLng } : null,
  );
  const [dropoffCoords, setDropoffCoords] = useState(
    searchBaseParams ? { lat: searchBaseParams.dropoffLat, lng: searchBaseParams.dropoffLng } : null,
  );

  useEffect(() => {
    if (searchBaseParams) {
      setPickupLocation(searchBaseParams.pickupName || '');
      setDropLocation(searchBaseParams.dropoffName || '');
      setPickupCoords({ lat: searchBaseParams.pickupLat, lng: searchBaseParams.pickupLng });
      setDropoffCoords({ lat: searchBaseParams.dropoffLat, lng: searchBaseParams.dropoffLng });
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
  const sessionTokenRef = useRef<string | null>(null);

  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const [activeTabIndex, setActiveTabIndex] = useState(storedActiveIndex ?? 0);
  const { mutate: searchTrips, isPending: isSearchingTrips } = useSearchTrips(
    (data: any) => {
      dispatch(setCommuteData(data));
      setIsEditModalVisible(false);
    },
    (e: any) => {
      Alert.alert('Search Failed', e?.message || 'Unable to fetch buses');
    },
  );

  const { mutate: initiateRoundTrip, isPending: isInitiatingRoundTrip } = useInitiateRoundTrip(
    (data: any) => {
      console.log('Initiate Round-Trip Response ===>', data);
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
        console.log('Initiate Round-Trip Request Payload ===>', payload);
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
      }
    },
    [getRecentSearchItems, getSavedLocationItems],
  );

  const openLocationSheet = useCallback(
    (field: 'pickup' | 'drop') => {
      setActiveLocationField(field);
      setLocationQuery('');
      setSearchResults([]);
      loadSavedAndRecent(field);
      locationSheetRef.current?.present();
    },
    [loadSavedAndRecent],
  );

  const handleSelectLocation = useCallback(
    async (item: SwLocationSearchItem) => {
      const field = activeLocationField;
      if (!field) return;

      const locationLabel = item.title;
      const coords = { lat: item.latitude || 0, lng: item.longitude || 0 };

      if (field === 'pickup') {
        setPickupLocation(locationLabel);
        setPickupCoords(coords);
      } else {
        setDropLocation(locationLabel);
        setDropoffCoords(coords);
      }

      locationSheetRef.current?.close();
    },
    [activeLocationField],
  );

  useEffect(() => {
    if (locationQuery.length > 2) {
      if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
      getPlaceAutocompleteItems(locationQuery, sessionTokenRef.current).then(setSearchResults);
    } else {
      setSearchResults([]);
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
      pickupLat: pickupCoords.lat,
      pickupLng: pickupCoords.lng,
      dropoffLat: dropoffCoords.lat,
      dropoffLng: dropoffCoords.lng,
      userLat: searchBaseParams?.userLat || 17.385,
      userLng: searchBaseParams?.userLng || 78.4867,
      pickupName: pickupLocation,
      dropoffName: dropLocation,
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs: localDateTabs,
        activeDateIndex: activeTabIndex,
        searchBaseParams: baseParams,
      }),
    );

    dispatch(setCommuteData(null));
    const tripDate = tabs[activeTabIndex].date;
    const preferredTime = isReturnLeg ? '05:30 PM' : undefined;
    const apiParams = {
      pickupLat: baseParams.pickupLat,
      pickupLng: baseParams.pickupLng,
      dropoffLat: baseParams.dropoffLat,
      dropoffLng: baseParams.dropoffLng,
      userLat: baseParams.userLat,
      userLng: baseParams.userLng,
      tripDate,
      preferredTime,
    };

    searchTrips(apiParams);
    setIsEditModalVisible(false);
  };

  const tabs = localDateTabs;

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

      const { pickupName, dropoffName, ...apiBaseParams } = searchBaseParams;
      const preferredTime = isReturnLeg ? '05:30 PM' : undefined;
      searchTrips({ ...apiBaseParams, tripDate, preferredTime });
    },
    [dispatch, searchBaseParams, searchTrips, tabs, isReturnLeg],
  );

  useEffect(() => {
    if (storedActiveIndex !== undefined && storedActiveIndex !== activeTabIndex) {
      setActiveTabIndex(storedActiveIndex);
    }
  }, [storedActiveIndex]);

  const HeaderTitle = useMemo(() => {
    const pickup = pickupLocation.split(',')[0] || 'Pickup';
    const drop = dropLocation.split(',')[0] || 'Dropoff';

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
  }, [pickupLocation, dropLocation, styles, colors.primary, colors.contenttertiary]);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={HeaderTitle} onEdit={() => setIsEditModalVisible(true)} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation, HeaderTitle]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TopDateTabBar tabs={tabs} activeIndex={activeTabIndex} onTabPress={handleTabPress} />
      {isSearchingTrips && (
        <View style={{ paddingVertical: 10 }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {commuteData && commuteData.length > 0 && (
          <View style={styles.bannerCard}>
            <Text variant="semi-bold" style={styles.bannerText}>
              Showing nearest stops & bus timings on your route
            </Text>
            <Image source={ImageSource.shuttel} style={styles.shuttel} />
          </View>
        )}

        {commuteData?.map((item, idx) => (
          <BusSelectionCard key={`${item.routeId}-${idx}`} showLabel={true} data={item} onProceed={timing => handleProceed(item, timing)} />
        ))}

        {!isSearchingTrips && commuteData !== null && commuteData.length === 0 && <EmptyCommuteData />}
        {!isSearchingTrips && commuteData === null && searchBaseParams && <EmptyCommuteData />}
      </ScrollView>

      <SwTopModal isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} title="Search Bus">
        <FindCommuteCard
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropLocation={dropLocation}
          setDropLocation={setDropLocation}
          onPressPickup={() => openLocationSheet('pickup')}
          onPressDrop={() => openLocationSheet('drop')}
          dateTabs={localDateTabs}
          activeDateIndex={activeTabIndex}
          onPressDateTab={setActiveTabIndex}
          onPressCalendar={openCalendar}
          onSubmit={handleEditSubmit}
          isSearching={isSearchingTrips}
          canSubmit={!!pickupCoords && !!dropoffCoords}
          containerStyle={{ borderWidth: 0, elevation: 0, shadowOpacity: 0, paddingTop: 0, paddingHorizontal: 16, paddingBottom: 12 }}
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
        showUseCurrentLocation={false}
        savedAddresses={savedAddresses}
        recentSearches={recentSearches}
        onPressItem={handleSelectLocation}
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
