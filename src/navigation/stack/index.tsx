import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
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
import { storage } from '../../utils/store';
import { StorageKeys } from '../../constants/storage/storageKeys';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../slice/authSlice';
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
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    tabBarContainer: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
  });

  // CRITICAL: Read token synchronously from storage for initial route.
  // initialRouteName only applies when Stack.Navigator first mounts - it does NOT
  // react to later prop changes. Redux acc_token is empty on first render (before
  // useEffect runs), so we must read from storage directly. MMKV getString is sync.
  const tokenFromStorage = storage.getString(StorageKeys.ACCESS_TOKEN);
  const initialRouteName = tokenFromStorage
    ? ScreenNames.DASHBOARD_SCREEN
    : ScreenNames.LOGIN_SCREEN;

  useEffect(() => {
    // Keep Redux in sync with storage for the rest of the app
    const token = storage.getString(StorageKeys.ACCESS_TOKEN);
    dispatch(setAccessToken(token ?? ''));
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName}
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
  );
};

export default AppNavigation;
