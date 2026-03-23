import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { AuthStep, setAccessToken, setAuthStep, setIsForgotPassword, setIsNewUser, setRefreshToken, setVerificationId } from '../../../../slice/authSlice';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../navigation/constant';
import { useStyles } from './EnterPassword.styles';
import { useEmailLogin } from '../../../../hooks/useAuth';
import { showToast } from '../../../../utils/showToast';
import { storage } from '../../../../utils/store';
import { StorageKeys } from '../../../../constants/storage/storageKeys';
import { validateEmailOrPhone, validatePassword } from '../../../../utils/validation';
import { ensureFcmToken } from '../../../../utils/notificationUtility';

const EnterPassword = () => {
  const [userCred, setUserCred] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { fcm_token } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onSuccessLogin = (data: any) => {
    if (data && data?.isNewUser) {
      showToast('success', '', data?.message ?? "Please register here!", 1500);
      dispatch(setAuthStep(2));
      dispatch(setVerificationId(data?.verificationId));
      dispatch(setIsNewUser(true));
      storage.set(StorageKeys.IS_NEW_USER, true);
    } else {
      dispatch(setAccessToken(data.accessToken));
      dispatch(setRefreshToken(data.refreshToken));
      storage.set(StorageKeys.ACCESS_TOKEN, data.accessToken);
      storage.set(StorageKeys.REFRESH_TOKEN, data.refreshToken);
      showToast('success', '', data.message ?? "Login Successful!", 3000);
      if (data.isNewUser) {
        (navigation as any).navigate(ScreenNames.SET_PROFILE_SCREEN as never, {
          isFromRegister: true,
        });
      } else {
        navigation.navigate(ScreenNames.DASHBOARD_SCREEN as never);
      }
    }
  };

  const onErrorLogin = (error: any) => {
    showToast("error", error?.message, "", 1500)
  };

  const { mutate: login } = useEmailLogin(onSuccessLogin, onErrorLogin)

  const handleChange = (key: string, value: string) => {
    setUserCred(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handlePressButton = async () => {
    const emailError = validateEmailOrPhone(userCred.email);
    const passwordError = validatePassword(userCred.password);

    const newErrors: { email?: string; password?: string } = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const fcmToken = fcm_token || await ensureFcmToken();
      const payload = {
        identifier: userCred.email,
        password: userCred.password,
        "fcmToken": fcmToken,
        "deviceType": Platform.OS === "ios" ? "IOS" : "ANDROID"
      }
      login(payload)
    } catch (error) {

    }
  };

  const handlePressPhno = () => {
    console.log('Pressing phno ===>');
    dispatch(setAuthStep(AuthStep.Step0));
  };

  const handlePressForgotPassword = () => {
    dispatch(setAuthStep(AuthStep.Step0));
    dispatch(setIsForgotPassword(true));
  }

  const handleRenderRightIcon = () => {
    return <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
      <Image source={ImageSource.eyeOff} style={styles.eyeOff} />
    </TouchableOpacity>;
  };
  return (
    <>
      <View style={styles.container}>
        <TextInput
          title={'Email Address Or Phone Number'}
          isPhno={false}
          value={userCred.email}
          onChangeText={text => handleChange('email', text)}
          errorText={errors.email}
        />
        <View>
          <TextInput
            title={'Password'}
            isPhno={false}
            renderRightIcon={handleRenderRightIcon}
            value={userCred.password}
            onChangeText={text => handleChange('password', text)}
            secureTextEntry={!showPassword}
            errorText={errors.password}
          />
          <Text style={styles.forgotPassword} onPress={handlePressForgotPassword}>Forgot Password?</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.loginPhno} variant="bold" onPress={handlePressPhno}>
          Login using phone number
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Proceed" onPress={handlePressButton} />
      </View>
    </>
  );
};

export default EnterPassword;
