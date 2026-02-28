import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../../../theme/ThemeProvider'
import { useStyles } from './BusSelectionCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../../navigation/constant';

interface BusSelectionCard {
    showLabel: boolean
}

const BusSelectionCard = ({ showLabel = false }) => {
    const [showSourceStopImages, setShowSourceStopImages] = useState(false);
    const [showDestinationImages, setShowDestinationImages] = useState(false);

    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    const handlePressBtn = () => {

    }

    const handleViewFullRoute = () => {
        navigation.navigate(ScreenNames.FULL_ROUTE_SCREEN as never);
    };

    return (
        <View style={styles.container}>
            {/* top pick section */}
            {
                showLabel && <View style={styles.topPickHeader}>
                    <View style={styles.topPickHeaderTitleContainer}>
                        <Image source={ImageSource.starBadge} style={styles.starBadgeIcon} />
                        <Text varient='bold' style={styles.topPickStyle}>Top pick for you</Text>
                    </View>
                    <Text style={styles.topPickDesc}>Yay! Your pickup is just 3 min walk away</Text>
                </View>
            }
            {/* bottom main card Section */}
            <View style={[styles.mainCard, showLabel && { marginTop: -15 }]}>
                <View style={styles.fromToContainer}>
                    <View style={styles.badgeAndDeviderContainer}>
                        <View style={styles.badge}>
                            <Text varient='medium' style={styles.time}>4:05 pm</Text>
                        </View>
                        <View style={styles.devider} />
                        <View style={styles.badge}>
                            <Text varient='medium' style={styles.time}>4:05 pm</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, gap: 15 }}>
                        <View style={styles.place}>
                            <Text varient='bold' style={styles.placeTitle}>Peninsula Corporate PArk</Text>
                            <Text varient='medium' style={styles.placeSubtitle}>In front of Matula cnter , under the fly over</Text>
                            <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowSourceStopImages((prev) => !prev)}>
                                <Image source={ImageSource.walkIcon} style={styles.walkIcon} />
                                <Text varient='semi-bold' style={styles.placeSubtitle}>3 min walk (17 m )</Text>
                                <Image source={ImageSource.downArrow} style={styles.downArrow} />
                            </TouchableOpacity>

                            {
                                showSourceStopImages && <><ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                                    {
                                        [1, 2, 3, 4].map((item, _idx) => <View style={{ width: 150, height: 100, backgroundColor: "gray", borderRadius: 10 }} />)
                                    }
                                </ScrollView>
                                    <TouchableOpacity onPress={handleViewFullRoute} activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <View style={{ flex: 1, height: 1, backgroundColor: colors.border_4 }} />
                                            <Image source={ImageSource.locationConnection} style={styles.locationConnectionIcon} />
                                        </View>
                                        <Text>View full route</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>


                        <View style={styles.place}>
                            <Text varient='bold' style={styles.placeTitle}>Peninsula Corporate PArk</Text>
                            <Text varient='medium' style={styles.placeSubtitle}>In front of Matula cnter , under the fly over</Text>
                            <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowDestinationImages((prev) => !prev)}>
                                <Image source={ImageSource.walkIcon} style={styles.walkIcon} />
                                <Text varient='semi-bold' style={styles.placeSubtitle}>3 min walk (17 m )</Text>
                                <Image source={ImageSource.downArrow} style={styles.downArrow} />
                            </TouchableOpacity>

                            {
                                showDestinationImages && <><ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                                    {
                                        [1, 2, 3, 4].map((item, _idx) => <View style={{ width: 150, height: 100, backgroundColor: "gray", borderRadius: 10 }} />)
                                    }
                                </ScrollView>
                                    <TouchableOpacity onPress={handleViewFullRoute} activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <View style={{ flex: 1, height: 1, backgroundColor: colors.border_4 }} />
                                            <Image source={ImageSource.locationConnection} style={styles.locationConnectionIcon} />
                                        </View>
                                        <Text varient='semi-bold' style={styles.viewFullRoute}>View full route</Text>
                                    </TouchableOpacity>
                                </>
                            }



                        </View>

                    </View>
                </View>
                {/* Bus timing section */}
                <Text style={styles.bustimings}>Bus Timings</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.contentContainer}>
                    {
                        [1, 2, 3, 4].map((item, _idx) => <View style={styles.timeSlotContainer}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View style={{ width: 5, height: 5, backgroundColor: colors.button_primary, borderRadius: 50 }} />
                                <View style={{ height: 15, borderRightWidth: 1, borderStyle: 'dashed' }} />
                                <View style={{ width: 5, height: 5, backgroundColor: colors.primary, borderRadius: 50 }} />
                            </View>

                            <View style={{ gap: 5 }}>
                                <Text>4:05 pm</Text>
                                <Text>4:05 pm</Text>
                            </View>
                        </View>)
                    }
                </ScrollView>

                <View style={styles.ratingAndButtoncontainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Image source={ImageSource.busTime} style={{ width: 15, height: 15 }} />
                        <Text varient='bold' style={styles.viewAllTimings}>View all 4 timings</Text>
                    </View>
                    <View style={styles.buttonAndFareContainer}>
                        <PrimaryButton title='Continue' onPress={handlePressBtn} btnStyle={styles.btnstyle} />
                        <Text varient='medium' style={styles.fareText}>Fares starting from ₹49</Text>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default BusSelectionCard

const styles = StyleSheet.create({})