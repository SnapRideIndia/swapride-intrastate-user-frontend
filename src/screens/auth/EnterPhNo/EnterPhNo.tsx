import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './EnterPhNo.styles'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { Image, Platform, View } from 'react-native'
import { ImageSource } from '../../../constants/images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import EnterOtp from '../../../components/domain/login/EnterOtp/EnterOtp'
import EnterPhno from '../../../components/domain/login/EnterPhno/EnterPhno'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import EnterPassword from '../../../components/domain/login/EnterPassword/EnterPassword'
const EnterPhNo = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const {step} = useSelector((store: RootState)=>store.auth);
  console.log("This is current step ===>", step)
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container} >

      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareScrollContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image source={ImageSource.banner} style={styles.banner} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle} varient='bold'>Welcome to Swapride!</Text>
            <Text style={styles.bannerSubTitle} varient='regular'>Daily office travel, made simple — book your ride in just a few taps.</Text>
          </View>
        </View>

       {
        step === 0 &&  <EnterPhno />
       }
        {
        step === 1 &&  <EnterOtp />
       }
       {
        step === 2 &&  <EnterPassword />
       }
       

        {/* <EnterOtp /> */}
        {/* <EnterPassword /> */}

        {/* <View style={styles.spacer} /> */}

        {/* <View style={styles.buttonContainer}>
          <PrimaryButton title='Send OTP' />
        </View> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default EnterPhNo;
