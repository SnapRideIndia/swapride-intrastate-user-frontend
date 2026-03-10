import { Platform, View, Image, TouchableOpacity, ImageSourcePropType, Modal } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SwTextInput as TextInput } from '../../../components/common/SwTextInput/SwTextInput';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ImagePickerBottomSheet } from '../../../components/common/ImagePickerBottomSheet';
import { useUpdateProfile, useFetchCurrentProfile } from '../../../hooks/useProfile';
import type { ProfileObj } from '../../../services/ProfileService';
import { useStyles } from './SetYourProfileScreen.styles';
import type { RootStackParamList } from '../../../navigation/types';
import { format } from 'date-fns';
import {
  SwLocationSearchBottomSheet,
  type SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations } from '../../../hooks/useSearch';

const INITIAL_PROFILE: ProfileObj = {
  fullName: '',
  mobileNumber: '',
  emailAddress: '',
  gender: '',
  dateOfBirth: '',
  bloodGroup: '',
};

type SetProfileRouteProp = RouteProp<RootStackParamList, 'SetYourProfileScreen'>;

const apiDateToDisplay = (yyyyMmDd: string): string => {
  if (!yyyyMmDd) return '';
  const parts = yyyyMmDd.split('-');
  if (parts.length !== 3) return yyyyMmDd;
  const [y, m, d] = parts;
  return `${d?.padStart(2, '0')}/${m?.padStart(2, '0')}/${y}`;
};

const SetYourProfileScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const route = useRoute<SetProfileRouteProp>();
  const { isFromOtp } = route.params ?? {};

  const [profileObj, setProfileObj] = useState<ProfileObj>(INITIAL_PROFILE);
  const [homeAddress, setHomeAddress] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showBloodGroupModal, setShowBloodGroupModal] = useState(false);
  const hasPrefilled = useRef(false);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');

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

  const [timePickerDate, setTimePickerDate] = useState<Date>(new Date());
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const locationSheetRef = useRef<BottomSheetModal>(null);
  const [activeLocationField, setActiveLocationField] = useState<'home' | 'office'>('home');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);

  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const { data: currentProfile } = useFetchCurrentProfile();
  const { mutate: updateProfileApi, isPending } = useUpdateProfile();

  console.log("this is currentprofile inside set your profile screen ===>", currentProfile);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={'Set your profile'} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  useEffect(() => {
    // if (!isFromOtp || !currentProfile || hasPrefilled.current) return;
    hasPrefilled.current = true;
    const p = currentProfile as Record<string, unknown>;
    setProfileObj({
      fullName: (p?.fullName as string) ?? '',
      mobileNumber: (p?.mobileNumber as string) ?? '',
      emailAddress: (p?.email as string) ?? '',
      gender: (p?.gender as string) ?? '',
      dateOfBirth: apiDateToDisplay((p?.dateOfBirth as string) ?? ''),
      bloodGroup: (p?.bloodGroup as string) ?? '',
    });
    if (p?.profileUrl) {
      setProfileImage(p?.profileUrl as string);
    }
  }, [isFromOtp, currentProfile]);

  const updateProfile = (field: keyof ProfileObj, value: string) => {
    setProfileObj(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenImagePicker = () => {
    setShowImagePickerSheet(true);
  };

  const handleSelectCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: false,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
          setProfileImage(response.assets[0].uri);
        }
      },
    );
  };

  const getTimeDisplayValue = useCallback((d: Date | null) => {
    if (!d) return '00:00 AM';
    try {
      return format(d, 'hh:mm a');
    } catch (e) {
      return '00:00 AM';
    }
  }, []);

  const handleSelectGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
          setProfileImage(response.assets[0].uri);
        }
      },
    );
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day && month && year) {
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

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
      if (activeTimeField === 'start') {
        setOfficeStartTime(date);
      } else {
        setOfficeEndTime(date);
      }
      setIsTimePickerOpen(false);
    },
    [activeTimeField],
  );

  const handleDateConfirm = (date: Date) => {
    updateProfile('dateOfBirth', formatDate(date));
    setShowDatePicker(false);
  };

  const getDobDisplayValue = () => {
    return profileObj.dateOfBirth || 'Select date';
  };

  const genderOptions = ['Male', 'Female', 'Others'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const loadSavedAndRecent = useCallback(async () => {
    try {
      const [saved, recent] = await Promise.all([getSavedLocationItems(), getRecentSearchItems('pickup')]);
      setSavedAddresses(saved);
      setRecentSearches(recent);
    } catch (e) {
      setSavedAddresses([]);
      setRecentSearches([]);
    }
  }, [getRecentSearchItems, getSavedLocationItems]);

  const openLocationSheet = useCallback(
    (field: 'home' | 'office') => {
      setActiveLocationField(field);
      setLocationQuery('');
      setSearchResults([]);
      loadSavedAndRecent();
      locationSheetRef.current?.present();
    },
    [loadSavedAndRecent],
  );

  const handleSelectLocation = useCallback(
    (item: SwLocationSearchItem) => {
      const valueToFill = item.subtitle || item.title;
      if (activeLocationField === 'home') {
        setHomeAddress(valueToFill);
      } else {
        setOfficeAddress(valueToFill);
      }
      // @ts-ignore - BottomSheetModal ref type
      locationSheetRef.current?.dismiss?.();
    },
    [activeLocationField],
  );

  useEffect(() => {
    const q = locationQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const items = await getPlaceAutocompleteItems(q, 'profile-session');
        if (!cancelled) {
          setSearchResults(items ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setSearchResults([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locationQuery, getPlaceAutocompleteItems]);

  const handleSave = () => {
    updateProfileApi(
      { profileObj, profileImageUri: profileImage },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareScrollContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.imageOuterContainer} onPress={handleOpenImagePicker} activeOpacity={0.8}>
          <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} resizeMode="cover" />
              ) : (
                <Image source={ImageSource.userOutline as ImageSourcePropType} style={styles.placeholderIcon} resizeMode="contain" />
              )}
            </View>
            <View style={[styles.cameraIconContainer]}>
              {/* <FontAwesome6 name="camera" size={16} color={colors.primary} /> */}
              <Image source={ImageSource.camera} style={styles.cameraIcon} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.imageDes}>Upload Your profile picture</Text>

        <View style={[styles.devider, { marginTop: 18 }]} />
        <View style={styles.inputContainer}>
          {true && (
            <View style={{ gap: 10 }}>
              <Text variant="semi-bold" style={styles.sectionTitle}>
                Basic Details
              </Text>
              <Text variant="medium" style={[styles.sectionSubtitle, { width: 293 }]}>
                This will help us find the best stops and timings for your commute
              </Text>
            </View>
          )}
          <TextInput
            title="Full Name"
            renderTitleIcon={() => <Image source={ImageSource.userOutline as ImageSourcePropType} style={styles.titleIcon} />}
            value={profileObj.fullName}
            onChangeText={v => updateProfile('fullName', v)}
            placeholder="Enter your full name"
          />
          <TextInput
            title="Mobile Number"
            renderTitleIcon={() => <Image source={ImageSource.callOutline as ImageSourcePropType} style={styles.titleIcon} />}
            value={profileObj.mobileNumber}
            onChangeText={v => updateProfile('mobileNumber', v)}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
          />
          <TextInput
            title="Email Address"
            renderTitleIcon={() => <Image source={ImageSource.emailOutline as ImageSourcePropType} style={styles.titleIcon} />}
            value={profileObj.emailAddress}
            onChangeText={v => updateProfile('emailAddress', v)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
          <View style={styles.rowInputs}>
            <View style={styles.flexInput}>
              <TouchableOpacity onPress={() => setShowGenderModal(true)}>
                <TextInput
                  title="Gender"
                  renderTitleIcon={() => (
                    <Image source={ImageSource.genderOutline as ImageSourcePropType} style={styles.titleIcon} />
                  )}
                  value={profileObj.gender}
                  editable={false}
                  placeholder="Select gender"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.flexInput}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  title="Date of Birth"
                  renderTitleIcon={() => <Image source={ImageSource.calenderOutline as ImageSourcePropType} style={styles.titleIcon} />}
                  value={getDobDisplayValue()}
                  editable={false}
                  placeholder="Select date"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rowInputs}>
            <View style={styles.flexInput}>
              <TouchableOpacity onPress={() => setShowBloodGroupModal(true)}>
                <TextInput
                  title="Blood Group"
                  renderTitleIcon={() => (
                    <Image source={ImageSource.bloodOutline as ImageSourcePropType} style={styles.titleIcon} />
                  )}
                  value={profileObj.bloodGroup}
                  editable={false}
                  placeholder="Select blood group"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
        {!isFromOtp && <View style={[styles.devider, { marginTop: 18 }]} />}

        {!isFromOtp && (
          <View style={styles.inputContainer}>
            <View style={{ gap: 10 }}>
              <Text variant="semi-bold" style={styles.sectionTitle}>
                Travel Preferences
              </Text>
              <Text variant="medium" style={styles.sectionSubtitle}>
                This will help us find the best stops and timings for your commute
              </Text>
            </View>

            <TouchableOpacity onPress={() => openLocationSheet('home')}>
              <TextInput
                title="Home Address"
                renderTitleIcon={() => (
                  <Image source={ImageSource.Home as ImageSourcePropType} style={styles.titleIcon} />
                )}
                value={homeAddress}
                editable={false}
                placeholder="Search your home address"
                pointerEvents="none"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLocationSheet('office')}>
              <TextInput
                title="Office Address"
                renderTitleIcon={() => (
                  <Image source={ImageSource.office as ImageSourcePropType} style={styles.titleIcon} />
                )}
                value={officeAddress}
                editable={false}
                placeholder="Search your office address"
                pointerEvents="none"
              />
            </TouchableOpacity>

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
          </View>
        )}
      </KeyboardAwareScrollView>

      <View style={styles.spacer} />
      <View style={styles.buttonContainer}>
        <PrimaryButton title={isPending ? 'Saving...' : 'Save'} onPress={handleSave} disabled={isPending} />
      </View>

      <ImagePickerBottomSheet
        visible={showImagePickerSheet}
        onClose={() => setShowImagePickerSheet(false)}
        onSelectCamera={handleSelectCamera}
        onSelectGallery={handleSelectGallery}
      />

      {/* Gender selection modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text variant="semi-bold" style={styles.modalTitle}>
              Select Gender
            </Text>
            {genderOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  updateProfile('gender', option);
                  setShowGenderModal(false);
                }}
              >
                <Text variant="medium" style={styles.modalOptionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Blood group selection modal */}
      <Modal
        visible={showBloodGroupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBloodGroupModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text variant="semi-bold" style={styles.modalTitle}>
              Select Blood Group
            </Text>
            {bloodGroupOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  updateProfile('bloodGroup', option);
                  setShowBloodGroupModal(false);
                }}
              >
                <Text variant="medium" style={styles.modalOptionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={showDatePicker}
        date={parseDate(profileObj.dateOfBirth)}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      />

      <SwLocationSearchBottomSheet
        ref={locationSheetRef}
        title={activeLocationField === 'home' ? 'Search Home Address' : 'Search Office Address'}
        query={locationQuery}
        onChangeQuery={setLocationQuery}
        searchResults={searchResults}
        showUseCurrentLocation={false}
        savedAddresses={savedAddresses}
        recentSearches={recentSearches}
        onPressItem={handleSelectLocation}
        onClose={() => {
          setLocationQuery('');
          setSearchResults([]);
        }}
      />

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

export default SetYourProfileScreen;
