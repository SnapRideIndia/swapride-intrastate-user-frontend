import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './RentBusScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import { ImageSource } from '../../../constants/images';
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwLocationSearchBottomSheet } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { SwPopupModal } from '../../../components/common/SwPopupModal/SwPopupModal';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { rentalService } from '../../../services/RentalService';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations, useReverseGeocode } from '../../../hooks/useSearch';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { useDispatch } from 'react-redux';
import { setCurrentCoords } from '../../../slice/profileSlice';
import uuid from 'react-native-uuid';
import { ScreenNames } from '../../../navigation/constant';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

const RentBusScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  // Form State
  const [pickupItem, setPickupItem] = useState<SwLocationSearchItem | null>(null);
  const [dropItem, setDropItem] = useState<SwLocationSearchItem | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [passengerRange, setPassengerRange] = useState('1-6');
  const [loading, setLoading] = useState(false);

  // Search State
  const [activeField, setActiveField] = useState<'pickup' | 'drop'>('pickup');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const locationSheetRef = useRef<BottomSheetModal>(null);
  const sessionTokenRef = useRef<string | null>(null);

  // Modal State
  const [datePickerType, setDatePickerType] = useState<'departure' | 'arrival' | null>(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();
  const { getReverseGeocodeItems } = useReverseGeocode();
  const { getCurrentLocation } = useGetLocation();

  const passengers = ['1-4', '1-6', '7-17', '18-25', '26-35', '35+'];

  const getSessionToken = () => {
    if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
    return sessionTokenRef.current;
  };

  const loadSavedAndRecent = useCallback(async (type: 'pickup' | 'drop') => {
    setIsSavedLoading(true);
    try {
      const [saved, recent] = await Promise.all([getSavedLocationItems(), getRecentSearchItems(type)]);
      setSavedAddresses(saved);
      setRecentSearches(recent);
    } catch (e) {
      setSavedAddresses([]);
      setRecentSearches([]);
    } finally {
      setIsSavedLoading(false);
    }
  }, [getRecentSearchItems, getSavedLocationItems]);

  const handleOpenSearch = (field: 'pickup' | 'drop') => {
    setActiveField(field);
    setLocationQuery('');
    setSearchResults([]);
    loadSavedAndRecent(field);
    locationSheetRef.current?.present();
  };

  useEffect(() => {
    if (locationQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setIsLoadingResults(true);
      const items = await getPlaceAutocompleteItems(locationQuery, getSessionToken());
      setSearchResults(items || []);
      setIsLoadingResults(false);
    }, 400);
    return () => clearTimeout(delay);
  }, [locationQuery]);

  const handleSelectLocation = (item: SwLocationSearchItem) => {
    if (activeField === 'pickup') setPickupItem(item);
    else setDropItem(item);
    locationSheetRef.current?.dismiss();
  };

  const handleUseCurrentLocation = async () => {
    const position = await getCurrentLocation();
    if (position?.coords) {
      dispatch(setCurrentCoords(position.coords as any));
      const items = await getReverseGeocodeItems(position.coords.latitude, position.coords.longitude, getSessionToken());
      if (items.length > 0) handleSelectLocation(items[0]);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const response = await rentalService.createRentalRequest({
        originAddress: pickupItem!.subtitle || pickupItem!.title,
        originLat: pickupItem!.latitude!,
        originLng: pickupItem!.longitude!,
        destinationAddress: dropItem!.subtitle || dropItem!.title,
        destinationLat: dropItem!.latitude!,
        destinationLng: dropItem!.longitude!,
        departureDate: departureDate!.toISOString(),
        arrivalDate: arrivalDate!.toISOString(),
        passengerRange,
      });

      if (response.success) {
        setIsSuccessVisible(true);
      } else {
        Alert.alert('Submission Failed', response.error || 'Please try again later.');
      }
    } catch (error: any) {
      Alert.alert('Network Error', 'Unable to submit your request. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      !!pickupItem &&
      !!dropItem &&
      !!departureDate &&
      !!arrivalDate &&
      (pickupItem.id !== dropItem.id && pickupItem.title !== dropItem.title)
    );
  }, [pickupItem, dropItem, departureDate, arrivalDate]);

  const renderIcon = (source: any) => (
    <Image source={source} style={styles.fieldIcon} resizeMode="contain" />
  );

  return (
    <View style={styles.container}>
      <PrimaryHeader 
        title="Rent a Bus" 
        onBackBtnPress={() => navigation.goBack()} 
        renderRightIcon={() => (
          <PrimaryButton 
            title="My Requests"
            onPress={() => navigation.navigate(ScreenNames.RENTAL_REQUESTS_SCREEN)}
            btnStyle={{ height: 32, paddingVertical: 0, paddingHorizontal: 12, backgroundColor: colors.primaryLight }}
            textStyle={{ fontSize: 11, color: '#FFFFFF' }}
          />
        )}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <View style={styles.introContainer}>
            <Text variant="semi-bold" style={styles.introTitle}>
              SwapRide Rentals
            </Text>
            <Text variant="medium" style={styles.introSubtitle}>
              Rent buses for local and outstation trips.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => handleOpenSearch('pickup')}>
              <View pointerEvents="none">
                <SwTextInput
                  title="Trip origin"
                  placeholder="Select pickup location"
                  value={pickupItem?.title || ''}
                  renderTitleIcon={() => renderIcon(ImageSource.Home)}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={() => handleOpenSearch('drop')}>
              <View pointerEvents="none">
                <SwTextInput
                  title="Trip destination"
                  placeholder="Select destination"
                  value={dropItem?.title || ''}
                  renderTitleIcon={() => renderIcon(ImageSource.office)}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={() => setDatePickerType('departure')}>
              <View pointerEvents="none">
                <SwTextInput
                  title="Date of departure"
                  placeholder="Select departure date"
                  value={departureDate ? format(departureDate, 'do MMM, yyyy') : ''}
                  renderTitleIcon={() => renderIcon(ImageSource.calenderOutline)}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={() => setDatePickerType('arrival')}>
              <View pointerEvents="none">
                <SwTextInput
                  title="Date of arrival"
                  placeholder="Select arrival date"
                  value={arrivalDate ? format(arrivalDate, 'do MMM, yyyy') : ''}
                  renderTitleIcon={() => renderIcon(ImageSource.calenderOutline)}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.passengerSection}>
            <View style={styles.passengerHeader}>
              <Image source={ImageSource.userOutline} style={styles.fieldIcon} />
              <Text variant="semi-bold" style={styles.passengerLabel}>
                Number of passengers
              </Text>
            </View>
            <View style={styles.chipsContainer}>
              {passengers.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setPassengerRange(item)}
                  style={[styles.chip, passengerRange === item && styles.chipSelected]}
                >
                  <Text variant="medium" style={[styles.chipText, passengerRange === item && styles.chipTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={loading ? 'Requesting...' : 'Request a Callback'}
          disabled={loading || !isFormValid}
          onPress={handleSubmit}
        />
      </View>

      <SwLocationSearchBottomSheet
        ref={locationSheetRef}
        title={activeField === 'pickup' ? 'Search Origin' : 'Search Destination'}
        query={locationQuery}
        onChangeQuery={setLocationQuery}
        searchResults={searchResults}
        isSearchResultsLoading={isLoadingResults}
        isSavedAddressesLoading={isSavedLoading}
        isRecentSearchesLoading={isSavedLoading}
        savedAddresses={savedAddresses}
        recentSearches={recentSearches}
        onPressItem={handleSelectLocation}
        showUseCurrentLocation
        onPressUseCurrentLocation={handleUseCurrentLocation}
      />

      <DatePicker
        modal
        open={datePickerType !== null}
        date={
          datePickerType === 'arrival' 
            ? (arrivalDate || departureDate || new Date()) 
            : (departureDate || new Date())
        }
        mode="date"
        minimumDate={
          datePickerType === 'arrival' 
            ? (departureDate || new Date()) 
            : new Date()
        }
        onConfirm={date => {
          if (datePickerType === 'departure') {
            setDepartureDate(date)
            if (arrivalDate && date > arrivalDate) {
              setArrivalDate(null);
            }
          } else {
            setArrivalDate(date);
          }
          setDatePickerType(null);
        }}
        onCancel={() => setDatePickerType(null)}
      />

      <SwPopupModal isVisible={isSuccessVisible} onClose={() => {
        setIsSuccessVisible(false);
        navigation.goBack();
      }} centerTitle>
        <View style={styles.modalContent}>
          <Image source={ImageSource.checkCircle} style={styles.successIcon} />
          <Text variant="bold" style={styles.successTitle}>
            Request Submitted!
          </Text>
          <Text variant="medium" style={styles.successSubtitle}>
            Our team will call you shortly to confirm your booking.
          </Text>
          <PrimaryButton 
            title="Okay" 
            onPress={() => {
              setIsSuccessVisible(false);
              navigation.goBack();
            }} 
            btnStyle={styles.modalButton}
          />
        </View>
      </SwPopupModal>
    </View>
  );
};

export default RentBusScreen;
