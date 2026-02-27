import { Image, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './EnterPhno.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { useLogin } from '../../../../hooks/useAuth';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStep, setAuthStep, setPhno } from '../../../../slice/authSlice';
import { RootState } from '../../../../store';

const EnterPhno = () => {
  const [authCred, setAuthCred] = useState({
    phNo: "",
    refcode: ""
  })
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const dispatch = useDispatch();
  const {step} = useSelector((store: RootState)=>store.auth)

  const onSuccessSendOTP = async (data: any) => {
      dispatch(setAuthStep(step < 3 ? step+1 : step));
  }

  const onErrorSendOTP = async (error: any) => {
    console.log("Error login data ===>", error);
  }

  const { mutate: login } = useLogin(onSuccessSendOTP, onErrorSendOTP);

  const handlePressSendOtp = ()=>{
    try {
      dispatch(setPhno(authCred.phNo));
      const data = {
        mobileNumber: authCred.phNo
      }
      login(data);
    } catch (error) {
      console.log("This is error ===>", error)
    }
  }

  const handleValueCahnge = (key: string, value: string) => {
    setAuthCred((prev) => ({ ...prev, [key]: value }))
  }

  console.log("this is authCred ===>", authCred.phNo, authCred.refcode)
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput title={"Enter your number"} isPhno={true} value={authCred.phNo} onChangeText={(text) => handleValueCahnge("phNo", text)} keyboardType='number-pad' maxLength={10} />
        <TextInput title={"Have any Referral Code?"} isPhno={false} value={authCred.refcode} onChangeText={(text) => handleValueCahnge("refcode", text)} />
        <View style={styles.checkBoxAndConditionContainer}>
          <Image source={ImageSource.greenCheckbox} style={styles.checkbox} />
          <Text>I agree to share my Personally identifiable Information like name,email,mobile number , etc. I agree to the Terms of service and Privacy Policy of swapride app</Text>
        </View>
        <View style={styles.spacer} />
        <Text varient='bold' style={styles.linkText}>Login using Password</Text>
      </View>

      <View style={styles.spacer} />


      <View style={styles.buttonContainer}>
        <PrimaryButton title='Send OTP' onPress={handlePressSendOtp}/>
      </View>
    </>

  )
}

export default EnterPhno

const styles = StyleSheet.create({})