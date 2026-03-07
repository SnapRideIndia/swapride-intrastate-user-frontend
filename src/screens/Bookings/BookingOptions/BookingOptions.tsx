import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BookingOptions.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import BookOnewayCard from '../../../components/domain/booking/BookOnewayCard/BookOnewayCard';
import ReturnRideCard from '../../../components/domain/booking/ReturnRideCard/ReturnRideCard';
import { ScreenNames } from '../../../navigation/constant';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useInitiateBooking } from '../../../hooks/useBooking';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setCommuteSearchContext, setCommuteData } from '../../../slice/commuteSlice';

const BookingOptions = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.BOOKING_OPTIONS>>();
  const { outbound } = route.params;
  const dispatch = useDispatch();
  const { searchBaseParams, dateTabs, activeDateIndex } = useSelector((state: RootState) => state.commute);

  const { mutate: initiateBooking, isPending } = useInitiateBooking(
    data => {
      console.log('Initiate Booking Response ===>', data);
      navigation.navigate(ScreenNames.CONFIRM_BOOKING_DETAILS, { bookingId: data.bookingId });
    },
    error => {
      Alert.alert('Booking Failed', error?.message || 'Something went wrong');
    },
  );

  const handleProceedOneway = () => {
    const payload = {
      tripId: outbound.timing.tripId,
      pickupStopId: outbound.result.pickup.pointId,
      dropoffStopId: outbound.result.dropoff.pointId,
      totalAmount: outbound.result.baseFare,
    };
    console.log('Initiate Booking Request Payload ===>', payload);
    initiateBooking(payload);
  };

  const handleShowReturnBuses = () => {
    if (!searchBaseParams) return;

    // Swap locations for return trip
    const returnParams = {
      ...searchBaseParams,
      pickupLat: searchBaseParams.dropoffLat,
      pickupLng: searchBaseParams.dropoffLng,
      pickupName: searchBaseParams.dropoffName,
      dropoffLat: searchBaseParams.pickupLat,
      dropoffLng: searchBaseParams.pickupLng,
      dropoffName: searchBaseParams.pickupName,
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex,
        searchBaseParams: returnParams,
      }),
    );
    dispatch(setCommuteData(null));

    navigation.navigate(ScreenNames.BUS_SELECTION_SCREEN, {
      isReturnLeg: true,
      outbound: outbound,
    });
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Booking Options" />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <BookOnewayCard price={outbound.result.baseFare.toString()} onProceed={handleProceedOneway} />
          <ReturnRideCard onShowBuses={handleShowReturnBuses} />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingOptions;
