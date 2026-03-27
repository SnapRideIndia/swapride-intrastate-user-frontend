import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './EnterPhNo.styles';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { Image, Platform, View } from 'react-native';
import { ImageSource } from '../../../constants/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EnterOtp from '../../../components/domain/login/EnterOtp/EnterOtp';
import EnterPhno from '../../../components/domain/login/EnterPhno/EnterPhno';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Register from '../../../components/domain/login/Register/Register';
import EnterPassword from '../../../components/domain/login/EnterPassword/EnterPassword';
import ResetPassword from '../../../components/domain/login/ResetPassword/ResetPassword';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { setAuthStep } from '../../../slice/authSlice';

const EnterPhNo = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const dispatch = useDispatch();
  const { step } = useSelector((store: RootState) => store.auth);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step > 0) {
          dispatch(setAuthStep(0));
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [step, dispatch]),
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
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
            <Text style={styles.bannerTitle} variant="bold">
              Welcome to Swapride!
            </Text>
            <Text style={styles.bannerSubTitle} variant="regular">
              Daily office travel, made simple — book your ride in just a few taps.
            </Text>
          </View>
        </View>

        {step === 0 && <EnterPhno />}
        {step === 1 && <EnterOtp />}
        {step === 2 && <Register />}
        {step === 3 && <EnterPassword />}
        {step === 4 && <ResetPassword />}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EnterPhNo;
