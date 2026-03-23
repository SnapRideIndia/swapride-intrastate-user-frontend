import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './EnterPhno.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { usePhoneLogin } from '../../../../hooks/useAuth';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStep, setAuthStep, setPhno } from '../../../../slice/authSlice';
import { RootState } from '../../../../store';
import { showToast } from '../../../../utils/showToast';
import { validatePhone } from '../../../../utils/validation';
import { ensureFcmToken } from '../../../../utils/notificationUtility';

const EnterPhno = () => {
  const [authCred, setAuthCred] = useState({
    phNo: '',
    refcode: '',
  });
  const [errors, setErrors] = useState<{ phNo?: string; refcode?: string }>({});
  const [isCheck, setIsCheck] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const dispatch = useDispatch();
  const { step, isForgotPassword } = useSelector((store: RootState) => store.auth);

  const onSuccessSendOTP = async (data: any) => {
    dispatch(setAuthStep(step < 5 ? step + 1 : step));
    showToast("success", data?.message ?? "OTP Sent!", '', 1500);
  };

  const onErrorSendOTP = async (error: any) => {
    console.log('Error login data ===>', error);
    showToast("error", data?.message ?? "Oops, Something went wrong!", '', 1500);
  };

  const { mutate: login } = usePhoneLogin(onSuccessSendOTP, onErrorSendOTP);

  const handlePressCheck = ()=>{
    setIsCheck((prev)=>!prev);
  }

  const handlePressSendOtp = async () => {
    const phError = validatePhone(authCred.phNo);

    const newErrors: { phNo?: string; refcode?: string } = {};
    if (phError) newErrors.phNo = phError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if(!isCheck){
      showToast("default", "Please select terms & condition!", "", 1500);
      return;
    }
    try {
      dispatch(setPhno(authCred.phNo));
      const data = {
        mobileNumber: authCred.phNo,
        ...(isForgotPassword ? { type: "FORGOT_PASSWORD" } : {}) 
      };
      login(data);
    } catch (error) {
      console.log('This is error ===>', error);
    }
  };

  const handlePressPhno = () => {
    dispatch(setAuthStep(AuthStep.step3));
  };

  const handleValueCahnge = (key: string, value: string) => {
    setAuthCred(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };


  console.log('this is authCred ===>', authCred.phNo, authCred.refcode);
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          title={'Enter your number'}
          isPhno={true}
          value={authCred.phNo}
          onChangeText={text => handleValueCahnge('phNo', text)}
          keyboardType="number-pad"
          maxLength={10}
          errorText={errors.phNo}
        />
        <TextInput
          title={'Have any Referral Code?'}
          isPhno={false}
          value={authCred.refcode}
          onChangeText={text => handleValueCahnge('refcode', text)}
        />
        <TouchableOpacity style={styles.checkBoxAndConditionContainer} onPress={handlePressCheck} activeOpacity={1}>
          <Image source={isCheck ? ImageSource.greenCheckbox : ImageSource.uncheckbox} style={styles.checkbox} />
          <Text>
            I agree to share my Personally identifiable Information like name,email,mobile number , etc. I agree to the Terms of service and
            Privacy Policy of swapride app
          </Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <Text variant="bold" style={styles.linkText} onPress={handlePressPhno}>
          Login using Password
        </Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Send OTP" onPress={handlePressSendOtp} />
      </View>
    </>
  );
};

export default EnterPhno;

const styles = StyleSheet.create({});
