import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../../theme/ThemeProvider'
import { useStyles } from './HomeScreenHeader.styles'
import { ImageSource } from '../../../../constants/images'
import { SwText as Text } from '../../../common/SwText/SwText'
import { useNavigation } from '@react-navigation/native'

const HomeScreenHeader = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();
    const drawer = navigation.getParent();

    const openDrawer = () => {
        if (drawer && 'openDrawer' in drawer) {
            (drawer as { openDrawer: () => void }).openDrawer();
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View style={styles.innerContainer}>
                <TouchableOpacity onPress={openDrawer}>
                    <Image source={ImageSource.menu} style={styles.menuIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={ImageSource.bell} style={styles.bellIcon} />
                </TouchableOpacity>
            </View>
            <View style={[styles.innerContainer, {marginTop: 18, marginBottom: 14}]}>
                <Text varient='medium' style={styles.greeting}>Good morning Ritwik,</Text>
               <View style={{flexDirection: "row", alignItems: "center" }}>
                <Image source={ImageSource.weather} style={styles.weatherIcon}/>
                <Text varient='semi-bold' style={styles.tempText}>32c</Text>
                <Text varient='medium' style={styles.locationText}>Hyderabad</Text>
               </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreenHeader;