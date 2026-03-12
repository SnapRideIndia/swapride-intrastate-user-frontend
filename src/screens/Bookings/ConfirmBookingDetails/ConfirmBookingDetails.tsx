import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './ConfirmBookingDetails.styles';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import TripSummaryCard from '../../../components/domain/booking/TripSummaryCard/TripSummaryCard';
import FareDetails from '../../../components/domain/booking/FareDetails/FareDetails';
import PolicyInfoBox from '../../../components/domain/booking/PolicyInfoBox/PolicyInfoBox';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwBottomSheet } from '../../../components/common/BottomSheet/BottomSheet';
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native';
import { ScreenNames } from '../../../navigation/constant';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { useBookingDetails, useApplyCoupon, useRemoveCoupon } from '../../../hooks/useBooking';
import { useBalance } from '../../../hooks/useWallet';
import { LegDetail } from '../../../types/booking.types';
import { format } from 'date-fns';
import ConfirmBookingDetailsSkeleton from './ConfirmBookingDetailsSkeleton';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

const mapLegToSummary = (leg: LegDetail, type: 'outbound' | 'return') => {
  const tripDateObj = leg.tripDate ? new Date(leg.tripDate) : new Date();
  const pickupTimeObj = leg.pickup.arrivalTime ? new Date(leg.pickup.arrivalTime) : null;
  const dropoffTimeObj = leg.dropoff.arrivalTime ? new Date(leg.dropoff.arrivalTime) : null;

  const pickupDistanceText = leg.pickup.distanceText || '';
  const pickupWalkDurationText = leg.pickup.walkDurationText || '';

  const dropoffDistanceText = leg.dropoff.distanceText || '';
  const dropoffWalkDurationText = leg.dropoff.walkDurationText || '';

  let pickupWalkText = '';
  if (pickupDistanceText && pickupWalkDurationText) {
    pickupWalkText = `${pickupDistanceText} • ${pickupWalkDurationText} walk`;
  } else if (pickupDistanceText) {
    pickupWalkText = pickupDistanceText;
  } else if (pickupWalkDurationText) {
    pickupWalkText = `${pickupWalkDurationText} walk`;
  }

  let dropoffWalkText = '';
  if (dropoffDistanceText && dropoffWalkDurationText) {
    dropoffWalkText = `${dropoffDistanceText} • ${dropoffWalkDurationText} walk`;
  } else if (dropoffDistanceText) {
    dropoffWalkText = dropoffDistanceText;
  } else if (dropoffWalkDurationText) {
    dropoffWalkText = `${dropoffWalkDurationText} walk`;
  }

  return {
    type,
    tripId: leg.tripId,
    bookingId: leg.bookingId,
    date: format(tripDateObj, 'eeee, do MMM'),
    pickup: {
      time: pickupTimeObj ? format(pickupTimeObj, 'hh:mm a') : leg.pickup.arrivalTime,
      title: leg.pickup.name,
      description: leg.pickup.address,
      walkText: pickupWalkText,
    },
    dropoff: {
      time: dropoffTimeObj ? format(dropoffTimeObj, 'hh:mm a') : leg.dropoff.arrivalTime,
      title: leg.dropoff.name,
      description: leg.dropoff.address,
      walkText: dropoffWalkText,
    },
    seat: leg.assignedSeats.map(s => s.seatNumber).join(', '),
  };
};

const ConfirmBookingDetails = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.CONFIRM_BOOKING_DETAILS>>();
  const { bookingId } = route.params;
  const { searchBaseParams } = useSelector((store: RootState) => store.commute);
  const userLat = searchBaseParams?.userLocation?.latitude;
  const userLng = searchBaseParams?.userLocation?.longitude;

  const { data: booking, isLoading, isError, error, refetch } = useBookingDetails(bookingId, userLat, userLng);
  const { data: balanceData } = useBalance();

  useEffect(() => {
    if (booking) {
      // Debug: confirm booking details API response
      console.log('ConfirmBookingDetails booking response:', booking);
    }
  }, [booking]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [promoCode, setPromoCode] = useState('');

  const { mutate: applyCoupon, isPending: isApplyingCoupon } = useApplyCoupon(
    bookingId,
    data => {
      Alert.alert('Success', 'Coupon applied successfully');
      refetch();
      bottomSheetRef.current?.dismiss();
      setPromoCode('');
    },
    err => {
      Alert.alert('Failed', err?.message || 'Invalid coupon code');
    },
  );

  const { mutate: removeCoupon } = useRemoveCoupon(
    bookingId,
    () => {
      Alert.alert('Success', 'Coupon removed successfully');
      refetch();
    },
    err => {
      Alert.alert('Failed', err?.message || 'Failed to remove coupon');
    },
  );

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const payload = {
      couponCode: promoCode,
      returnBookingId: booking?.isRoundTrip ? booking.return?.bookingId : undefined,
    };
    applyCoupon(payload);
  };

  const handleProceed = () => {
    navigation.navigate(ScreenNames.PAYMENT_OPTIONS, {
      bookingId,
      returnBookingId: booking?.isRoundTrip ? booking.return?.bookingId : undefined,
      totalAmount: booking?.totalPayable || 0,
    });
  };

  const outboundSummary = useMemo(() => {
    if (!booking) return null;
    return booking.isRoundTrip ? mapLegToSummary(booking.outbound, 'outbound') : mapLegToSummary(booking as any, 'outbound');
  }, [booking]);

  const returnSummary = useMemo(() => {
    if (!booking || !booking.isRoundTrip) return null;
    return mapLegToSummary(booking.return, 'return');
  }, [booking]);

  const fareSummary = useMemo(() => {
    if (!booking) return null;
    const isRoundTrip = booking.isRoundTrip;
    const subTotal = isRoundTrip ? booking.outbound.subTotal + (booking.return?.subTotal || 0) : booking.subTotal;

    const discountAmount = isRoundTrip ? booking.outbound.discountAmount + (booking.return?.discountAmount || 0) : booking.discountAmount;

    return {
      outboundFare: isRoundTrip ? booking.outbound.subTotal : booking.subTotal,
      returnFare: isRoundTrip ? booking.return?.subTotal : undefined,
      totalPayable: booking.totalPayable,
      discountAmount,
      subTotal,
      walletBalance: balanceData?.balance || 0,
    };
  }, [booking, balanceData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PrimaryHeader title="Confirm Booking Details" />
        <ConfirmBookingDetailsSkeleton />
      </View>
    );
  }

  if (isError || !booking) {
    return (
      <View style={styles.container}>
        <PrimaryHeader title="Confirm Booking Details" />
        <View style={styles.errorWrapper}>
          <View style={[styles.whiteSection, styles.errorCard]}>
            <Text variant="semi-bold" style={styles.errorMessage}>
              {'This booking is no longer available (likely timed out). Please start a new booking.'}
            </Text>
            <PrimaryButton
              title="Go Back"
              onPress={() => navigation.navigate(ScreenNames.FIND_COMMUTE)}
              btnStyle={styles.fullWidthButton}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Confirm Booking Details" />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {outboundSummary && (
            <TripSummaryCard
              {...outboundSummary}
              onChangeSeat={() =>
                navigation.navigate(ScreenNames.SEAT_SELECTION, {
                  tripId: outboundSummary.tripId,
                  bookingId: outboundSummary.bookingId,
                  initialSeatNumber: outboundSummary.seat,
                })
              }
            />
          )}

          {returnSummary && (
            <TripSummaryCard
              {...returnSummary}
              onChangeSeat={() =>
                navigation.navigate(ScreenNames.SEAT_SELECTION, {
                  tripId: returnSummary.tripId,
                  bookingId: returnSummary.bookingId,
                  initialSeatNumber: returnSummary.seat,
                })
              }
            />
          )}
        </View>

        <View style={[styles.whiteSection, styles.whiteSectionWithGap]}>
          {fareSummary && (
            <FareDetails
              {...fareSummary}
              onApplyPromo={() => bottomSheetRef.current?.present()}
              onRemovePromo={() => {
                Alert.alert('Remove Coupon', 'Are you sure you want to remove this coupon?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeCoupon() },
                ]);
              }}
              appliedCoupon={fareSummary.discountAmount > 0 ? { code: 'Applied', savings: fareSummary.discountAmount } : null}
            />
          )}
          <PolicyInfoBox />
        </View>

        <View style={styles.whiteSection}>
          <View style={styles.policyRow}>
            <Text variant="semi-bold" style={styles.policyText}>
              Cancellation & Reschedule Policy
            </Text>
          </View>
          {/* Footer */}
          <SafeAreaView edges={['bottom']} style={styles.footer}>
            <PrimaryButton title="Proceed" onPress={handleProceed} btnStyle={styles.proceedBtn} />
          </SafeAreaView>
        </View>
      </ScrollView>

      <SwBottomSheet ref={bottomSheetRef} title="Apply Coupon" snapPoints={['30%']}>
        <View style={styles.couponContainer}>
          <SwTextInput
            variant="rounded"
            placeholder="Enter Coupon Code"
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
            renderRightIcon={() => (
              <TouchableOpacity onPress={handleApplyPromo} disabled={isApplyingCoupon || !promoCode.trim()}>
                <Text variant="bold" style={[styles.applyBtnText, (!promoCode.trim() || isApplyingCoupon) && { opacity: 0.5 }]}>
                  {isApplyingCoupon ? '...' : 'Apply'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SwBottomSheet>
    </View>
  );
};

export default ConfirmBookingDetails;
