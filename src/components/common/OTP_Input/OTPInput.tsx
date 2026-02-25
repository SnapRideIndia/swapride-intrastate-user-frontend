import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { View, Platform, AppState, AppStateStatus } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import Clipboard from '@react-native-clipboard/clipboard';
import { useStyles } from './OTPInput.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import { useVerifyOTP } from '../../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export interface OTPInputRef {
    clearAll: () => void;
    getValue: () => string;
}

interface OTPInputProps {
    length?: number;
    onFilled?: (otp: string) => void;
    placeHolder?: string
}

const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
    ({ length = 6, onFilled, placeHolder }, ref) => {
        const { colors } = useTheme();
        const styles = useStyles(colors);
        const otpRef = useRef<OtpInputRef>(null);
        const [otp, setOtp] = useState('');
        const appState = useRef(AppState.currentState);

     

        // Extract OTP from SMS message - improved patterns (memoized)
        const extractOTPMemo = useCallback((message: string): string | null => {
            if (!message || typeof message !== 'string') {
                return null;
            }

            // Try to match common OTP patterns: exact length match preferred
            const patterns = [
                // Exact length patterns first (most reliable)
                new RegExp(`\\b(\\d{${length}})\\b`, 'g'), // Exact length: "123456"
                new RegExp(`code[:\\s]+(\\d{${length}})`, 'i'), // "code: 123456" or "code 123456"
                new RegExp(`otp[:\\s]+(\\d{${length}})`, 'i'), // "otp: 123456" or "otp 123456"
                new RegExp(`verification[:\\s]+code[:\\s]+(\\d{${length}})`, 'i'), // "verification code: 123456"
                new RegExp(`(\\d{${length}})[:\\s]+is[:\\s]+your`, 'i'), // "123456 is your"
                new RegExp(`your[:\\s]+code[:\\s]+is[:\\s]+(\\d{${length}})`, 'i'), // "your code is 123456"
                new RegExp(`(\\d{${length}})[:\\s]+is[:\\s]+your[:\\s]+verification`, 'i'), // "123456 is your verification"
                new RegExp(`verification[:\\s]+code[:\\s]+is[:\\s]+(\\d{${length}})`, 'i'), // "verification code is 123456"
                // Fallback: any 4-8 digit number (but prefer exact length)
                /\b(\d{4,8})\b/,
            ];

            for (const pattern of patterns) {
                const matches = message.match(pattern);
                if (matches && matches[1]) {
                    const extractedOTP = matches[1];
                    // Prioritize exact length match
                    if (extractedOTP.length === length) {
                        console.log('OTP extracted:', extractedOTP, 'from message:', message.substring(0, 50));
                        return extractedOTP;
                    }
                }
            }

            return null;
        }, [length]);

        // Fill OTP programmatically (memoized)
        const fillOTPMemo = useCallback((extractedOTP: string) => {
            if (!extractedOTP || extractedOTP.length !== length) {
                console.log('Invalid OTP length:', extractedOTP?.length, 'expected:', length);
                return;
            }

            console.log('🔄 Filling OTP:', extractedOTP);

            // Use setValue method directly - this is the correct API
            try {
                if (otpRef.current) {
                    // Clear first to ensure clean state
                    otpRef.current.clear();

                    // Wait a bit then set the value
                    setTimeout(() => {
                        if (otpRef.current && otpRef.current.setValue) {
                            console.log('✅ Calling setValue with:', extractedOTP);
                            otpRef.current.setValue(extractedOTP);
                            setOtp(extractedOTP);

                            // Trigger onFilled callback after a short delay
                            if (onFilled) {
                                setTimeout(() => {
                                    console.log('✅ Calling onFilled with:', extractedOTP);
                                    onFilled(extractedOTP);
                                }, 300);
                            }
                        } else {
                            console.log('❌ setValue method not available on otpRef');
                        }
                    }, 100);
                } else {
                    console.log('❌ otpRef.current is null');
                }
            } catch (error) {
                console.error('❌ Error filling OTP:', error);
            }
        }, [length, onFilled]);

        // Check clipboard for OTP (works for both iOS and Android)
        const checkClipboardForOTP = useCallback(async () => {
            try {
                const clipboardContent = await Clipboard.getString();
                console.log('📋 Clipboard check - content:', clipboardContent?.substring(0, 50) || 'empty');

                if (!clipboardContent || clipboardContent.trim().length === 0) {
                    return;
                }

                const extractedOTP = extractOTPMemo(clipboardContent);

                if (extractedOTP && extractedOTP.length === length) {
                    if (otp !== extractedOTP) {
                        console.log('✅ OTP found in clipboard:', extractedOTP, 'Current OTP:', otp);
                        fillOTPMemo(extractedOTP);
                    } else {
                        console.log('ℹ️ OTP already filled:', extractedOTP);
                    }
                } else {
                    console.log('⚠️ No valid OTP in clipboard. Content:', clipboardContent.substring(0, 30), 'Extracted:', extractedOTP, 'Expected length:', length);
                }
            } catch (error) {
                console.error('❌ Clipboard check failed:', error);
            }
        }, [length, otp, extractOTPMemo, fillOTPMemo]);

        // Handle SMS reading for Android
        useEffect(() => {
            if (Platform.OS !== 'android') {
                return;
            }

            // Try to use SMS Retriever API if available
            const setupSMSListener = async () => {
                try {
                    // Check if react-native-sms-retriever is available
                    const SmsRetriever = require('react-native-sms-retriever');

                    // Start SMS retriever
                    const registered = await SmsRetriever.startSmsRetriever();
                    if (registered) {
                        // Listen for SMS
                        SmsRetriever.addSmsListener((event: { message: string }) => {
                            const message = event.message;
                            const extractedOTP = extractOTPMemo(message);

                            if (extractedOTP && extractedOTP.length === length) {
                                console.log('📱 OTP extracted from SMS:', extractedOTP);
                                fillOTPMemo(extractedOTP);
                                SmsRetriever.removeSmsListener();
                            }
                        });
                    }
                } catch (error) {
                    // react-native-sms-retriever not installed, try alternative method
                    console.log('SMS Retriever not available, using clipboard method');
                }
            };

            setupSMSListener();

            // Handle app state changes
            const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
                if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                    // App came to foreground, check clipboard for OTP
                    setTimeout(() => {
                        checkClipboardForOTP();
                    }, 300);
                }
                appState.current = nextAppState;
            });

            // Check clipboard more frequently (every 500ms) when input is empty
            const intervalId = setInterval(() => {
                if (otp.length === 0) {
                    checkClipboardForOTP();
                }
            }, 500);

            return () => {
                subscription.remove();
                clearInterval(intervalId);
                try {
                    const SmsRetriever = require('react-native-sms-retriever');
                    SmsRetriever.removeSmsListener();
                } catch (e) {
                    // Ignore if not available
                }
            };
        }, [length, checkClipboardForOTP, otp]);

        // Handle clipboard checking for iOS (when app comes to foreground)
        useEffect(() => {
            if (Platform.OS !== 'ios') {
                return;
            }

            // Check clipboard when app comes to foreground
            const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
                if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                    // App came to foreground, check clipboard for OTP
                    setTimeout(() => {
                        checkClipboardForOTP();
                    }, 300);
                }
                appState.current = nextAppState;
            });

            // Check clipboard more frequently (every 500ms) when input is empty
            const intervalId = setInterval(() => {
                if (otp.length === 0) {
                    checkClipboardForOTP();
                }
            }, 500);

            // Also check clipboard initially after a short delay
            const initialCheck = setTimeout(() => {
                checkClipboardForOTP();
            }, 300);

            // Check immediately on mount
            checkClipboardForOTP();

            return () => {
                subscription.remove();
                clearInterval(intervalId);
                clearTimeout(initialCheck);
            };
        }, [length, checkClipboardForOTP, otp]);

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
                    onFocus={() => {
                        console.log('OTP Input focused - checking clipboard');
                        // Check clipboard when input is focused
                        setTimeout(() => {
                            checkClipboardForOTP();
                        }, 200);
                    }}
                    onBlur={() => console.log('OTP Input blurred')}
                    onTextChange={(text) => {
                        console.log('onTextChange called with:', text);
                        setOtp(text);
                    }}
                    onFilled={(text) => {
                        console.log('onFilled called with:', text);
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
    }
);

export default OTPInput;
