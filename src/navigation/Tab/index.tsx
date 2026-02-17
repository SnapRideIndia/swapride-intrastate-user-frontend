import { Image } from 'react-native'
import React from 'react'
import { useTheme } from '../../theme/ThemeProvider'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenNames } from '../constant';
import { useStyles } from './index.styles';
import HomeScreen from '../../screens/home/HomeScreen/HomeScreen';
import { ImageSource } from '../../constants/images';
import WalletScreen from '../../screens/wallet/WalletScreen/WalletScreen';
import HistoryScreen from '../../screens/history/HistoryScreen/HistoryScreen';
import { SwText as Text } from '../../components/common/SwText/SwText';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    return (
        <Tab.Navigator initialRouteName={ScreenNames.HOME_SCREEN}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primaryCtaText,
                tabBarInactiveTintColor: colors.primary,
                tabBarStyle: styles.tabBarStyles,
                tabBarHideOnKeyboard: true,
                tabBarIconStyle: styles.tabBarIconStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
            }}
        >
            <Tab.Screen
                name={ScreenNames.HOME_SCREEN}
                component={HomeScreen}
                options={{
                    tabBarLabel: ({ focused }) => (
                       <Text varient='medium' style={[styles.label, focused && styles.activeLabel]}>Home</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image source={ImageSource.homeIcon} style={[focused ? styles.active : styles.inActive, styles.homeIcon]} />
                    ),
                }}
            />

            <Tab.Screen
                name={ScreenNames.WALLET_SCREEN}
                component={WalletScreen}
                options={{
                     tabBarLabel: ({ focused }) => (
                       <Text varient='medium' style={[styles.label, focused && styles.activeLabel]}>Wallet</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image source={ImageSource.WalletIcon} style={[focused ? styles.active : styles.inActive, styles.homeIcon]} />
                    ),
                }}
            />

            <Tab.Screen
                name={ScreenNames.HISTORY_SCREEN}
                component={HistoryScreen}
                options={{
                      tabBarLabel: ({ focused }) => (
                       <Text varient='medium' style={[styles.label, focused && styles.activeLabel]}>History</Text>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <Image source={ImageSource.HistoryIcon} style={[focused ? styles.active : styles.inActive, styles.clockIcon]} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator;
