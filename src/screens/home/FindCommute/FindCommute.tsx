import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  SwLocationSearchBottomSheet,
  SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { RootState } from '../../../store';
import { setCurrentCoords } from '../../../slice/profileSlice';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import uuid from 'react-native-uuid';
import type { ICoords } from '../../../types/coords.types';
import { usePlaceAutocomplete, useRecentSearch, useReverseGeocode, useSavedLocations, useSearchTrips } from '../../../hooks/useSearch';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { ScreenNames } from '../../../navigation/constant';
import { setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import { useStyles } from './FindCommute.styles';
import { FindCommuteCard } from '../../../components/domain/booking/FindCommuteCard/FindCommuteCard';
import type { CommuteDateTab } from '../../../types/commuteDates.types';
import { useLocationSheetBackHandler } from '../../../hooks/useLocationSheetBackHandler';

const FindCommute = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();
  const currentCoords = useSelector((state: RootState) => state.profile.currentCoords);

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupItem, setPickupItem] = useState<SwLocationSearchItem | null>(null);
  const [dropItem, setDropItem] = useState<SwLocationSearchItem | null>(null);
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');
  const locationSheetRef = useRef<BottomSheetModal>(null);
  const { onChange: onSheetChange, onClose: onSheetClose } = useLocationSheetBackHandler(locationSheetRef);
  const [locationQuery, setLocationQuery] = useState('');
  const sessionTokenRef = useRef<string | null>(null);
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const autocompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autocompleteRequestIdRef = useRef(0);
  const { getCurrentLocation } = useGetLocation();
  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getReverseGeocodeItems } = useReverseGeocode();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarPickerDate, setCalendarPickerDate] = useState<Date>(new Date());

  const toDateKey = useCallback((d: Date) => format(d, 'yyyy-MM-dd'), []);

  const formatDayWithSuffix = useCallback((day: number) => {
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
  }, []);

  const weekDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatTabTitle = useCallback(
    (d: Date, today: Date) => {
      const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

      if (isToday) return 'Today';

      const dayWithSuffix = formatDayWithSuffix(d.getDate());
      const month = monthShortNames[d.getMonth()];
      const weekDay = weekDayShortNames[d.getDay()];
      return `${weekDay}, ${dayWithSuffix} ${month}`;
    },
    [formatDayWithSuffix],
  );

  const defaultDateTabs = useMemo<CommuteDateTab[]>(() => {
    const today = new Date();
    return [0, 1, 2].map(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      return {
        id: toDateKey(d),
        date: toDateKey(d),
        title: formatTabTitle(d, today),
      };
    });
  }, [formatTabTitle, toDateKey]);

  const [dateTabs, setDateTabs] = useState<CommuteDateTab[]>(defaultDateTabs);
  const [activeDateIndex, setActiveDateIndexLocal] = useState(0);

  const onSuccessTrips = useCallback((data: any) => {
    console.log('searchTrips success >>>', data);
    dispatch(setCommuteData(data));
    navigation.navigate(ScreenNames.BUS_SELECTION_SCREEN as never);
  }, []);

  const onErrorTrips = useCallback((error: any) => {
    console.log('searchTrips error >>>', error);
  }, []);

  const { mutate: searchTrips, isPending: isSearchingTrips } = useSearchTrips(onSuccessTrips, onErrorTrips);

  const getSessionToken = useCallback(() => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = String(uuid.v4());
    }
    return sessionTokenRef.current;
  }, []);

  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);

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

  useEffect(() => {
    // Initial render load (default active field = pickup)
    loadSavedAndRecent('pickup');
  }, [loadSavedAndRecent]);

  const handlePressDateTab = useCallback((index: number) => {
    setActiveDateIndexLocal(index);
  }, []);

  const openCalendar = useCallback(() => {
    const currentTab = dateTabs[activeDateIndex];
    if (currentTab) {
      setCalendarPickerDate(new Date(`${currentTab.date}T00:00:00`));
    } else {
      setCalendarPickerDate(new Date());
    }
    setIsDatePickerOpen(true);
  }, [activeDateIndex, dateTabs]);

  const handleCalendarConfirm = useCallback(
    (d: Date) => {
      const today = new Date();
      const key = toDateKey(d);

      const existingIdx = dateTabs.findIndex(t => t.date === key);
      if (existingIdx >= 0) {
        setActiveDateIndexLocal(existingIdx);
        setIsDatePickerOpen(false);
        return;
      }

      const customTab: CommuteDateTab = {
        id: key,
        date: key,
        title: formatTabTitle(d, today),
        isCustom: true,
      };

      const base = defaultDateTabs;
      const nextTabs = [...base, customTab].slice(0, 4);
      setDateTabs(nextTabs);
      setActiveDateIndexLocal(nextTabs.length - 1);
      setIsDatePickerOpen(false);
    },
    [dateTabs, defaultDateTabs, formatTabTitle, toDateKey],
  );

  const handleSelectLocation = useCallback(
    (item: SwLocationSearchItem) => {
      const valueToFill = item.subtitle || item.title;
      if (activeLocationField === 'pickup') {
        setPickupLocation(valueToFill);
        setPickupItem(item);
      } else {
        setDropLocation(valueToFill);
        setDropItem(item);
      }
      locationSheetRef.current?.dismiss();
    },
    [activeLocationField],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    const position = await getCurrentLocation();
    if (!position || !position.coords) {
      return;
    }

    const { latitude, longitude } = position.coords;
    dispatch(setCurrentCoords(position.coords as unknown as ICoords));

    const token = getSessionToken();
    const items = await getReverseGeocodeItems(latitude, longitude, token);

    if (!items.length) {
      setSearchResults([]);
      return;
    }

    setSearchResults(items);
    handleSelectLocation(items[0]);
  }, [dispatch, getCurrentLocation, getReverseGeocodeItems, getSessionToken, handleSelectLocation]);

  useEffect(() => {
    const q = locationQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
        autocompleteTimeoutRef.current = null;
      }
      return;
    }

    const token = getSessionToken();
    const requestId = ++autocompleteRequestIdRef.current;

    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }

    autocompleteTimeoutRef.current = setTimeout(() => {
      (async () => {
        try {
          const items = await getPlaceAutocompleteItems(q, token);
          // Ignore stale responses (user typed again).
          if (requestId !== autocompleteRequestIdRef.current) return;
          setSearchResults(items ?? []);
        } catch (e) {
          if (requestId !== autocompleteRequestIdRef.current) return;
          setSearchResults([]);
        }
      })();
    }, 400);

    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
        autocompleteTimeoutRef.current = null;
      }
    };
  }, [locationQuery, getPlaceAutocompleteItems, getSessionToken]);

  const openLocationSheet = useCallback(
    (field: 'pickup' | 'drop') => {
      setActiveLocationField(field);
      setLocationQuery('');
      setSearchResults([]);
      sessionTokenRef.current = null;
      loadSavedAndRecent(field);
      locationSheetRef.current?.present();
    },
    [loadSavedAndRecent],
  );

  const canSubmit = !!pickupItem?.latitude && !!pickupItem?.longitude && !!dropItem?.latitude && !!dropItem?.longitude;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    const pickupLat = pickupItem!.latitude!;
    const pickupLng = pickupItem!.longitude!;
    const dropoffLat = dropItem!.latitude!;
    const dropoffLng = dropItem!.longitude!;

    // let userLat = currentCoords?.latitude;
    // let userLng = currentCoords?.longitude;

    let userLat = 17.385;
    let userLng = 78.4867;

    if (typeof userLat !== 'number' || typeof userLng !== 'number') {
      const position = await getCurrentLocation();
      if (position?.coords) {
        dispatch(setCurrentCoords(position.coords as unknown as ICoords));
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
      }
    }

    if (typeof userLat !== 'number' || typeof userLng !== 'number') return;

    const tripDate = dateTabs[activeDateIndex]?.date ?? toDateKey(new Date());

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex,
        searchBaseParams: {
          pickupLat,
          pickupLng,
          dropoffLat,
          dropoffLng,
          userLat,
          userLng,
          pickupName: pickupLocation,
          dropoffName: dropLocation,
        },
      }),
    );

    searchTrips({
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      tripDate,
      userLat,
      userLng,
    });
  }, [
    canSubmit,
    currentCoords?.latitude,
    currentCoords?.longitude,
    dispatch,
    activeDateIndex,
    dateTabs,
    dropItem,
    getCurrentLocation,
    pickupItem,
    searchTrips,
    toDateKey,
  ]);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title="" />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <FindCommuteCard
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropLocation={dropLocation}
          setDropLocation={setDropLocation}
          onPressPickup={() => openLocationSheet('pickup')}
          onPressDrop={() => openLocationSheet('drop')}
          dateTabs={dateTabs}
          activeDateIndex={activeDateIndex}
          onPressDateTab={handlePressDateTab}
          onPressCalendar={openCalendar}
          onSubmit={handleSubmit}
          isSearching={isSearchingTrips}
          canSubmit={canSubmit}
        />

        <SwLocationSearchBottomSheet
          ref={locationSheetRef}
          title={activeLocationField === 'pickup' ? 'Search Pickup Address' : 'Search Drop Address'}
          query={locationQuery}
          onChangeQuery={setLocationQuery}
          searchResults={searchResults}
          showUseCurrentLocation
          onPressUseCurrentLocation={handleUseCurrentLocation}
          savedAddresses={savedAddresses}
          recentSearches={recentSearches}
          onPressItem={handleSelectLocation}
          onClose={() => {
            onSheetClose();
            setLocationQuery('');
            setSearchResults([]);
            sessionTokenRef.current = null;
          }}
          onChange={onSheetChange}
        />
      </ScrollView>

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={calendarPickerDate}
        mode="date"
        minimumDate={new Date()}
        maximumDate={new Date(new Date().setDate(new Date().getDate() + 60))}
        onConfirm={handleCalendarConfirm}
        onCancel={() => setIsDatePickerOpen(false)}
      />
    </SafeAreaView>
  );
};

export default FindCommute;
