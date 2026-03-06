import { Image, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
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
import { useStyles } from './EnterPassword.styles';

const EnterPassword = () => {
  const [userCred, setUserCred] = useState({
    email: '',
    password: '',
  });
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { verificationId } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleChange = (key: string, value: string) => {
    setUserCred(prev => ({ ...prev, [key]: value }));
  };

  const handlePressButton = () => {};

  const handlePressPhno = () => {
    console.log('Pressing phno ===>');
    dispatch(setAuthStep(AuthStep.Step0));
  };

  const handleRenderRightIcon = () => {
    return <Image source={ImageSource.eyeOff} style={styles.eyeOff} />;
  };
  return (
    <>
      <View style={styles.container}>
        <TextInput title={'Email Address'} isPhno={false} onChangeText={text => handleChange('email', text)} />
        <View>
          <TextInput
            title={'Password'}
            isPhno={false}
            renderRightIcon={handleRenderRightIcon}
            onChangeText={text => handleChange('password', text)}
          />
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.loginPhno} varient="bold" onPress={handlePressPhno}>
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
