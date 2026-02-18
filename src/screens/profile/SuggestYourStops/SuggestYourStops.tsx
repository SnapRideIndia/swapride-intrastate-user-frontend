import { Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStyles } from './SuggestYourStops.styles'
import { useTheme } from '../../../theme/ThemeProvider'
import ProfileHeader from '../../../components/domain/profile/Header/ProfileHeader/ProfileHeader'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { ImageSource } from '../../../constants/images'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const SuggestYourStops = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();
    useEffect(() => {
        const renderHeader = () => <PrimaryHeader title={'Suggest your stops'} />;
        navigation.setOptions({
            headerShown: true,
            header: renderHeader,
        });
    }, [navigation]);
    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}> */}
             <KeyboardAwareScrollView
                    contentContainerStyle={styles.keyboardAwareScrollContainer}
                    enableOnAndroid
                    extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                {/* input container */}
                <View style={{ paddingVertical: 16, paddingHorizontal: 24, borderWidth: 1, borderRadius: 16 }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View style={{ alignItems: "center", marginTop: 4 }}>
                            <View style={{ width: 5, height: 5, borderRadius: 50, backgroundColor: "#FFCA5A" }} />
                            <View style={{ height: 85, borderLeftWidth: 1, borderStyle: 'dashed' }} />
                            <View style={{ width: 5, height: 5, borderRadius: 50, backgroundColor: "#000" }} />

                        </View>
                        <View style={{ flex: 1, gap: 16 }}>
                            <SwTextInput title={'Preffered Pickup location'} placeholder='Enter pickup location'/>
                            <SwTextInput title={'Preffered Drop location'} placeholder='Enter drop location' />
                        </View>
                    </View>
                    <View style={{marginTop: 17}}>
                        <Text style={{}}>Select All</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 36, marginTop: 10 }}>
                            <TouchableOpacity style={styles.option}>
                                <Image source={ImageSource.checkCircle} style={styles.checkCircle} />
                                <Text>Morning</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option}>
                                <Image source={ImageSource.uncheckCircle} style={styles.checkCircle} />
                                <Text>Evening</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <SwTextInput title={'Destination reaching time'} renderTitleIcon={() => <Image source={ImageSource.clock} style={styles.clockIcon} />} />
                        </View>
                    </View>

                    <View style={{ marginTop: 29, flexDirection: "row", width: 284, gap: 10 }}>
                        <Image source={ImageSource.checkSquare} style={styles.checkSquare} />
                        <Text>Update this info to Travel Preferences on My Profile</Text>
                    </View>

                    <View style={{ marginTop: 60 }}>
                        <TextInput
                            placeholder="Please provide a detailed description for your suggestion"
                            multiline={true}
                            numberOfLines={6}
                            style={{
                                borderWidth: 1,
                                height: 162,
                                borderRadius: 15,
                                paddingHorizontal: 24,
                                paddingVertical: 20,
                                textAlignVertical: 'top', // important for Android
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 60 }}>
                        <PrimaryButton title='Submit' />
                    </View>

                </View>
                {/* Selector */}

                </KeyboardAwareScrollView>

            {/* </ScrollView> */}
        </SafeAreaView>
    )
}

export default SuggestYourStops

const styles = StyleSheet.create({})