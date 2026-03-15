import React, { useState } from 'react';
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

  const [preferredTime, setPreferredTime] = useState('');
  const [meridian, setMeridian] = useState<'AM' | 'PM'>('PM');

  const { mutate: initiateBooking, isPending } = useInitiateBooking(
    data => {
      console.log('Initiate Booking Response ===>', data);
      navigation.navigate(ScreenNames.CONFIRM_BOOKING_DETAILS, { bookingId: data.bookingId });
    },
    error => {
      const errorMsg = Array.isArray(error?.message) ? error.message.join(', ') : error?.message || 'Something went wrong';
      Alert.alert('Booking Failed', errorMsg);
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

  const handleShowReturnBuses = (timeString?: string) => {
    if (!searchBaseParams) return;

    const timeToPass = timeString || (preferredTime ? `${preferredTime} ${meridian}` : undefined);

    // Swap locations for return trip
    const returnParams = {
      pickup: {
        latitude: searchBaseParams.dropoff.latitude,
        longitude: searchBaseParams.dropoff.longitude,
        address: searchBaseParams.dropoff.address,
        placeName: searchBaseParams.dropoff.placeName,
      },
      dropoff: {
        latitude: searchBaseParams.pickup.latitude,
        longitude: searchBaseParams.pickup.longitude,
        address: searchBaseParams.pickup.address,
        placeName: searchBaseParams.pickup.placeName,
      },
      userLocation: {
        latitude: searchBaseParams.userLocation.latitude,
        longitude: searchBaseParams.userLocation.longitude,
      },
    };

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex,
        searchBaseParams: returnParams,
      }),
    );
    dispatch(setCommuteData(null));

    const tripDate = dateTabs[activeDateIndex]?.date;

    dispatch(
      setCommuteSearchContext({
        dateTabs,
        activeDateIndex,
        searchBaseParams: returnParams,
      }),
    );

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
          <ReturnRideCard
            preferredTime={preferredTime}
            setPreferredTime={setPreferredTime}
            meridian={meridian}
            setMeridian={setMeridian}
            onShowBuses={handleShowReturnBuses}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingOptions;
