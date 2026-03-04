import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './SetCommuteScreen.styles'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { SwPickupDropInputCard } from '../../../components/common/SwPickupDropInputCard/SwPickupDropInputCard'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImageSource } from '../../../constants/images'
import { TextInput } from 'react-native-gesture-handler'
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton'
import { SwLocationSearchBottomSheet, SwLocationSearchItem } from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet'

const SetCommuteScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');
    const locationSheetRef = useRef<BottomSheetModal>(null);
    const [locationQuery, setLocationQuery] = useState('');

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

    const handleSelectLocation = useCallback(
        (item: SwLocationSearchItem) => {
            if (activeLocationField === 'pickup') setPickupLocation(item.title);
            else setDropLocation(item.title);
            locationSheetRef.current?.dismiss();
        },
        [activeLocationField],
    );

    const openLocationSheet = useCallback((field: 'pickup' | 'drop') => {
        setActiveLocationField(field);
        setLocationQuery('');
        locationSheetRef.current?.present();
    }, []);

    useEffect(() => {
        const renderHeader = () => <PrimaryHeader title='' />;
        navigation.setOptions({
            headerShown: true,
            header: renderHeader,
        });
    }, [navigation]);


    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>

                <Text varient='semi-bold' style={styles.title}>Tell us about your commute !</Text>

                <View style={styles.card}>
                    <SwPickupDropInputCard pickupInputProps={{
                        title: 'Preffered Pickup location',
                        placeholder: 'Enter pickup location',
                        value: pickupLocation,
                        onChangeText: setPickupLocation,
                        renderTitleIcon: () => <Image source={ImageSource.Home} style={styles.titleIcon} />
                    }}
                        dropInputProps={{
                            title: 'Preffered Drop location',
                            placeholder: 'Enter drop location',
                            value: dropLocation,
                            onChangeText: setDropLocation,
                            renderTitleIcon: () => <Image source={ImageSource.office} style={styles.titleIcon} />
                        }} onPressPickup={() => openLocationSheet('pickup')}
                        onPressDrop={() => openLocationSheet('drop')} />

                    <View style={styles.timeInputContainer}>
                        <View style={styles.inputTitle}>
                            <Image source={ImageSource.clock} style={styles.clock} />
                            <Text>Office Timing</Text>
                        </View>
                        <View style={styles.timeInputsWrapper}>
                            <TouchableOpacity style={styles.timeInput}>
                                <Text>00:00 AM</Text>
                            </TouchableOpacity>
                            <Text>to</Text>
                            <TouchableOpacity style={styles.timeInput}>
                                <Text>00:00 PM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.btnContainer}>
                        <PrimaryButton title='Submit' btnStyle={styles.btnStyle} textStyle={styles.textStyle} />
                    </View>
                </View>

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

            </ScrollView>

        </SafeAreaView>
    )
}

export default SetCommuteScreen;