import { Image, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { useStyles } from './SuggestYourStops.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SwPickupDropInputCard } from '../../../components/common/SwPickupDropInputCard/SwPickupDropInputCard';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SwLocationSearchBottomSheet } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import uuid from 'react-native-uuid';
import { usePlaceAutocomplete, useRecentSearch, useReverseGeocode, useSavedLocations } from '../../../hooks/useSearch';
import { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { ScreenNames } from '../../../navigation/constant';
import type { RootStackParamList } from '../../../navigation/types';
import SuggestionService from '../../../services/SuggestionService';
import { showCustomToast } from '../../../utils/customToast';

const SuggestYourStops = () => {
  const [selectedSlot, setSelectedSlot] = useState({ morning: true, evening: false });
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupItem, setPickupItem] = useState<SwLocationSearchItem | null>(null);
  const [dropItem, setDropItem] = useState<SwLocationSearchItem | null>(null);
  const [destReachingTimeDate, setDestReachingTimeDate] = useState<Date | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [timePickerDate, setTimePickerDate] = useState<Date>(new Date());
  const [isCheck, setIsCheck] = useState(false);
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const locationSheetRef = useRef<BottomSheetModal>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);
  const [savedRecentLoading, setSavedRecentLoading] = useState(false);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');
  const [hasMySuggestions, setHasMySuggestions] = useState(false);

  const { getCurrentLocation } = useGetLocation();
  const { getReverseGeocodeItems } = useReverseGeocode();
  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const getSessionToken = useCallback(() => {
    if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
    return sessionTokenRef.current;
  }, []);

  const loadSavedAndRecent = useCallback(async () => {
    setSavedRecentLoading(true);
    try {
      const [saved, recent] = await Promise.all([getSavedLocationItems(), getRecentSearchItems('pickup')]);
      setSavedAddresses(saved);
      setRecentSearches(recent);
    } catch {
      setSavedAddresses([]);
      setRecentSearches([]);
    } finally {
      setSavedRecentLoading(false);
    }
  }, [getSavedLocationItems, getRecentSearchItems]);

  const openLocationSheet = useCallback(
    (field: 'pickup' | 'drop') => {
      setActiveLocationField(field);
      setLocationQuery('');
      setSearchResults([]);
      sessionTokenRef.current = null;
      loadSavedAndRecent();
      locationSheetRef.current?.present();
    },
    [loadSavedAndRecent],
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
    if (!position?.coords) return;
    const { latitude, longitude } = position.coords;
    const token = getSessionToken();
    const items = await getReverseGeocodeItems(latitude, longitude, token);
    if (!items.length) {
      setSearchResults([]);
      return;
    }
    setSearchResults(items);
    handleSelectLocation(items[0]);
  }, [getCurrentLocation, getReverseGeocodeItems, getSessionToken, handleSelectLocation]);

  useEffect(() => {
    const q = locationQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchResultsLoading(true);
    let cancelled = false;
    if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
    getPlaceAutocompleteItems(q, sessionTokenRef.current)
      .then(items => {
        if (!cancelled) setSearchResults(items ?? []);
      })
      .catch(() => {
        if (!cancelled) setSearchResults([]);
      })
      .finally(() => {
        if (!cancelled) setSearchResultsLoading(false);
      });
    return () => { cancelled = true; };
  }, [locationQuery, getPlaceAutocompleteItems]);

  const handlePressSlot = useCallback((slot: 'morning' | 'evening') => {
    if (slot === 'morning') setSelectedSlot(prev => ({ ...prev, morning: true, evening: false }));
    else setSelectedSlot(prev => ({ ...prev, morning: false, evening: true }));
  }, []);

  const getTimeDisplayValue = useCallback((d: Date | null) => {
    if (!d) return '00:00 AM';
    try {
      return format(d, 'hh:mm a');
    } catch {
      return '00:00 AM';
    }
  }, []);

  const openReachingTimePicker = useCallback(() => {
    setTimePickerDate(destReachingTimeDate ?? new Date());
    setIsTimePickerOpen(true);
  }, [destReachingTimeDate]);

  const handleConfirmReachingTime = useCallback((date: Date) => {
    setDestReachingTimeDate(date);
    setIsTimePickerOpen(false);
  }, []);

  const canSubmit = useMemo(() => {
    const hasPickup = !!pickupItem && pickupItem.latitude != null && pickupItem.longitude != null;
    const hasDrop = !!dropItem && dropItem.latitude != null && dropItem.longitude != null;
    const hasReachingTime = !!destReachingTimeDate;
    return hasPickup && hasDrop && hasReachingTime;
  }, [pickupItem, dropItem, destReachingTimeDate]);

  const handleSubmit = useCallback(async () => {
    if (!pickupItem || pickupItem.latitude == null || pickupItem.longitude == null) {
      showCustomToast('error', 'Please select a pickup location', '', 2000);
      return;
    }
    if (!dropItem || dropItem.latitude == null || dropItem.longitude == null) {
      showCustomToast('error', 'Please select a drop location', '', 2000);
      return;
    }
    if (!destReachingTimeDate) {
      showCustomToast('error', 'Please select destination reaching time', '', 2000);
      return;
    }
    const reachingTime = format(destReachingTimeDate, 'h:mm a');
    setIsSubmitting(true);
    try {
      await SuggestionService.createStopSuggestion({
        pickupAddress: pickupItem.subtitle || pickupItem.title || '',
        pickupLat: Number(pickupItem.latitude),
        pickupLng: Number(pickupItem.longitude),
        dropoffAddress: dropItem.subtitle || dropItem.title || '',
        dropoffLat: Number(dropItem.latitude),
        dropoffLng: Number(dropItem.longitude),
        shift: selectedSlot.morning ? 'MORNING' : 'EVENING',
        reachingTime,
        description: desc.trim() || undefined,
        updatePrefs: isCheck,
      });
      showCustomToast('success', 'Suggestion submitted', '', 2000);
      setPickupLocation('');
      setDropLocation('');
      setPickupItem(null);
      setDropItem(null);
      setDestReachingTimeDate(null);
      setDesc('');
      setIsCheck(false);
      setSelectedSlot({ morning: true, evening: false });
    } catch (e: any) {
      showCustomToast('error', e?.message ?? 'Failed to submit suggestion', '', 2000);
    } finally {
      setIsSubmitting(false);
    }
  }, [pickupItem, dropItem, destReachingTimeDate, selectedSlot.morning, desc, isCheck]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      SuggestionService.listMySuggestions(0, 10)
        .then(res => {
          if (!cancelled) setHasMySuggestions((res?.data?.length ?? 0) > 0);
        })
        .catch(() => {
          if (!cancelled) setHasMySuggestions(false);
        });
      return () => { cancelled = true; };
    }, []),
  );

  const handleSaveLocationPress = useCallback(
    (item: SwLocationSearchItem) => {
      locationSheetRef.current?.dismiss();
      navigation.navigate(ScreenNames.ADD_EDIT_LOCATION_SCREEN, {
        mode: 'add',
        prefilledLocation: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          latitude: item.latitude,
          longitude: item.longitude,
        },
      });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <PrimaryHeader title="Suggest your stops" />,
    });
  }, [navigation]);
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}> */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareScrollContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* input container */}
        <View style={styles.cardContainer}>
          <View style={styles.rowGap10}>
            <View style={styles.flex1Gap16}>
              <SwPickupDropInputCard
                showSwapArrow
                pickupInputProps={{
                  title: 'Preferred Pickup location',
                  placeholder: 'Enter pickup location',
                  value: pickupLocation,
                  onChangeText: setPickupLocation,
                }}
                dropInputProps={{
                  title: 'Preferred Drop location',
                  placeholder: 'Enter drop location',
                  value: dropLocation,
                  onChangeText: setDropLocation,
                }}
                onPressPickup={() => openLocationSheet('pickup')}
                onPressDrop={() => openLocationSheet('drop')}
              />
            </View>
          </View>
          <View style={styles.sectionTop24}>
            <Text style={styles.selectShiftText}>Select shift</Text>
            <View style={styles.slotRow}>
              <TouchableOpacity style={styles.option} onPress={() => handlePressSlot('morning')} activeOpacity={0.8}>
                <Image source={selectedSlot.morning ? ImageSource.checkCircle : ImageSource.uncheckCircle} style={styles.checkCircle} />
                <Text style={styles.optionText}>Morning</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => handlePressSlot('evening')} activeOpacity={0.8}>
                <Image source={selectedSlot.evening ? ImageSource.checkCircle : ImageSource.uncheckCircle} style={styles.checkCircle} />
                <Text style={styles.optionText}>Evening</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reachingTimeWrap}>
              <View style={styles.reachingTimeRow}>
                <Image source={ImageSource.clock} style={styles.clockIcon} />
                <Text style={styles.reachingTimeTitle}>Destination reaching time</Text>
              </View>
              <TouchableOpacity
                style={styles.reachingTimeInput}
                onPress={openReachingTimePicker}
                activeOpacity={0.8}
              >
                <Text style={destReachingTimeDate ? styles.reachingTimeValue : styles.reachingTimeValuePlaceholder}>
                  {getTimeDisplayValue(destReachingTimeDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={() => setIsCheck(prev => !prev)}>
              <Image source={isCheck ? ImageSource.checkSquare : ImageSource.uncheckbox} style={styles.checkSquare} />
            </TouchableOpacity>
            <Text style={styles.optionText}>Update this info to Travel Preferences on My Profile</Text>
          </View>

          <View style={styles.descriptionWrap}>
            <TextInput
              placeholder="Please provide a detailed description for your suggestion"
              placeholderTextColor={colors.contenttertiary}
              multiline
              numberOfLines={6}
              value={desc}
              onChangeText={setDesc}
              style={styles.descriptionInput}
            />
          </View>

          <View style={styles.submitWrap}>
            <PrimaryButton
              title={isSubmitting ? 'Submitting...' : 'Submit'}
              onPress={handleSubmit}
              disabled={isSubmitting || !canSubmit}
              btnStyle={styles.submitButton}
            />
          </View>
        </View>

        {hasMySuggestions && (
          <View style={styles.viewMySuggestionsWrap}>
            <PrimaryButton
              title="View My Suggestions"
              onPress={() => navigation.navigate(ScreenNames.MY_SUGGESTIONS)}
              btnStyle={styles.viewMySuggestionsButton}
              textStyle={styles.viewMySuggestionsButtonText}
            />
          </View>
        )}
      </KeyboardAwareScrollView>

            <SwLocationSearchBottomSheet
              ref={locationSheetRef}
              title={activeLocationField === 'pickup' ? 'Search Pickup Address' : 'Search Drop Address'}
              query={locationQuery}
              onChangeQuery={setLocationQuery}
              searchResults={searchResults}
              isSearchResultsLoading={searchResultsLoading}
              isSavedAddressesLoading={savedRecentLoading}
              isRecentSearchesLoading={savedRecentLoading}
              showUseCurrentLocation
              onPressUseCurrentLocation={handleUseCurrentLocation}
              savedAddresses={savedAddresses}
              recentSearches={recentSearches}
              onPressItem={handleSelectLocation}
              onSaveLocationPress={handleSaveLocationPress}
              onClose={() => {
                setLocationQuery('');
                setSearchResults([]);
                sessionTokenRef.current = null;
              }}
            />
      <DatePicker
        modal
        open={isTimePickerOpen}
        date={timePickerDate}
        mode="time"
        onConfirm={handleConfirmReachingTime}
        onCancel={() => setIsTimePickerOpen(false)}
      />
        </SafeAreaView>
    )
}

export default SuggestYourStops;
