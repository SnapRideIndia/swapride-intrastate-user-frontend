import { Image, ScrollView, StyleSheet, View } from 'react-native'
import React, { ReactNode, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './ViewProfile.styles'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import ProfileHeader from '../../../components/domain/profile/Header/ProfileHeader/ProfileHeader'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { ImageSource } from '../../../constants/images'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { useFetchCurrentProfile, useFetchTravelPreferences } from '../../../hooks/useProfile'

const ViewProfile = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const { data: profileData } = useFetchCurrentProfile();
  const { data: travelPreferences, isLoading: isTravelPreferencesLoading } = useFetchTravelPreferences();

  console.log("This is travelPreference data ==>", travelPreferences)

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
        <PrimaryButton title={'Delete Account'} btnStyle={styles.logoutbtn} renderLeftIcon={() => <Image source={ImageSource.delete} style={{ width: 16, height: 18 }} />} textStyle={styles.textStyle} />

      </ScrollView>
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