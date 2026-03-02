import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './ViewProfile.styles'
import { useNavigation } from '@react-navigation/native'
import ProfileHeader from '../../../components/domain/profile/Header/ProfileHeader/ProfileHeader'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { ImageSource } from '../../../constants/images'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { useFetchCurrentProfile, useFetchTravelPreferences } from '../../../hooks/useProfile'
import {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ViewProfile = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data: profileData } = useFetchCurrentProfile();
  const { data: travelPreferences, isLoading: isTravelPreferencesLoading } = useFetchTravelPreferences();

  console.log("This is travelPreference data ==>", travelPreferences)

  const deleteAccountSheetRef = useRef<BottomSheetModal>(null);
  const [deletePhoneNumber, setDeletePhoneNumber] = useState('');

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

  useEffect(() => {
    const renderHeader = () => <ProfileHeader profileData={profileData} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation, profileData]);

  const home = travelPreferences?.home ?? null;
  const office = travelPreferences?.office ?? null;
  const officeTimings = travelPreferences?.officeTimings ?? null;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle} >
        {/* first block */}
        <View style={styles.cardblock}>
          <Text varient='semi-bold' style={styles.cardTitle}>Travel Preferences</Text>

          <View style={styles.travelPreferenceCardsContainer}>
            <TravelPreferenceCard
              title="Home Address"
              description={isTravelPreferencesLoading ? 'Loading...' : (home || 'Not set')}
              renderLeftIcon={() => <Image source={ImageSource.Home} style={styles.cardIcon} />}
            />
            <TravelPreferenceCard
              title="Office Address"
              description={isTravelPreferencesLoading ? 'Loading...' : (office || 'Not set')}
              renderLeftIcon={() => <Image source={ImageSource.office} style={styles.cardIcon} />}
            />
            <TravelPreferenceCard
              title="Office Timings"
              description={isTravelPreferencesLoading ? 'Loading...' : (officeTimings || 'Not set')}
              renderLeftIcon={() => <Image source={ImageSource.clock} style={styles.cardIcon} />}
            />
          </View>

        </View>
        {/* second blcok */}
        <View style={styles.cardblock}>
          <Text varient='semi-bold' style={[styles.cardTitle, { marginBottom: 0 }]}>Communication Preferences</Text>
          <Text varient='semi-bold' style={[styles.cardSubtitle, { marginBottom: 23 }]}>This will help us inform you better</Text>

          <View style={styles.travelPreferenceCardsContainer}>
            <CommunicationPreferenceCard />
            <CommunicationPreferenceCard />
            <CommunicationPreferenceCard />
          </View>

        </View>
        <PrimaryButton title={'Logout'} btnStyle={styles.btnStyle} />
        <PrimaryButton
          title={'Delete Account'}
          onPress={openDeleteAccountSheet}
          btnStyle={styles.logoutbtn}
          renderLeftIcon={() => (
            <Image source={ImageSource.delete} style={{ width: 16, height: 18 }} />
          )}
          textStyle={styles.textStyle}
        />

      </ScrollView>

      <BottomSheetModal
        ref={deleteAccountSheetRef}
        index={0}
        enableDynamicSizing
        enablePanDownToClose
        onDismiss={() => setDeletePhoneNumber('')}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            pressBehavior="close"
          />
        )}
        backgroundStyle={styles.deleteSheetBackground}
        handleIndicatorStyle={styles.deleteSheetHandleIndicator}
      >
        <BottomSheetView style={{ paddingBottom: Math.max(insets.bottom, 20), paddingHorizontal: 26, paddingTop: 19, gap: 11 }}>
          <View style={styles.header}>
            <Text varient='semi-bold' style={styles.headerTitle}>Are you sure you want to delete your
              account?</Text>
           <TouchableOpacity onPress={closeDeleteAccountSheet}>
             <Image source={ImageSource.cross} style={styles.crossIcon} />
           </TouchableOpacity>
          </View>

          <Text varient='medium' style={styles.deleteDesc}>Your personal data,bookings, and transaction history will be deleted and  cannot be recovered if you do not log in to the app within 14 days.</Text>

          <View style={styles.inputContainer}>
            <Text varient='semi-bold' style={styles.inputTitle}>Enter your registered mobile number to proceed</Text>
            <View style={styles.inputInnerContainer}>
              <Text>+91 | </Text>
              <BottomSheetTextInput placeholder='Enter Mobile Number' />
            </View>
          </View>

          <View style={styles.btnContainer}>
            <View style={styles.btnWrapper}>
              <PrimaryButton title='Cancel' btnStyle={{backgroundColor: colors.contentDisabled}} onPress={closeDeleteAccountSheet}/>
            </View>
            <View style={styles.btnWrapper}>
              <PrimaryButton title='Proceed'/>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}

export default ViewProfile


const TravelPreferenceCard = ({ title, description, renderLeftIcon }: { title: string, description: string, renderLeftIcon?: () => ReactNode }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.travelPreferenceCardContainer}>
      <Text style={styles.cardText}>{title}</Text>
      <View style={styles.addressContainer}>
        {
          renderLeftIcon?.()
        }
        <Text style={styles.cardText}>{description}</Text>
        <View style={styles.spacer} />
      </View>
    </View>
  )
}

const CommunicationPreferenceCard = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (

    <View style={styles.addressContainer}>
      <Image source={ImageSource.Home} style={styles.cardIcon} />
      <Text style={styles.cardText}>Bus chat notification</Text>
    </View>

  )
}