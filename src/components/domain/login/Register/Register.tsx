import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './Register.styles';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useLogin, useRegisterUser } from '../../../../hooks/useAuth';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { AuthStep, setAccessToken, setAuthStep, setRefreshToken } from '../../../../slice/authSlice';
import { storage } from '../../../../utils/store';
import { StorageKeys } from '../../../../constants/storage/storageKeys';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../navigation/constant';

const Register = () => {
  const [userCred, setUserCred] = useState({
    name: '',
    email: '',
    password: '',
    refCode: '',
  });
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { verificationId } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleChange = (key: string, value: string) => {
    setUserCred(prev => ({ ...prev, [key]: value }));
  };

  const onSuccessRegistartion = async (data: any) => {
    dispatch(setAccessToken(data.accessToken));
    dispatch(setRefreshToken(data.refreshToken));
    storage.set(StorageKeys.ACCESS_TOKEN, data.accessToken);
    storage.set(StorageKeys.REFRESH_TOKEN, data.refreshToken);
    navigation.navigate(ScreenNames.DASHBOARD_SCREEN as never);
  };

  const onErrorRegistration = (error: any) => {
    console.log('This is Error of registartion >>>', error);
  };

 const handlePressLogin = ()=>{
  dispatch(setAuthStep(AuthStep.Step0));
 }

 const handlePressForgotPassword = ()=>{
  dispatch(setAuthStep(AuthStep.step3))
 }

  const { mutate: register } = useRegisterUser(onSuccessRegistartion, onErrorRegistration);

  const handlePressButton = () => {
    console.log('this is usercred ===>', userCred);
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
    return <Image source={ImageSource.eyeOff} style={styles.eyeOff} />;
  };
  return (
    <>
      <View style={styles.container}>
        <TextInput title={'Full Name'} isPhno={false} onChangeText={text => handleChange('name', text)} />
        <TextInput
          title={'Email Address'}
          isPhno={false}
          renderRightIcon={handleRenderRightIcon}
          onChangeText={text => handleChange('email', text)}
        />
        <View>
          <TextInput title={'Set Password'} isPhno={false} onChangeText={text => handleChange('password', text)} />
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
        <PrimaryButton title="Proceed" onPress={handlePressButton} />
      </View>
    </>
  );
};

export default Register;
