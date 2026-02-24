import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './EnterOtp.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import OTPInput from '../../../common/OTP_Input/OTPInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setAuthStep } from '../../../../slice/authSlice';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useVerifyOTP } from '../../../../hooks/useAuth';

const EnterOtp = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const { step } = useSelector((store: RootState) => store.auth);
    const dispatch = useDispatch();

    const onSuccessVerifyOTP = (data: any)=>{
        console.log("This is data")
    }

    const onErrorVerifyOTP = (error: any)=>{

    }

    const {mutate: verifyOTP} = useVerifyOTP(onSuccessVerifyOTP, onErrorVerifyOTP);

    const handlePressCross = () => {
        dispatch(setAuthStep(step > 0 ? step - 1 : step));
    }

    const handlePressVerifyOtp = ()=>{

    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title} varient='semi-bold'>Enter OTP</Text>
                    <TouchableOpacity onPress={handlePressCross}>
                        <Image source={ImageSource.cross} style={styles.crossIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.otpContainer}>
                    <OTPInput />

                    <View style={styles.resendOtpContainer}>
                        <View style={[styles.resendOtpContainer, { gap: 8 }]}>
                            <Image source={ImageSource.call} style={styles.callIcon} />
                            <Text varient='semi-bold' style={styles.resend}>Get OTP on Call</Text>
                        </View>
                        <Text varient='semi-bold'>Resend OTP</Text>
                    </View>
                </View>
            </View>

            <View style={styles.spacer} />


            <View style={styles.buttonContainer}>
                <PrimaryButton title='Verify OTP' onPress={handlePressVerifyOtp} />
            </View>
        </>
    )
}

export default EnterOtp

const styles = StyleSheet.create({})