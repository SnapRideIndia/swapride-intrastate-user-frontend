import { Platform, ScrollView, StyleSheet, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './SetYourProfileScreen.styles'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SwTextInput as TextInput } from '../../../components/common/SwTextInput/SwTextInput'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { ImageSource } from '../../../constants/images'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'

const SetYourProfileScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();
    useEffect(() => {
        const renderHeader = () => <PrimaryHeader title={'Set your profile'} />;
        navigation.setOptions({
            headerShown: true,
            header: renderHeader,
        });
    }, [navigation]);

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>


            <KeyboardAwareScrollView
                contentContainerStyle={styles.keyboardAwareScrollContainer}
                enableOnAndroid
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imageOuterContainer}>
                    <View style={styles.imageContainer} />
                    <View style={styles.cameraIconContainer} />
                </View>
                <Text style={styles.imageDes}>Upload Your profile picture</Text>

                {/* Devider */}
                <View style={[styles.devider, { marginTop: 18 }]} />
                <View style={styles.inputContainer}>
                    <TextInput title={'Full Name'} renderTitleIcon={() => <Image source={ImageSource.userOutline} style={styles.titleIcon} />} />
                    <TextInput title={'Mobile Number'} renderTitleIcon={() => <Image source={ImageSource.callOutline} style={styles.titleIcon} />} />
                    <TextInput title={'Email Address'} renderTitleIcon={() => <Image source={ImageSource.emailOutline} style={styles.titleIcon} />} />
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>

                        <TextInput title={'Mobile Number'} renderTitleIcon={() => <Image source={ImageSource.genderOutline} style={styles.titleIcon} />} />
                        <TextInput title={'Email Address'} renderTitleIcon={() => <Image source={ImageSource.calenderOutline} style={styles.titleIcon} />} />

                    </View>
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>

                        <TextInput title={'Mobile Number'} renderTitleIcon={() => <Image source={ImageSource.bloodOutline} style={styles.titleIcon} />} />
                        <View style={{ flex: 1 }} />

                    </View>
                </View>

            </KeyboardAwareScrollView>
            <View style={styles.spacer} />
            <View style={styles.buttonContainer}>
                <PrimaryButton title='Send OTP' />
            </View>
        </SafeAreaView>
    )
}

export default SetYourProfileScreen;