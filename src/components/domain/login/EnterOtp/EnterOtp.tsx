import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './EnterOtp.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import OTPInput from '../../../common/OTP_Input/OTPInput';

const EnterOtp = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} varient='semi-bold'>Enter OTP</Text>
                <Image source={ImageSource.cross} style={styles.crossIcon} />
            </View>
            <View style={styles.otpContainer}>
                <OTPInput />

                <View style={styles.resendOtpContainer}>
                    <View style={[styles.resendOtpContainer, {gap: 8}]}>
                        <Image source={ImageSource.call} style={styles.callIcon}/>
                        <Text varient='semi-bold' style={styles.resend}>Get OTP on Call</Text>
                    </View>
                    <Text varient='semi-bold'>Resend OTP</Text>
                </View>
            </View>
        </View>
    )
}

export default EnterOtp

const styles = StyleSheet.create({})