import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './NotificationScreen.styles'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'
import { ImageSource } from '../../../constants/images'
import { SwText as Text } from '../../../components/common/SwText/SwText'

const NotificationScreen = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation();

    useEffect(() => {
        const renderHeader = () => <PrimaryHeader title={'Notification'}  />;
        navigation.setOptions({
            headerShown: true,
            header: renderHeader,
        });
    }, [navigation]);

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {
                    [1,2,3,4].map((item, _idx)=><NotificationCard />)
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({});


const NotificationCard = ()=>{
    const {colors} = useTheme();
    const styles = useStyles(colors);
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Image source={ImageSource.shuttel} style={styles.shuttelIcon}/>
                </View>
                <View style={{flex:1, gap: 8}}>
                 <View style={{flex:1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                       <Text varient='semi-bold' style={styles.title}>Pickup in 5 minutes</Text>
                       <Text varient='semi-bold' style={styles.min}>10 Min ago</Text>
                 </View>
                    <Text varient='medium' style={styles.subTitle}>Please wait at the Main Gate pickup point.</Text>
                </View>
            </View>
            <ScrollView style={{marginTop: 29}} contentContainerStyle={{flexGrow:1, flexDirection: "row", gap: 10, borderRadius: 15}} showsHorizontalScrollIndicator={false} horizontal>
                {
                    [1,2,3,4]. map((item, index)=><View style={{width:214, height:123, backgroundColor: "gray", borderRadius: 15}} />)
                }
            </ScrollView>
        </View>
    )
}