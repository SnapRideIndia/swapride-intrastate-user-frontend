import { Image, ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BusSelction.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation } from '@react-navigation/native';
import TopDateTabBar from '../../../components/common/TopDateTabBar/TopDateTabBar';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import BusSelectionCard from '../../../components/domain/busSelection/card/BusSelectionCard/BusSelectionCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveDateIndex, setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations, useSearchTrips } from '../../../hooks/useSearch';
import { FindCommuteCard } from '../../../components/domain/booking/FindCommuteCard/FindCommuteCard';
import { SwTopModal } from '../../../components/common/SwTopModal/SwTopModal';
import {
  SwLocationSearchBottomSheet,
  SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import { useLocationSheetBackHandler } from '../../../hooks/useLocationSheetBackHandler';

const BusSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
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
    (e: any) => console.log('searchTrips error >>>', e),
  );

  const loadSavedAndRecent = useCallback(
    async (type: 'pickup' | 'drop') => {
      try {
        const [saved, recent] = await Promise.all([getSavedLocationItems(type), getRecentSearchItems(type)]);
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

  const handleEditSubmit = () => {
    if (!pickupCoords || !dropoffCoords) return;

    const baseParams = {
      pickupLat: pickupCoords.lat,
      pickupLng: pickupCoords.lng,
      dropoffLat: dropoffCoords.lat,
      dropoffLng: dropoffCoords.lng,
      userLat: 0,
      userLng: 0,
      pickupName: pickupLocation,
      dropoffName: dropLocation,
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs: storedTabs,
        activeDateIndex: activeTabIndex,
        searchBaseParams: baseParams,
      }),
    );

    const tripDate = storedTabs[activeTabIndex].date;
    searchTrips({ ...baseParams, tripDate });
  };

  useEffect(() => {
    setActiveTabIndex(storedActiveIndex ?? 0);
  }, [storedActiveIndex]);

  const formatDayWithSuffix = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fallbackTabs = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 10 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      const isToday =
        date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

      const dayWithSuffix = formatDayWithSuffix(date.getDate());
      const month = monthShortNames[date.getMonth()];
      const weekDay = weekDayShortNames[date.getDay()];

      const title = isToday ? `Today, ${dayWithSuffix} ${month}` : `${weekDay}, ${dayWithSuffix} ${month}`;

      return {
        id: `${date.getTime()}`,
        title,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      };
    });
  }, []);

  const tabs = storedTabs?.length ? storedTabs : fallbackTabs;

  const handleTabPress = useCallback(
    (index: number) => {
      setActiveTabIndex(index);
      dispatch(setActiveDateIndex(index));

      const tab = tabs[index] as any;
      const tripDate = tab?.date;
      if (!tripDate || !searchBaseParams) return;

      searchTrips({ ...searchBaseParams, tripDate });
    },
    [dispatch, searchBaseParams, searchTrips, tabs],
  );

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={'Buses'} onEdit={() => setIsEditModalVisible(true)} />;
    if (isEditModalVisible) {
      navigation.setOptions({ headerShown: false, header: renderHeader });
    } else {
      const timer = setTimeout(() => {
        navigation.setOptions({ headerShown: true, header: renderHeader });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [navigation, isEditModalVisible]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TopDateTabBar tabs={tabs} activeIndex={activeTabIndex} onTabPress={handleTabPress} />
      <View style={styles.bannerCard}>
        <Text variant="semi-bold" style={styles.bannerText}>
          Showing nearest stops & bus timings on your route
        </Text>
        <Image source={ImageSource.shuttel} style={styles.shuttel} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {commuteData?.map((item, _idx) => (
          <BusSelectionCard key={item.routeId} showLabel={true} data={item} />
        ))}
      </ScrollView>

      <SwTopModal isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} title="Search Bus">
        <FindCommuteCard
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropLocation={dropLocation}
          setDropLocation={setDropLocation}
          onPressPickup={() => openLocationSheet('pickup')}
          onPressDrop={() => openLocationSheet('drop')}
          dateTabs={storedTabs}
          activeDateIndex={activeTabIndex}
          onPressDateTab={setActiveTabIndex}
          onPressCalendar={() => {}}
          onSubmit={handleEditSubmit}
          isSearching={isSearchingTrips}
          canSubmit={!!pickupCoords && !!dropoffCoords}
          containerStyle={{ borderWidth: 0, elevation: 0, shadowOpacity: 0, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 16 }}
        />
      </SwTopModal>

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
