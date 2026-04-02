import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useStyles } from './index.styles';
import { SwText as Text } from '../../components/common/SwText/SwText';
import { ImageSource } from '../../constants/images';
import { ScreenNames } from '../constant';
import { useFetchCurrentProfile } from '../../hooks/useProfile';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../slice/authSlice';
import { storage } from '../../utils/store';
import { StorageKeys } from '../../constants/storage/storageKeys';
import { useLogout } from '../../hooks/useAuth';
import { setCurrentCoords, setProfileData } from '../../slice/profileSlice';
import { RootState } from '../../store';
import UserAvatar from '../../components/common/UserAvatar/UserAvatar';
import { SwModal } from '../../components/common/SwModal';
import { showCustomToast } from '../../utils/customToast';

const drawerItems = [
  {
    id: 1,
    iconUri: ImageSource.bookmarkOutline,
    title: 'Saved places',
    navigateTo: ScreenNames.SAVED_PLACES_SCREEN,
  },
  {
    id: 2,
    iconUri: ImageSource.megaPhone,
    title: 'Policy',
    navigateTo: ScreenNames.POLICY_SCREEN,
  },
  {
    id: 3,
    iconUri: ImageSource.suggestYourStops,
    title: 'Suggest your stops',
    navigateTo: ScreenNames.SUGGEST_YOUR_STOPS,
  },
  {
    id: 4,
    iconUri: ImageSource.busOutline,
    title: 'Rent a bus',
    navigateTo: ScreenNames.RENT_A_BUS_SCREEN,
  },
//   {
//     id: 5,
//     iconUri: ImageSource.settingsOutline,
//     title: 'Account setting',
//     navigateTo: ScreenNames.ACCOUNT_SETTING_SCREEN,
//   },
];

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { navigation } = props;
  const dispatch = useDispatch();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { data: profileData, isLoading, isError, error, refetch } = useFetchCurrentProfile();
  const {fcm_token} = useSelector((store: RootState)=>store.auth)

  const onSuccessLogout = (data: any) => {
    console.log('This is logout reponse ===>', data);
  };

  const onErrorLogout = (error: any) => {
    console.log('This is error response ===>', error);
  };

  const { mutate: logout } = useLogout(onSuccessLogout, onErrorLogout);

  const handlePressItem = (navScreen: any) => {
    navigation.navigate(navScreen);
  };

  const handlePressHeader = () => {
    navigation.navigate(ScreenNames.VIEW_PROFILE as never);
  };

  const performLogout = () => {
    try {
      dispatch(setLogout());
      dispatch(setProfileData(null));
      dispatch(setCurrentCoords(null))
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

  useEffect(() => {
    dispatch(setProfileData(profileData));
  }, [profileData]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('This is refteching again ===>');
      refetch();
      console.log('This is profileData after refetch ===>', profileData);
    }, []),
  );

  return (
    <View style={styles.drawerContainer}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* header */}
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.header} onPress={handlePressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
              <UserAvatar url={profileData?.profileUrl} name={profileData?.fullName} size={44} />
              <View style={{ gap: 5 }}>
                <Text variant="medium" style={styles.name}>
                  {profileData?.fullName}
                </Text>
                <Text variant="semi-bold" style={styles.number}>
                  {profileData?.mobileNumber}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image source={ImageSource.rightTriangleArrow} style={{ width: 7, height: 14.58 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.dropDownItemsContainer}>
          {drawerItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.drawerItem} onPress={() => handlePressItem(item.navigateTo)}>
              <Image source={item.iconUri} style={styles.icon} />
              <Text variant="medium" style={styles.drawerItemTitle}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.logoutBtnSafeArea}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handlePressLogout}>
          <Text variant="semi-bold" style={styles.logoutTitle}>
            Logout
          </Text>
          <Image source={ImageSource.logoutOutline} style={styles.icon} />
        </TouchableOpacity>
      </SafeAreaView>
      <SwModal
        isVisible={isLogoutModalVisible}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        title="Confirm logout"
        subTitle="Are you sure you want to log out from this account?"
        confirmText="Logout"
        isDestructive
      />
    </View>
  );
};

export default CustomDrawerContent;
