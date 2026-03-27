import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useStyles } from './OTPInput.styles';
import { useTheme } from '../../../theme/ThemeProvider';

export interface OTPInputRef {
  clearAll: () => void;
  getValue: () => string;
}

interface OTPInputProps {
  length?: number;
  onFilled?: (otp: string) => void;
  placeHolder?: string;
}

const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(({ length = 6, onFilled, placeHolder }, ref) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const otpRef = useRef<OtpInputRef>(null);
  const [otp, setOtp] = useState('');

  useImperativeHandle(ref, () => ({
    clearAll: () => {
      otpRef.current?.clear();
      setOtp('');
    },
    getValue: () => otp,
  }));

  return (
    <View style={styles.container}>
      <OtpInput
        ref={otpRef}
        numberOfDigits={length}
        focusColor={colors.primary}
        autoFocus={true}
        hideStick={false}
        // placeholder={placeHolder}
        blurOnFilled={false}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onTextChange={text => {
          setOtp(text);
        }}
        onFilled={text => {
          setOtp(text);
          onFilled?.(text);
        }}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
          keyboardType: 'number-pad',
          ...(Platform.OS === 'ios' && {
            textContentType: 'oneTimeCode', // iOS autofill - reads from SMS automatically
            autoComplete: 'sms-otp', // Additional iOS 12+ support
            // iOS will automatically detect OTP from SMS when format matches:
            // "123456 is your verification code." or "YourAppName: 123456"
          }),
          ...(Platform.OS === 'android' && {
            autoComplete: 'sms-otp', // Android autofill (Android 11+)
            importantForAutofill: 'yes',
          }),
        }}
        textProps={{
          accessibilityRole: 'text',
          accessibilityLabel: 'OTP digit',
          allowFontScaling: false,
        }}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          placeholderTextStyle: styles.placeholderText,
          filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
        }}
      />
    </View>
  );
});

export default OTPInput;
