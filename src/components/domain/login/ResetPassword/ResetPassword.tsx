import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwTextInput as TextInput } from '../../../common/SwTextInput/SwTextInput';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';
import { usePhoneLogin, useRegisterUser, useResetpassword } from '../../../../hooks/useAuth';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { AuthStep, setAccessToken, setAuthStep, setIsForgotPassword, setRefreshToken } from '../../../../slice/authSlice';
import { storage } from '../../../../utils/store';
import { StorageKeys } from '../../../../constants/storage/storageKeys';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../navigation/constant';
import { useStyles } from './ResetPassword.styles';
import { showToast } from '../../../../utils/showToast';
import { validateConfirmPassword, validatePassword } from '../../../../utils/validation';

const ResetPassword = () => {
    const [userCred, setUserCred] = useState({
        password: '',
        cnfPassword: '',
    });
  const [errors, setErrors] = useState<{ password?: string; cnfPassword?: string }>({});

    const {verificationId} = useSelector((store: RootState)=>store.auth)

    const { colors } = useTheme();
    const styles = useStyles(colors);
    const dispatch = useDispatch();

    const onSuccessResetPassword = (data: any)=>{
        console.log("this is reset password data ===>", data)
        showToast("success", data?.message, "", 1500);
        dispatch(setAuthStep(AuthStep.Step0));
        dispatch(setIsForgotPassword(false));
    }

    const onErrorResetPassword = (error: any)=>{
        console.log("This is reset password data error ===>", error?.toString());
        showToast("error", error?.message, "", 1500);
    }

    const {mutate: resetPassword} = useResetpassword(onSuccessResetPassword, onErrorResetPassword);

    const handleChange = (key: string, value: string) => {
        setUserCred(prev => ({ ...prev, [key]: value }));
      setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const handlePressButton = () => {
      const passwordError = validatePassword(userCred.password);
      const confirmError = validateConfirmPassword(userCred.password, userCred.cnfPassword);

      const newErrors: { password?: string; cnfPassword?: string } = {};
      if (passwordError) newErrors.password = passwordError;
      if (confirmError) newErrors.cnfPassword = confirmError;

      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
      }

        try {
            const payload = {
                verificationId: verificationId,
                newPassword: userCred.cnfPassword
            }

            resetPassword(payload)
            
        } catch (error) {
            console.log("This is error ===> error");
        }
    }

    const handleRenderRightIcon = () => {
        return <Image source={ImageSource.eyeOff} style={styles.eyeOff} />;
    };

    return (
        <>
            <View style={styles.container}>
                <TextInput
                  title={'Enter password'}
                  value={userCred.password}
                  isPhno={false}
                  onChangeText={text => handleChange('password', text)}
                  errorText={errors.password}
                />
                <TextInput
                    title={'Enter confirm password'}
                    value={userCred.cnfPassword}
                    isPhno={false}
                    renderRightIcon={handleRenderRightIcon}
                    onChangeText={text => handleChange('cnfPassword', text)}
                    errorText={errors.cnfPassword}
                />

                <View style={styles.spacer} />

                {/* <Text style={styles.loginPhno} variant="bold" onPress={handlePressLogin}>
                    Login using phone number
                </Text> */}
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton title="Proceed" onPress={handlePressButton} />
            </View>
        </>
    );
};

export default ResetPassword;
