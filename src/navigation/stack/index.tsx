import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import { ScreenNames } from '../constant';
import { useTheme } from '../../theme/ThemeProvider';
import DrawerNavigator from '../Drawer';
import EnterPhNo from '../../screens/auth/EnterPhNo/EnterPhNo';
import ViewProfile from '../../screens/profile/ViewProfile/ViewProfile';
import SuggestYourStops from '../../screens/profile/SuggestYourStops/SuggestYourStops';
import MySuggestionsScreen from '../../screens/profile/MySuggestions/MySuggestionsScreen';
import { storage } from '../../utils/store';
import { StorageKeys } from '../../constants/storage/storageKeys';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../slice/authSlice';
import BusSelection from '../../screens/home/BusSelection/BusSelection';
import FullRouteScreen from '../../screens/home/FullRouteScreen/FullRouteScreen';
import NotificationScreen from '../../screens/home/NotificationScreen/NotificationScreen';
import TrackRideScreen from '../../screens/rides/TrackRideScreen/TrackRideScreen';
import TicketDetailScreen from '../../screens/rides/TicketDetailScreen/TicketDetailScreen';
import { RootStackParamList } from '../types';
import SetYourProfileScreen from '../../screens/profile/SetYourProfileScreen/SetYourProfileScreen';
import SetCommuteScreen from '../../screens/home/SetCommuteScreen/SetCommuteScreen';
import FindCommute from '../../screens/home/FindCommute/FindCommute';
import ConfirmBookingDetails from '../../screens/Bookings/ConfirmBookingDetails/ConfirmBookingDetails';
import BookingOptions from '../../screens/Bookings/BookingOptions/BookingOptions';
import PaymentOptions from '../../screens/Bookings/PaymentOptions/PaymentOptions';
import BookingSuccess from '../../screens/Bookings/BookingSuccess/BookingSuccess';
import SeatSelection from '../../screens/Bookings/SeatSelection/SeatSelection';
import TicketsScreen from '../../screens/Bookings/TicketsScreen/TicketsScreen';
import SelfBoardScannerScreen from '../../screens/Boarding/SelfBoardScanner/SelfBoardScannerScreen';
import SelfBoardSuccessScreen from '../../screens/Boarding/SelfBoardSuccess/SelfBoardSuccessScreen';
import SelfBoardErrorScreen from '../../screens/Boarding/SelfBoardError/SelfBoardErrorScreen';
import SplashScreen from '../../screens/splash/SplashScreen';
import Dummy from '../../screens/dummy/Dummy';
import TransactionHistoryScreen from '../../screens/transactions/TransactionHistoryScreen/TransactionHistoryScreen';
import TransactionDetailScreen from '../../screens/transactions/TransactionDetailScreen/TransactionDetailScreen';
import SavedLocationsScreen from '../../screens/savedLocations/SavedLocationsScreen';
import AddEditLocationScreen from '../../screens/addEditLocation/AddEditLocationScreen';
import RentBusScreen from '../../screens/rentals/RentBusScreen/RentBusScreen';
import RentalRequestsScreen from '../../screens/rentals/RentalRequestsScreen/RentalRequestsScreen';
import RentalDetailsScreen from '../../screens/rentals/RentalDetailsScreen/RentalDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    tabBarContainer: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
  });

  useEffect(() => {
    const token = storage.getString(StorageKeys.ACCESS_TOKEN);
    if (token) {
      dispatch(setAccessToken(token));
    }
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ScreenNames.SPLASH_SCREEN as never}>
        <Stack.Screen name={ScreenNames.SPLASH_SCREEN as never} component={SplashScreen} />
        <Stack.Screen name={ScreenNames.LOGIN_SCREEN} component={EnterPhNo} />
        <Stack.Screen name={ScreenNames.DASHBOARD_SCREEN}>
          {() => (
            <View style={styles.tabBarContainer}>
              <DrawerNavigator />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name={ScreenNames.VIEW_PROFILE} component={ViewProfile} />
        <Stack.Screen name={ScreenNames.SUGGEST_YOUR_STOPS} component={SuggestYourStops} />
        <Stack.Screen name={ScreenNames.MY_SUGGESTIONS} component={MySuggestionsScreen} />
        <Stack.Screen name={ScreenNames.BUS_SELECTION_SCREEN as never} component={BusSelection} />
        <Stack.Screen name={ScreenNames.TRACK_RIDE_SCREEN} component={TrackRideScreen} />
        <Stack.Screen name={ScreenNames.TICKET_DETAIL_SCREEN} component={TicketDetailScreen} />
        <Stack.Screen name={ScreenNames.FULL_ROUTE_SCREEN as never} component={FullRouteScreen} />
        <Stack.Screen name={ScreenNames.NOTIFICATION_SCREEN as never} component={NotificationScreen} />
        <Stack.Screen name={ScreenNames.SET_PROFILE_SCREEN as never} component={SetYourProfileScreen} />
        <Stack.Screen name={ScreenNames.SET_COMMUTE as never} component={SetCommuteScreen} />
        <Stack.Screen name={ScreenNames.FIND_COMMUTE as never} component={FindCommute} />
        <Stack.Screen name={ScreenNames.CONFIRM_BOOKING_DETAILS as never} component={ConfirmBookingDetails} />
        <Stack.Screen name={ScreenNames.BOOKING_OPTIONS as never} component={BookingOptions} />
        <Stack.Screen name={ScreenNames.PAYMENT_OPTIONS as never} component={PaymentOptions} />
        <Stack.Screen name={ScreenNames.BOOKING_SUCCESS as never} component={BookingSuccess} />
        <Stack.Screen name={ScreenNames.SEAT_SELECTION as never} component={SeatSelection} />
        <Stack.Screen name={ScreenNames.TICKETS_SCREEN as never} component={TicketsScreen} />
        <Stack.Screen name={ScreenNames.SELF_BOARD_SCANNER as never} component={SelfBoardScannerScreen} />
        <Stack.Screen name={ScreenNames.SELF_BOARD_SUCCESS as never} component={SelfBoardSuccessScreen} />
        <Stack.Screen name={ScreenNames.SELF_BOARD_ERROR as never} component={SelfBoardErrorScreen} />
        <Stack.Screen name={ScreenNames.TRANSACTION_HISTORY_SCREEN as never} component={TransactionHistoryScreen} />
        <Stack.Screen name={ScreenNames.TRANSACTION_DETAIL_SCREEN as never} component={TransactionDetailScreen} />
        <Stack.Screen name={ScreenNames.SAVED_PLACES_SCREEN as never} component={SavedLocationsScreen} />
        <Stack.Screen name={ScreenNames.ADD_EDIT_LOCATION_SCREEN as never} component={AddEditLocationScreen} />
        <Stack.Screen name={ScreenNames.RENT_A_BUS_SCREEN as never} component={RentBusScreen} />
        <Stack.Screen name={ScreenNames.RENTAL_REQUESTS_SCREEN as never} component={RentalRequestsScreen} />
        <Stack.Screen name={ScreenNames.RENTAL_DETAILS_SCREEN as never} component={RentalDetailsScreen} />
        <Stack.Screen name={ScreenNames.DUMMY as never} component={Dummy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
