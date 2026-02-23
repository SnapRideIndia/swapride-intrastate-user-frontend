import {
    Platform,
    View,
    Image,
    TouchableOpacity,
    ImageSourcePropType,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SwTextInput as TextInput } from '../../../components/common/SwTextInput/SwTextInput';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ImagePickerBottomSheet } from '../../../components/common/ImagePickerBottomSheet';
import { useUpdateProfile } from '../../../hooks/useProfile';
import type { ProfileObj } from '../../../services/ProfileService';
import { useStyles } from './SetYourProfileScreen.styles';

const INITIAL_PROFILE: ProfileObj = {
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
};

const SetYourProfileScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    const [profileObj, setProfileObj] = useState<ProfileObj>(INITIAL_PROFILE);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const { mutate: updateProfileApi, isPending } = useUpdateProfile();

    useEffect(() => {
        const renderHeader = () => <PrimaryHeader title={'Set your profile'} />;
        navigation.setOptions({
            headerShown: true,
            header: renderHeader,
        });
    }, [navigation]);

    const updateProfile = (field: keyof ProfileObj, value: string) => {
        setProfileObj((prev) => ({ ...prev, [field]: value }));
    };

    const handleOpenImagePicker = () => {
        setShowImagePickerSheet(true);
    };

    const handleSelectCamera = () => {
        launchCamera(
            {
                mediaType: 'photo',
                saveToPhotos: false,
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7,
            },
            (response) => {
                if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
                    setProfileImage(response.assets[0].uri);
                }
            }
        );
    };

    const handleSelectGallery = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7,
            },
            (response) => {
                if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
                    setProfileImage(response.assets[0].uri);
                }
            }
        );
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDate = (dateStr: string): Date => {
        if (!dateStr) return new Date();
        const [day, month, year] = dateStr.split('/').map(Number);
        if (day && month && year) {
            return new Date(year, month - 1, day);
        }
        return new Date();
    };

    const handleDateConfirm = (date: Date) => {
        updateProfile('dateOfBirth', formatDate(date));
        setShowDatePicker(false);
    };

    const getDobDisplayValue = () => {
        return profileObj.dateOfBirth || 'Select date';
    };

    const handleSave = () => {
        updateProfileApi(
            { profileObj, profileImageUri: profileImage },
            {
                onSuccess: () => {
                    navigation.goBack();
                },
            }
        );
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.keyboardAwareScrollContainer}
                enableOnAndroid
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.imageOuterContainer}
                    onPress={handleOpenImagePicker}
                    activeOpacity={0.8}
                >
                    <View style={styles.imageWrapper}>
                        <View style={styles.imageContainer}>
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={styles.profileImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Image
                                    source={ImageSource.userOutline as ImageSourcePropType}
                                    style={styles.placeholderIcon}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                        <View style={[styles.cameraIconContainer]}>
                            <FontAwesome6 name="camera" size={16} color={colors.primary} />
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.imageDes}>Upload Your profile picture</Text>

                <View style={[styles.devider, { marginTop: 18 }]} />
                <View style={styles.inputContainer}>
                    {
                        true && <View style={{ gap: 10 }}>
                            <Text varient='semi-bold' style={styles.sectionTitle}>Basic Details</Text>
                            <Text varient='medium' style={[styles.sectionSubtitle, { width: 293 }]}>This will help us find the best stops and timings for your commute</Text>
                        </View>
                    }
                    <TextInput
                        title="Full Name"
                        renderTitleIcon={() => <Image source={ImageSource.userOutline as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.fullName}
                        onChangeText={(v) => updateProfile('fullName', v)}
                        placeholder="Enter your full name"
                    />
                    <TextInput
                        title="Mobile Number"
                        renderTitleIcon={() => <Image source={ImageSource.callOutline as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.mobileNumber}
                        onChangeText={(v) => updateProfile('mobileNumber', v)}
                        placeholder="Enter mobile number"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        title="Email Address"
                        renderTitleIcon={() => <Image source={ImageSource.emailOutline as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.emailAddress}
                        onChangeText={(v) => updateProfile('emailAddress', v)}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                    />
                    <View style={styles.rowInputs}>
                        <View style={styles.flexInput}>
                            <TextInput
                                title="Gender"
                                renderTitleIcon={() => <Image source={ImageSource.genderOutline as ImageSourcePropType} style={styles.titleIcon} />}
                                value={profileObj.gender}
                                onChangeText={(v) => updateProfile('gender', v)}
                                placeholder="Gender"
                            />
                        </View>
                        <View style={styles.flexInput}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <TextInput
                                    title="Date of Birth"
                                    renderTitleIcon={() => <Image source={ImageSource.calenderOutline as ImageSourcePropType} style={styles.titleIcon} />}
                                    value={getDobDisplayValue()}
                                    editable={false}
                                    placeholder="Select date"
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowInputs}>
                        <View style={styles.flexInput}>
                            <TextInput
                                title="Blood Group"
                                renderTitleIcon={() => <Image source={ImageSource.bloodOutline as ImageSourcePropType} style={styles.titleIcon} />}
                                value={profileObj.bloodGroup}
                                onChangeText={(v) => updateProfile('bloodGroup', v)}
                                placeholder="e.g. A+"
                            />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                </View>
                <View style={[styles.devider, { marginTop: 18 }]} />

                <View style={styles.inputContainer}>
                    <View style={{ gap: 10 }}>
                        <Text varient='semi-bold' style={styles.sectionTitle}>Travel Preferences</Text>
                        <Text varient='medium' style={styles.sectionSubtitle}>This will help us find the best stops and timings for your commute</Text>
                    </View>

                    <TextInput
                        title="Home Address"
                        renderTitleIcon={() => <Image source={ImageSource.Home as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.fullName}
                        onChangeText={(v) => updateProfile('fullName', v)}
                        placeholder="Enter your full name"
                    />

                      <TextInput
                        title="Office Address"
                        renderTitleIcon={() => <Image source={ImageSource.office as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.fullName}
                        onChangeText={(v) => updateProfile('fullName', v)}
                        placeholder="Enter your full name"
                    />

                    <TextInput
                        title="Office timings"
                        renderTitleIcon={() => <Image source={ImageSource.clock as ImageSourcePropType} style={styles.titleIcon} />}
                        value={profileObj.fullName}
                        onChangeText={(v) => updateProfile('fullName', v)}
                        placeholder="Enter your full name"
                    />
                </View>
            </KeyboardAwareScrollView>

            <View style={styles.spacer} />
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title={isPending ? 'Saving...' : 'Save'}
                    onPress={handleSave}
                    disabled={isPending}
                />
            </View>

            <ImagePickerBottomSheet
                visible={showImagePickerSheet}
                onClose={() => setShowImagePickerSheet(false)}
                onSelectCamera={handleSelectCamera}
                onSelectGallery={handleSelectGallery}
            />

            <DatePicker
                modal
                open={showDatePicker}
                date={parseDate(profileObj.dateOfBirth)}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(false)}
                maximumDate={new Date()}
            />
        </SafeAreaView>
    );
};

export default SetYourProfileScreen;
