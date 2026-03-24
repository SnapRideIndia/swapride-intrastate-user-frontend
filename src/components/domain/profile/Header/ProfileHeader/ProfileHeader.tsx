import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './ProfileHeader.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../../navigation/constant';

const ProfileHeader = ({ profileData }: { profileData: any }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    navigation.navigate(ScreenNames.SET_PROFILE_SCREEN as never);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={ImageSource.leftArrow} style={styles.leftArrow} />
        </TouchableOpacity>
        {/* <Text style={{ color: colors.primaryCtaText }}>edit</Text> */}
        <TouchableOpacity onPress={handleEditPress}>
          <Image source={ImageSource.edit} style={styles.edit} />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsSection}>
          <Text variant="semi-bold" style={[styles.detailtext, { marginBottom: 8, fontSize: 20 }]}>
            {profileData?.fullName}
          </Text>
          <Text variant="medium" style={[styles.detailtext]}>
            {profileData?.mobileNumber}
          </Text>
          <Text variant="medium" style={[styles.detailtext]}>
            {profileData?.email}
          </Text>
          <Text variant="medium" style={[styles.detailtext]}>
            {profileData?.gender}
          </Text>
        </View>
        <View style={styles.profileContainer}>
          <Image source={profileData.profileUrl ? { uri: profileData?.profileUrl }: ImageSource.userOutline} style={profileData.profileUrl ? { width: '100%', height: '100%', borderRadius: 100 }: {}} resizeMode="contain"/>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;
