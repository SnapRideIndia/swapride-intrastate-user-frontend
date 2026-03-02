import { Image, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStyles } from './SuggestYourStops.styles'
import { useTheme } from '../../../theme/ThemeProvider'
import { useNavigation } from '@react-navigation/native'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { ImageSource } from '../../../constants/images'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SwPickupDropInputCard } from '../../../components/common/SwPickupDropInputCard/SwPickupDropInputCard'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
    SwLocationSearchBottomSheet,
    type SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet'

const SuggestYourStops = () => {
    const [selectedSlot, setSelectedSlot] = useState({
        morning: true,
        evening: false
    })

    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [destReachingTime, setDestReachingTime] = useState('');
    const [isCheck, setIsCheck] = useState(false);
    const [desc, setDesc] = useState('');
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    const locationSheetRef = useRef<BottomSheetModal>(null);
    const [locationQuery, setLocationQuery] = useState('');
    const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');

    const savedAddresses = useMemo<SwLocationSearchItem[]>(
        () => [
            {
                id: 'home',
                title: 'Home',
                subtitle: '12-9 kilometers off from\nHarminder - 61507',
                iconSource: ImageSource.Home,
            },
            {
                id: 'work',
                title: 'Work',
                subtitle: '12-9 kilometers off from\nHarminder - 61507',
                iconSource: ImageSource.office,
            },
        ],
        [],
    );

    const recentSearches = useMemo<SwLocationSearchItem[]>(
        () => [
            {
                id: 'recent-1',
                title: 'Lohoet 3532',
                subtitle: '12-9 kilometers off from\nHarminder - 61507',
                iconSource: ImageSource.clock,
            },
        ],
        [],
    );

    const openLocationSheet = useCallback((field: 'pickup' | 'drop') => {
        setActiveLocationField(field);
        setLocationQuery('');
        locationSheetRef.current?.present();
    }, []);

    const handleSelectLocation = useCallback(
        (item: SwLocationSearchItem) => {
            if (activeLocationField === 'pickup') setPickupLocation(item.title);
            else setDropLocation(item.title);
            locationSheetRef.current?.dismiss();
        },
        [activeLocationField],
    );

    const handlePressSlot = (slot: 'morning' | 'evening') => {
        if (slot === 'morning') setSelectedSlot((prev) => ({ ...prev, morning: true, evening: false }));
        else setSelectedSlot((prev) => ({ ...prev, morning: false, evening: true }));
    }

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
                            <View style={{ height: 80, borderLeftWidth: 1, borderStyle: 'dashed' }} />
                            <View style={{ width: 5, height: 5, borderRadius: 50, backgroundColor: "#000" }} />

                        </View>
                        <View style={{ flex: 1, gap: 16 }}>
                            <SwPickupDropInputCard
                                showSwapArrow
                                pickupInputProps={{
                                    title: 'Preffered Pickup location',
                                    placeholder: 'Enter pickup location',
                                    value: pickupLocation,
                                    onChangeText: setPickupLocation,
                                }}
                                dropInputProps={{
                                    title: 'Preffered Drop location',
                                    placeholder: 'Enter drop location',
                                    value: dropLocation,
                                    onChangeText: setDropLocation,
                                }}
                                onPressPickup={() => openLocationSheet('pickup')}
                                onPressDrop={() => openLocationSheet('drop')}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 17 }}>
                        <Text style={{}}>Select All</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 36, marginTop: 10 }}>
                            <TouchableOpacity style={styles.option} onPress={() => handlePressSlot('morning')} activeOpacity={0.8}>
                                <Image source={selectedSlot.morning ? ImageSource.checkCircle : ImageSource.uncheckCircle} style={styles.checkCircle} />
                                <Text>Morning</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={() => handlePressSlot('evening')} activeOpacity={0.8}>
                                <Image source={selectedSlot.evening ? ImageSource.checkCircle : ImageSource.uncheckCircle} style={styles.checkCircle} />
                                <Text>Evening</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <SwTextInput title={'Destination reaching time'} renderTitleIcon={() => <Image source={ImageSource.clock} style={styles.clockIcon} />} onChangeText={(text) => setDestReachingTime(text)} keyboardType='number-pad' />
                        </View>
                    </View>

                    <View style={{ marginTop: 29, flexDirection: "row", width: 284, gap: 10 }}>
                        <TouchableOpacity onPress={()=>setIsCheck((prev)=>!prev)}>
                            <Image source={isCheck ? ImageSource.checkSquare : ImageSource.uncheckbox} style={styles.checkSquare} />
                        </TouchableOpacity>
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
                                backgroundColor: "#D9D9D999",
                                borderColor: "#00000099"
                            }}
                            onChangeText={(text) => setDesc(text)}
                        />
                    </View>

                    <View style={{ marginTop: 60 }}>
                        <PrimaryButton title='Submit' />
                    </View>

                </View>
                {/* Selector */}

            </KeyboardAwareScrollView>

            <SwLocationSearchBottomSheet
                ref={locationSheetRef}
                title={activeLocationField === 'pickup' ? 'Search Pickup Address' : 'Search Drop Address'}
                query={locationQuery}
                onChangeQuery={setLocationQuery}
                showUseCurrentLocation
                onPressUseCurrentLocation={() => {
                    // Hook into GPS later if needed
                }}
                savedAddresses={savedAddresses}
                recentSearches={recentSearches}
                onPressItem={handleSelectLocation}
                onClose={() => setLocationQuery('')}
            />
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}

export default SuggestYourStops

const styles = StyleSheet.create({})