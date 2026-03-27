import { Image, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './Register.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useRegisterUser } from '../../../../hooks/useAuth';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { AuthStep, setAccessToken, setAuthStep, setRefreshToken, setReferralCode } from '../../../../slice/authSlice';
import { storage } from '../../../../utils/store';
import { StorageKeys } from '../../../../constants/storage/storageKeys';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../navigation/constant';
import { validateEmail, validatePassword } from '../../../../utils/validation';
import { showCustomToast } from '../../../../utils/customToast';

const Register = () => {
  const { verificationId, isNewUser, referralCode: reduxReferralCode } = useSelector((store: RootState) => store.auth);
  const [userCred, setUserCred] = useState({
    name: '',
    email: '',
    password: '',
    refCode: reduxReferralCode || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleChange = (key: string, value: string) => {
    setUserCred(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const onSuccessRegistartion = async (data: any) => {
    dispatch(setAccessToken(data.accessToken));
    dispatch(setRefreshToken(data.refreshToken));
    storage.set(StorageKeys.ACCESS_TOKEN, data.accessToken);
    storage.set(StorageKeys.REFRESH_TOKEN, data.refreshToken);
    dispatch(setReferralCode(''));
    showCustomToast('success', data?.message || "Registration Successful!", '', 3000);
    (navigation as any).reset({
      index: 0,
      routes: [{ name: ScreenNames.DASHBOARD_SCREEN as any }],
    });
  };

  const onErrorRegistration = (error: any) => {
    console.log('This is Error of registartion >>>', error);
    showCustomToast('error', error?.response?.data?.message || error?.message || "Registration failed!", '', 1500);
  };

 const handlePressLogin = ()=>{
  dispatch(setAuthStep(AuthStep.Step0));
 }

 const handlePressForgotPassword = ()=>{
  dispatch(setAuthStep(AuthStep.step3))
 }

  const { mutate: register, isPending } = useRegisterUser(onSuccessRegistartion, onErrorRegistration);

  const handlePressButton = () => {
    console.log('this is usercred ===>', userCred);

    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!userCred.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    const emailError = validateEmail(userCred.email);
    const passwordError = validatePassword(userCred.password);
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        verificationId: verificationId,
        fullName: userCred.name,
        email: userCred.email,
        password: userCred.password,
        referralCode: userCred.refCode,
      };
      console.log('this is payload of register api ===>', payload);
      register(payload);
    } catch (error) {
      console.error('this is error of register ===>', error);
    }
  };

  const handleRenderRightIcon = () => {
    return (
      <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
        <Image source={ImageSource.eyeOff} style={[styles.eyeOff, { opacity: showPassword ? 1 : 0.5 }]} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          title={'Full Name'}
          isPhno={false}
          value={userCred.name}
          onChangeText={text => handleChange('name', text)}
          errorText={errors.name}
        />
        <TextInput
          title={'Email Address'}
          isPhno={false}
          value={userCred.email}
          onChangeText={text => handleChange('email', text)}
          errorText={errors.email}
        />
        <View>
          <TextInput
            title={'Set Password'}
            isPhno={false}
            renderRightIcon={handleRenderRightIcon}
            secureTextEntry={!showPassword}
            value={userCred.password}
            onChangeText={text => handleChange('password', text)}
            errorText={errors.password}
          />
         <TouchableOpacity onPress={handlePressForgotPassword}>
           <Text style={styles.forgotPassword} variant="bold">
            Forgot Password?
          </Text>
         </TouchableOpacity>
        </View>
        <View style={styles.spacer} />

        <Text style={styles.loginPhno} variant="bold" onPress={handlePressLogin}>
          Login using phone number
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Proceed" onPress={handlePressButton} loading={isPending} />
      </View>
    </>
  );
};

export default Register;
