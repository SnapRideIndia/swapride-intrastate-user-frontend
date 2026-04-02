import { Image, ImageSourcePropType, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './ViewProfile.styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ProfileHeader from '../../../components/domain/profile/Header/ProfileHeader/ProfileHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { useDeleteProfile, useFetchCurrentProfile, useFetchTravelPreferences } from '../../../hooks/useProfile';
import {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setLogout } from '../../../slice/authSlice';
import { showCustomToast } from '../../../utils/customToast';
import { useLogout } from '../../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from '../../../utils/store';
import { StorageKeys } from '../../../constants/storage/storageKeys';
import { ScreenNames } from '../../../navigation/constant';
import { setCurrentCoords, setProfileData } from '../../../slice/profileSlice';
import { Switch } from 'react-native-switch';
import { SwModal } from '../../../components/common/SwModal';
import { RootState } from '../../../store';

const ViewProfile = () => {
  const [phNo, setPhNo] = useState('');
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: profileData } = useFetchCurrentProfile();
  const { data: travelPreferences, isLoading: isTravelPreferencesLoading, refetch: refetchTravelPreference } = useFetchTravelPreferences();
  const {fcm_token} = useSelector((store:RootState)=>store.auth)

  const onSuccessfulDeleteProfile = (data: any) => {
    console.log("This is the delete data response ===>", data);
    handleConfirmDelete();
    performLogout();
  }
  const onErrorDeleteProfile = (error: any) => {
    console.log("This is error in delete profile ===>", error);
  }

  const onSuccessLogout = (data: any) => {
    console.log('This is logout reponse ===>', data);
  };

  const onErrorLogout = (error: any) => {
    console.log('This is error response ===>', error);
  };

  const { mutate: logout } = useLogout(onSuccessLogout, onErrorLogout);
  const { mutate: deleteProfile } = useDeleteProfile(onSuccessfulDeleteProfile, onErrorDeleteProfile)

  console.log('This is travelPreference data ==>', travelPreferences);

  const deleteAccountSheetRef = useRef<BottomSheetModal>(null);

  const openDeleteAccountSheet = useCallback(() => {
    deleteAccountSheetRef.current?.present();
  }, []);

  const closeDeleteAccountSheet = useCallback(() => {
    deleteAccountSheetRef.current?.dismiss();
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // Hook your delete-account API here
    deleteAccountSheetRef.current?.dismiss();
  }, []);

  const handlePressDeleteAccount = () => {
    openDeleteAccountSheet();
  };

  const handleCloseDeleteConfirmModal = () => {
    setIsDeleteConfirmModalVisible(false);
  };

  const handleConfirmDeleteAccount = () => {
    setIsDeleteConfirmModalVisible(false);
    try {
      deleteProfile();
    } catch (error: any) {
      console.log("Error in delete profile api >>>", error?.message);
    }
  };

  const handlePressProceed = () => {
    if (!phNo) {
      showCustomToast("error", "Please enter phone number associated with this account!", '', 1500);
      return;
    }
    setIsDeleteConfirmModalVisible(true);
  }

  const performLogout = () => {
    try {
      dispatch(setProfileData(null));
      dispatch(setCurrentCoords(null))
      dispatch(setLogout());
      storage.set(StorageKeys.ACCESS_TOKEN, '');
      storage.set(StorageKeys.REFRESH_TOKEN, '');
      showCustomToast('success', 'Logged out successfully!', '', 1500);
      (navigation as any).reset({
        index: 0,
        routes: [{ name: ScreenNames.LOGIN_SCREEN as any }],
      });
      // api calling
      logout({
         fcmToken: fcm_token
      });
    } catch (error) {
      console.error('Error of logout ===>', error?.toString());
    }
  };

  const handlePressLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalVisible(false);
    performLogout();
  };

  useFocusEffect(React.useCallback(() => {
    refetchTravelPreference();
  }, []))


  useEffect(() => {
    const renderHeader = () => <ProfileHeader profileData={profileData} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation, profileData]);

  const homeAddress = travelPreferences?.home?.address ?? 'Not set';
  const officeAddress = travelPreferences?.office?.address ?? 'Not set';
  const officeTimings = travelPreferences?.officeTimings ?? 'Not set';

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        {/* first block */}
        <View style={styles.cardblock}>
          <Text variant="semi-bold" style={styles.cardTitle}>
            Travel Preferences
          </Text>

          <View style={styles.travelPreferenceCardsContainer}>
            <TravelPreferenceCard
              title="Home Address"
              description={isTravelPreferencesLoading ? 'Loading...' : homeAddress}
              renderLeftIcon={() => <Image source={ImageSource.Home} style={styles.cardIcon} />}
            />
            <TravelPreferenceCard
              title="Office Address"
              description={isTravelPreferencesLoading ? 'Loading...' : officeAddress}
              renderLeftIcon={() => <Image source={ImageSource.office} style={styles.cardIcon} />}
            />
            <TravelPreferenceCard
              title="Office Timings"
              description={isTravelPreferencesLoading ? 'Loading...' : officeTimings}
              renderLeftIcon={() => <Image source={ImageSource.clock} style={styles.cardIcon} />}
            />
          </View>
        </View>
        {/* second blcok */}
        <View style={styles.cardblock}>
          <Text variant="semi-bold" style={[styles.cardTitle, { marginBottom: 0 }]}>
            Communication Preferences
          </Text>
          <Text variant="semi-bold" style={[styles.cardSubtitle, { marginBottom: 23 }]}>
            This will help us inform you better
          </Text>

          <View style={styles.travelPreferenceCardsContainer}>
            <CommunicationPreferenceCard title='Bus chat notifications' iconUri={ImageSource.bellOutline} />
            <CommunicationPreferenceCard title='Reaching destination alerts' iconUri={ImageSource.falg} />
            <CommunicationPreferenceCard title='Whatsapp communications' iconUri={ImageSource.whatsapp} />
          </View>
        </View>
        <PrimaryButton title={'Logout'} btnStyle={styles.btnStyle} onPress={handlePressLogout} />
        <PrimaryButton
          title={'Delete Account'}
          onPress={handlePressDeleteAccount}
          btnStyle={styles.logoutbtn}
          renderLeftIcon={() => <Image source={ImageSource.delete} style={{ width: 16, height: 18 }} />}
          textStyle={styles.textStyle}
        />
      </ScrollView>

      <BottomSheetModal
        ref={deleteAccountSheetRef}
        index={0}
        enableDynamicSizing
        enablePanDownToClose
        onDismiss={() => setPhNo('')}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />
        )}
        backgroundStyle={styles.deleteSheetBackground}
        handleIndicatorStyle={styles.deleteSheetHandleIndicator}
      >
        <BottomSheetView
          style={{
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: 26,
            paddingTop: 19,
            gap: 11,
          }}
        >
          <View style={styles.header}>
            <Text variant="semi-bold" style={styles.headerTitle}>
              Are you sure you want to delete your account?
            </Text>
            <TouchableOpacity onPress={closeDeleteAccountSheet}>
              <Image source={ImageSource.cross} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>

          <Text variant="medium" style={styles.deleteDesc}>
            Your personal data,bookings, and transaction history will be deleted and cannot be recovered if you do not log in to the app
            within 14 days.
          </Text>

          <View style={styles.inputContainer}>
            <Text variant="semi-bold" style={styles.inputTitle}>
              Enter your registered mobile number to proceed
            </Text>
            <View style={styles.inputInnerContainer}>
              <Text>+91 | </Text>
              <BottomSheetTextInput placeholder="Enter Mobile Number" value={phNo} onChangeText={setPhNo} keyboardType='number-pad' style={{ flex: 1 }} />
            </View>
          </View>

          <View style={styles.btnContainer}>
            <View style={styles.btnWrapper}>
              <PrimaryButton title="Cancel" btnStyle={{ backgroundColor: colors.contentDisabled }} onPress={closeDeleteAccountSheet} />
            </View>
            <View style={styles.btnWrapper}>
              <PrimaryButton title="Proceed" onPress={handlePressProceed} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <SwModal
        isVisible={isLogoutModalVisible}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        title="Confirm logout"
        subTitle="Are you sure you want to log out from this account?"
        confirmText="Logout"
        isDestructive
      />

      <SwModal
        isVisible={isDeleteConfirmModalVisible}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDeleteAccount}
        title="Confirm account deletion"
        subTitle="Are you sure you want to delete your account?"
        confirmText="Delete"
        isDestructive
      />
    </SafeAreaView>
  );
};

export default ViewProfile;

const TravelPreferenceCard = ({
  title,
  description,
  renderLeftIcon,
}: {
  title: string;
  description: string | ReactNode;
  renderLeftIcon?: () => ReactNode;
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.travelPreferenceCardContainer}>
      <Text style={styles.cardLabel}>{title}</Text>
      <View style={styles.addressContainer}>
        {renderLeftIcon?.()}
        <Text style={styles.cardValue} numberOfLines={2}>{description}</Text>
      </View>
    </View>
  );
};

const CommunicationPreferenceCard = ({ iconUri, title }: { iconUri: ImageSourcePropType, title: string }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const handleToggleSwitch = () => {
    setIsEnabled((prev) => !prev);
  }
  return (
    <View style={styles.addressContainer}>
      <Image source={iconUri} style={styles.cardIcon} />
      <Text style={styles.cardValue}>{title}</Text>
      <View style={styles.spacer} />

      <Switch
        value={isEnabled}
        onValueChange={handleToggleSwitch}
        circleSize={20}
        barHeight={22}
        backgroundInactive={colors.contentDisabled}
        backgroundActive={colors.primary}
        renderActiveText={false}
        renderInActiveText={false}
        changeValueImmediately
        circleBorderWidth={2}
        innerCircleStyle={styles.circleStyle}
        outerCircleStyle={styles.circleStyle}
        circleBorderActiveColor={colors.primary}
        circleBorderInactiveColor={colors.contentDisabled}
      />

    </View>
  );
};
