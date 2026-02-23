import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../../theme/ThemeProvider'
import { useStyles } from './ProfileHeader.styles'
import { ImageSource } from '../../../../../constants/images'
import { SwText as Text } from '../../../../common/SwText/SwText'
import { useNavigation } from '@react-navigation/native'

const ProfileHeader = ({profileData}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const handleBackPress = ()=>{
    navigation.goBack();
  }


  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={ImageSource.leftArrow} style={styles.leftArrow} />
        </TouchableOpacity>
        <Text style={{ color: colors.primaryCtaText }}>edit</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsSection}>
          <Text varient='semi-bold' style={[styles.detailtext, { marginBottom: 8, fontSize: 20 }]}>{profileData?.fullName}</Text>
          <Text varient='medium' style={[styles.detailtext]}>{profileData?.mobileNumber}</Text>
          <Text varient='medium' style={[styles.detailtext]}>{profileData?.email}</Text>
          <Text varient='medium' style={[styles.detailtext]}>{profileData?.gender}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image source={{uri: profileData?.profileUrl}} style={{width: "100%", height: "100%", borderRadius: 100}}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ProfileHeader

const styles = StyleSheet.create({})