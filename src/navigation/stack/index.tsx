import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useErrorReporting } from '../../hooks/useErrorReporting';
import ErrorBoundary from '../../components/common/ErrorBoundary/ErrorBoundary';
import { ScreenNames } from '../constant';
import { useTheme } from '../../theme/ThemeProvider';
import DrawerNavigator from '../Drawer';
import EnterPhNo from '../../screens/auth/EnterPhNo/EnterPhNo';
import ViewProfile from '../../screens/profile/ViewProfile/ViewProfile';
import SuggestYourStops from '../../screens/profile/SuggestYourStops/SuggestYourStops';

import { useDispatch } from 'react-redux';
import TrackRideScreen from '../../screens/rides/TrackRideScreen/TrackRideScreen';
import TicketDetailScreen from '../../screens/rides/TicketDetailScreen/TicketDetailScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const { reportError } = useErrorReporting({
    logToConsole: true,
    showAlert: false,
  });

  return <ErrorBoundary onError={reportError}>{children}</ErrorBoundary>;
};

const AppNavigation = () => {
  const { colors } = useTheme();

    const styles = StyleSheet.create({
        tabBarContainer: {
            flex: 1,
            backgroundColor: colors.background_primary
        },
    })

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={ScreenNames.LOGIN_SCREEN}
            >
                <Stack.Screen name={ScreenNames.DASHBOARD_SCREEN}>
                    {() => (
                        <View style={styles.tabBarContainer}>
                            <DrawerNavigator />
                        </View>
                    )}
                </Stack.Screen>
                <Stack.Screen name={ScreenNames.LOGIN_SCREEN} component={EnterPhNo} />
                <Stack.Screen name={ScreenNames.VIEW_PROFILE} component={ViewProfile} />
                <Stack.Screen name={ScreenNames.SUGGEST_YOUR_STOPS} component={SuggestYourStops} />
                 <Stack.Screen
          name={ScreenNames.SUGGEST_YOUR_STOPS}
          component={SuggestYourStops}
        />
        <Stack.Screen
          name={ScreenNames.TRACK_RIDE_SCREEN}
          component={TrackRideScreen}
        />
        <Stack.Screen
          name={ScreenNames.TICKET_DETAIL_SCREEN}
          component={TicketDetailScreen}
        />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;
