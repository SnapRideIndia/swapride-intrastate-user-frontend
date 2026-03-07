import React, { useRef } from 'react';
import { View, ScrollView } from 'react-native';
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

const mockBookingData = {
  outbound: {
    type: 'outbound' as const,
    date: 'Tomorrow,2nd Feb',
    pickup: {
      time: '4:05 am',
      title: 'Peninsula Corporate PArk',
      description: 'In front of Matula cnter , under the fly over',
      walkText: '3 min walk (17 m)',
    },
    dropoff: {
      time: '4:05 am',
      title: 'Peninsula Corporate PArk',
      description: 'In front of Matula cnter , under the fly over',
      walkText: '3 min walk (17 m)',
    },
    seat: '2B',
  },
  returnTrip: {
    type: 'return' as const,
    date: 'Tomorrow,2nd Feb',
    pickup: {
      time: '4:05 pm',
      title: 'Peninsula Corporate PArk',
      description: 'In front of Matula cnter , under the fly over',
      walkText: '3 min walk (17 m)',
    },
    dropoff: {
      time: '4:05 pm',
      title: 'Peninsula Corporate PArk',
      description: 'In front of Matula cnter , under the fly over',
      walkText: '3 min walk (17 m)',
    },
    seat: '2B',
  },

  fare: {
    outboundFare: 199,
    returnFare: 199,
    walletBalance: 0,
  },
};

const ConfirmBookingDetails = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; savings: number } | null>(null);

  const handleApplyPromo = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Confirm Booking Details" />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <TripSummaryCard {...mockBookingData.outbound} onChangeSeat={() => navigation.navigate(ScreenNames.SEAT_SELECTION as never)} />
          <TripSummaryCard {...mockBookingData.returnTrip} onChangeSeat={() => navigation.navigate(ScreenNames.SEAT_SELECTION as never)} />
        </View>

        <View style={[styles.whiteSection, styles.whiteSectionWithGap]}>
          <FareDetails
            {...mockBookingData.fare}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={() => setAppliedCoupon(null)}
            appliedCoupon={appliedCoupon}
          />
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
            <PrimaryButton
              title="Proceed to payment"
              onPress={() => navigation.navigate(ScreenNames.PAYMENT_OPTIONS as never)}
              btnStyle={styles.proceedBtn}
            />
          </SafeAreaView>
        </View>
      </ScrollView>

      <SwBottomSheet ref={bottomSheetRef} title="Apply Coupon" snapPoints={['30%']}>
        <View style={styles.couponContainer}>
          <SwTextInput
            variant="rounded"
            placeholder="Enter Coupon Code"
            renderRightIcon={() => (
              <TouchableOpacity
                onPress={() => {
                  setAppliedCoupon({ code: 'DLV25', savings: 20.2 });
                  bottomSheetRef.current?.dismiss();
                }}
              >
                <Text variant="bold" style={styles.applyBtnText}>
                  Apply
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
