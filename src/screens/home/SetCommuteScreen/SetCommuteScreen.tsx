import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SetCommuteScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation } from '@react-navigation/native';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { SwPickupDropInputCard } from '../../../components/common/SwPickupDropInputCard/SwPickupDropInputCard';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwLocationSearchBottomSheet } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import type { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { RootState } from '../../../store';
import { setCurrentCoords } from '../../../slice/profileSlice';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import uuid from 'react-native-uuid';
import type { ICoords } from '../../../types/coords.types';
import { usePlaceAutocomplete, useRecentSearch, useReverseGeocode, useSavedLocations } from '../../../hooks/useSearch';
import DatePicker from 'react-native-date-picker';
import { format, isToday } from 'date-fns';
import { ScreenNames } from '../../../navigation/constant';
import { setCommuteData, setCommuteSearchContext } from '../../../slice/commuteSlice';
import type { CommuteDateTab } from '../../../types/commuteDates.types';

const SetCommuteScreen = () => {
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

  const [officeStartTime, setOfficeStartTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [officeEndTime, setOfficeEndTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(17, 0, 0, 0);
    return d;
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');
  const [timePickerDate, setTimePickerDate] = useState<Date>(new Date());
  const [tripDate] = useState<Date>(new Date());

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

  const formatTabTitle = useCallback((d: Date) => {
    if (isToday(d)) return 'Today';
    return format(d, 'EEE, do MMM');
  }, []);

  const defaultDateTabs = useMemo<CommuteDateTab[]>(() => {
    const today = new Date();
    return [0, 1, 2, 3, 4].map(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      return {
        id: format(d, 'yyyy-MM-dd'),
        date: format(d, 'yyyy-MM-dd'),
        title: formatTabTitle(d),
      };
    });
  }, [formatTabTitle]);

  const [dateTabs] = useState<CommuteDateTab[]>(defaultDateTabs);

  useEffect(() => {
    // Initial render load (default active field = pickup)
    loadSavedAndRecent('pickup');
  }, [loadSavedAndRecent]);

  const getTimeDisplayValue = useCallback((d: Date | null) => {
    if (!d) return '00:00 AM';
    try {
      return format(d, 'hh:mm a');
    } catch (e) {
      return '00:00 AM';
    }
  }, []);

  const openTimePicker = useCallback(
    (field: 'start' | 'end') => {
      setActiveTimeField(field);
      const initial = field === 'start' ? officeStartTime ?? new Date() : officeEndTime ?? new Date();
      setTimePickerDate(initial);
      setIsTimePickerOpen(true);
    },
    [officeEndTime, officeStartTime],
  );

  const handleConfirmTime = useCallback(
    (date: Date) => {
      if (activeTimeField === 'start') setOfficeStartTime(date);
      else setOfficeEndTime(date);
      setIsTimePickerOpen(false);
    },
    [activeTimeField],
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

  const canSubmit = useMemo(() => {
    return !!(
      pickupItem?.latitude &&
      pickupItem?.longitude &&
      dropItem?.latitude &&
      dropItem?.longitude &&
      officeStartTime &&
      officeEndTime
    );
  }, [pickupItem, dropItem, officeStartTime, officeEndTime]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    const pickupLat = pickupItem!.latitude!;
    const pickupLng = pickupItem!.longitude!;
    const dropoffLat = dropItem!.latitude!;
    const dropoffLng = dropItem!.longitude!;

    // For testing: force user location to Hitech City coords.
    let userLat = 17.4489;
    let userLng = 78.3832;

    const officeTimings = `${getTimeDisplayValue(officeStartTime)} - ${getTimeDisplayValue(officeEndTime)}`;

    const searchBaseParams = {
      pickup: {
        latitude: pickupLat,
        longitude: pickupLng,
        address: pickupItem!.subtitle || pickupItem!.title,
      },
      dropoff: {
        latitude: dropoffLat,
        longitude: dropoffLng,
        address: dropItem!.subtitle || dropItem!.title,
      },
      userLocation: {
        latitude: userLat,
        longitude: userLng,
      },
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex: 0,
        searchBaseParams,
        officeTimings,
      }),
    );
    dispatch(setCommuteData(null));
    navigation.navigate(ScreenNames.BUS_SELECTION_SCREEN as never);
  }, [
    canSubmit,
    currentCoords,
    dispatch,
    dropItem,
    getCurrentLocation,
    getTimeDisplayValue,
    officeEndTime,
    officeStartTime,
    pickupItem,
    tripDate,
    dateTabs,
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
        <Text variant="semi-bold" style={styles.title}>
          Tell us about your commute !
        </Text>
        <View style={styles.card}>
          <SwPickupDropInputCard
            pickupInputProps={{
              title: 'Where do you live?',
              placeholder: 'E.g. Sunshine homes',
              value: pickupLocation,
              onChangeText: setPickupLocation,
              renderTitleIcon: () => <Image source={ImageSource.Home} style={styles.titleIcon} />,
            }}
            dropInputProps={{
              title: 'Where do you work?',
              placeholder: 'E.g. Lodha Vesta',
              value: dropLocation,
              onChangeText: setDropLocation,
              renderTitleIcon: () => <Image source={ImageSource.office} style={styles.titleIcon} />,
            }}
            onPressPickup={() => openLocationSheet('pickup')}
            onPressDrop={() => openLocationSheet('drop')}
          />

          <View style={styles.timeInputContainer}>
            <View style={styles.inputTitle}>
              <Image source={ImageSource.clock} style={styles.clock} />
              <Text>Office Timing</Text>
            </View>
            <View style={styles.timeInputsWrapper}>
              <TouchableOpacity style={styles.timeInput} activeOpacity={0.8} onPress={() => openTimePicker('start')}>
                <Text>{getTimeDisplayValue(officeStartTime)}</Text>
              </TouchableOpacity>
              <Text>to</Text>
              <TouchableOpacity style={styles.timeInput} activeOpacity={0.8} onPress={() => openTimePicker('end')}>
                <Text>{getTimeDisplayValue(officeEndTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.btnContainer}>
          <PrimaryButton
            title="Submit"
              btnStyle={styles.btnStyle}
              textStyle={styles.textStyle}
              onPress={handleSubmit}
            disabled={!canSubmit}
            />
          </View>
        </View>

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
          onPressUseCurrentLocation={handleUseCurrentLocation}
          savedAddresses={savedAddresses}
          recentSearches={recentSearches}
          onPressItem={handleSelectLocation}
          onClose={() => {
            setLocationQuery('');
            setSearchResults([]);
            sessionTokenRef.current = null;
          }}
        />
      </ScrollView>

      <DatePicker
        modal
        open={isTimePickerOpen}
        date={timePickerDate}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setIsTimePickerOpen(false)}
      />
    </SafeAreaView>
  );
};

export default SetCommuteScreen;
