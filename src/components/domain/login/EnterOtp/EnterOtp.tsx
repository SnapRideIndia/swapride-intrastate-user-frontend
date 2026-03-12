import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './EnterOtp.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import OTPInput from '../../../common/OTP_Input/OTPInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { AuthStep, setAccessToken, setAuthStep, setIsNewUser, setPhno, setRefreshToken, setVerificationId } from '../../../../slice/authSlice';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { usePhoneLogin, useVerifyOTP } from '../../../../hooks/useAuth';
import { showToast } from '../../../../utils/showToast';
import { storage } from '../../../../utils/store';
import { ScreenNames } from '../../../../navigation/constant';
import { StorageKeys } from '../../../../constants/storage/storageKeys';
import { useNavigation } from '@react-navigation/native';

const EnterOtp = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { step } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const { phNo, isNewUser, isForgotPassword } = useSelector((store: RootState) => store.auth);
  const navigation = useNavigation();

  const onSuccessVerifyOTP = (data: any) => {
    console.log('This is data of Successful Verify OTP >>>', data);
    dispatch(setVerificationId(data?.verificationId));
    if (isForgotPassword) {
      dispatch(setAuthStep(AuthStep.setp4));
      return;
    }
    else if (data && data?.isNewUser) {
      showToast('success', '', data?.message ?? "OTP verified successfully!", 1500);
      dispatch(setAuthStep(2));
      dispatch(setIsNewUser(true));
      // storage.set(StorageKeys.IS_NEW_USER, true);
    } else {
      dispatch(setAccessToken(data.accessToken));
      dispatch(setRefreshToken(data.refreshToken));
      storage.set(StorageKeys.ACCESS_TOKEN, data.accessToken);
      storage.set(StorageKeys.REFRESH_TOKEN, data.refreshToken);
      showToast('success', '', data.message ?? "OTP verified successfully!", 3000);
      if (isNewUser) {
        // (navigation as any).navigate(ScreenNames.SET_PROFILE_SCREEN as never, {
        //   isFromOtp: true,
        // });
        dispatch(setAuthStep(AuthStep.Step2));
      } else {
        navigation.navigate(ScreenNames.DASHBOARD_SCREEN as never);
      }
    }
  };


  const onErrorVerifyOTP = (error: any) => {
    console.log('This is Error of Verify OTP >>>', error);
    showToast('error', '', data.message ?? "OTP verification failed!", 3000);
  };

  const { mutate: verifyOTP } = useVerifyOTP(onSuccessVerifyOTP, onErrorVerifyOTP);

  const onSuccessSendOTP = async (data: any) => {
    // dispatch(setAuthStep(step < 5 ? step + 1 : step));
    showToast("success", data?.message ?? "OTP Sent!", '', 1500);
  };

  const onErrorSendOTP = async (error: any) => {
    // console.log('Error login data ===>', error);
    showToast("error", data?.message ?? "Oops, Something went wrong!", '', 1500);
  };

  const { mutate: login } = usePhoneLogin(onSuccessSendOTP, onErrorSendOTP);

  const handlePressCross = () => {
    dispatch(setAuthStep(step > 0 ? step - 1 : step));
  };

  const handlePressVerifyOtp = () => {
    try {
      const payload = {
        mobileNumber: phNo,
        otp: '543210',
        ...(isForgotPassword ? { type: "FORGOT_PASSWORD" } : {})
      };
      verifyOTP(payload);
    } catch (error) {
      console.error('this is Error of verifyOTP: ', error);
    }
  };

  const handlePressResendOtp = () => {
    console.log('Submit button clicked ===>');
    try {
      const data = {
        mobileNumber: phNo,
        ...(isForgotPassword ? { type: "FORGOT_PASSWORD" } : {})
      };
      login(data);
    } catch (error) {
      console.log('This is error ===>', error);
    }
  };

  const handlePressGetOTPonCall = ()=>{
    showToast("info","Feature is not available yet!", '', 1500);

  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} variant="semi-bold">
            Enter OTP
          </Text>
          <TouchableOpacity onPress={handlePressCross}>
            <Image source={ImageSource.cross} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.otpContainer}>
          <OTPInput />

          <View style={styles.resendOtpContainer}>
            <View style={[styles.resendOtpContainer, { gap: 8 }]}>
              <Image source={ImageSource.call} style={styles.callIcon} />
              <Text variant="semi-bold" style={styles.resend} onPress={handlePressGetOTPonCall}>
                Get OTP on Call
              </Text>
            </View>
            <Text variant="semi-bold" onPress={handlePressResendOtp}>Resend OTP</Text>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Verify OTP" onPress={handlePressVerifyOtp} />
      </View>
    </>
  );
};

export default EnterOtp;

const styles = StyleSheet.create({});
