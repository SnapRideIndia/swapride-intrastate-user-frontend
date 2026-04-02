import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SwLocationSearchBottomSheet } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import type { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { RootState } from '../../../store';
import { setCurrentCoords } from '../../../slice/profileSlice';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import uuid from 'react-native-uuid';
import type { ICoords } from '../../../types/coords.types';
import { usePlaceAutocomplete, useRecentSearch, useReverseGeocode, useSavedLocations, useSaveLocation } from '../../../hooks/useSearch';
import DatePicker from 'react-native-date-picker';
import { format, isToday } from 'date-fns';
import { ScreenNames } from '../../../navigation/constant';
import { setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import { useStyles } from './FindCommute.styles';
import { FindCommuteCard } from '../../../components/domain/booking/FindCommuteCard/FindCommuteCard';
import type { CommuteDateTab } from '../../../types/commuteDates.types';
import { useLocationSheetBackHandler } from '../../../hooks/useLocationSheetBackHandler';

const FindCommute = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch<AppDispatch>();
  const currentCoords = useSelector((state: RootState) => state.profile.currentCoords);

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupItem, setPickupItem] = useState<SwLocationSearchItem | null>(null);
  const [dropItem, setDropItem] = useState<SwLocationSearchItem | null>(null);
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');

  const handleSwapLocations = useCallback(() => {
    const tempItem = pickupItem;
    const tempLocation = pickupLocation;
    setPickupItem(dropItem);
    setPickupLocation(dropLocation);
    setDropItem(tempItem);
    setDropLocation(tempLocation);
  }, [pickupItem, dropItem, pickupLocation, dropLocation]);

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

  const formatTabTitle = useCallback((d: Date) => {
    if (isToday(d)) return 'Today';
    return format(d, 'EEE, do MMM');
  }, []);

  const defaultDateTabs = useMemo<CommuteDateTab[]>(() => {
    const today = new Date();
    return [0, 1, 2].map(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      return {
        id: toDateKey(d),
        date: toDateKey(d),
        title: formatTabTitle(d),
      };
    });
  }, [formatTabTitle, toDateKey]);

  const [dateTabs, setDateTabs] = useState<CommuteDateTab[]>(defaultDateTabs);
  const [activeDateIndex, setActiveDateIndexLocal] = useState(0);

  const onErrorTrips = useCallback((_error: any) => {}, []);

  const getSessionToken = useCallback(() => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = String(uuid.v4());
    }
    return sessionTokenRef.current;
  }, []);

  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);
  const [isSavedAndRecentLoading, setSavedAndRecentLoading] = useState(false);
  const [isSearchResultsLoading, setSearchResultsLoading] = useState(false);

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

  useEffect(() => {
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
        title: formatTabTitle(d),
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
      setSearchResultsLoading(false);
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
      setSearchResultsLoading(true);
      (async () => {
        try {
          const items = await getPlaceAutocompleteItems(q, token);
          if (requestId !== autocompleteRequestIdRef.current) return;
          setSearchResults(items ?? []);
        } catch (e) {
          if (requestId !== autocompleteRequestIdRef.current) return;
          setSearchResults([]);
        } finally {
          if (requestId === autocompleteRequestIdRef.current) {
            setSearchResultsLoading(false);
          }
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
      setSearchResultsLoading(false);
      sessionTokenRef.current = null;
      setSavedAndRecentLoading(true);
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

    let userLat = currentCoords?.latitude;
    let userLng = currentCoords?.longitude;

    if (typeof userLat !== 'number' || typeof userLng !== 'number') {
      const position = await getCurrentLocation();
      if (position?.coords) {
        dispatch(setCurrentCoords(position.coords as unknown as ICoords));
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
      }
    }

    if (typeof userLat !== 'number' || typeof userLng !== 'number') return;

    const payloadBase = {
      pickup: {
        latitude: pickupLat,
        longitude: pickupLng,
        address: pickupItem!.subtitle || pickupItem!.title,
        placeName: pickupItem!.title || undefined,
      },
      dropoff: {
        latitude: dropoffLat,
        longitude: dropoffLng,
        address: dropItem!.subtitle || dropItem!.title,
        placeName: dropItem!.title || undefined,
      },
      userLocation: {
        latitude: userLat,
        longitude: userLng,
      },
    };

    const tripDate = dateTabs[activeDateIndex]?.date ?? toDateKey(new Date());

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex,
        searchBaseParams: payloadBase,
      }),
    );

    dispatch(setCommuteData(null));
    navigation.navigate(ScreenNames.BUS_SELECTION_SCREEN as never);
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
          onSwapLocations={handleSwapLocations}
          dateTabs={dateTabs}
          activeDateIndex={activeDateIndex}
          onPressDateTab={handlePressDateTab}
          onPressCalendar={openCalendar}
          onSubmit={handleSubmit}
          isSearching={false}
          canSubmit={canSubmit}
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
          showUseCurrentLocation
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
