import React, { useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './PaymentOptions.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PaymentMethodCard from '../../../components/domain/booking/PaymentMethodCard/PaymentMethodCard';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNames } from '../../../navigation/constant';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { useConfirmBooking } from '../../../hooks/useBooking';
import { PaymentMethod } from '../../../types/booking.types';

import { useBalance, useInitiateTopUp } from '../../../hooks/useWallet';
import RazorpayService from '../../../services/RazorpayService';
import { useFetchCurrentProfile } from '../../../hooks/useProfile';

const PaymentOptions = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.PAYMENT_OPTIONS>>();
  const { bookingId, returnBookingId, totalAmount } = route.params;

  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'razorpay'>('razorpay');

  const { data: profile } = useFetchCurrentProfile();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance();

  React.useEffect(() => {
    if (balanceData) {
      console.log('Get Wallet Balance Response ===>', balanceData);
    }
  }, [balanceData]);

  const walletBalance = balanceData?.balance || 0;
  const insufficientBalance = walletBalance < totalAmount;
  const topUpAmount = insufficientBalance ? Math.ceil(totalAmount - walletBalance) : 0;

  const handleRazorpayPayment = async (gatewayData: any) => {
    try {
      await RazorpayService.openCheckout({
        keyId: gatewayData.razorpayKeyId,
        amount: gatewayData.amount,
        currency: gatewayData.currency,
        orderId: gatewayData.razorpayOrderId,
        name: 'SwapRide',
        description: `Booking – ${gatewayData.orderId}`,
        prefill: {
          name: profile?.fullName || '',
          email: profile?.emailAddress || '',
          contact: profile?.mobileNumber || '',
        },
      });
      console.log('Razorpay Payment Success (Booking)');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: ScreenNames.DASHBOARD_SCREEN }, { name: ScreenNames.BOOKING_SUCCESS, params: { bookingId } }],
        }),
      );
    } catch (err: any) {
      const isCancelled = RazorpayService.isCancellation(err);
      console.log(isCancelled ? 'Razorpay cancelled' : 'Razorpay error', err);
      Alert.alert('Payment Failed', isCancelled ? 'Payment was cancelled' : err?.description || 'Gateway error');
    }
  };

  const { mutate: initiateTopUp, isPending: isTopUpPending } = useInitiateTopUp({
    onSuccess: data => {
      console.log('Initiate Top-Up Response ===>', data);
      Alert.alert('Success', 'Wallet topped up successfully!');
      setSelectedMethod('wallet');
    },
    onError: err => {
      Alert.alert('Top-up Failed', err?.message || 'Payment cancelled or failed');
    },
  });

  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking(
    bookingId,
    data => {
      console.log('Confirm Booking Response ===>', data);
      if (data.status === 'SUCCESS') {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: ScreenNames.DASHBOARD_SCREEN }, { name: ScreenNames.BOOKING_SUCCESS, params: { bookingId } }],
          }),
        );
      } else if (data.status === 'PENDING_GATEWAY' && data.gatewayData) {
        handleRazorpayPayment(data.gatewayData);
      }
    },
    err => {
      Alert.alert('Payment Failed', err?.message || 'Something went wrong');
    },
  );

  const handleProceedPayment = () => {
    if (selectedMethod === 'wallet' && insufficientBalance) {
      Alert.alert('Insufficient Balance', 'Please add money to your wallet to continue.');
      return;
    }

    const payload = {
      paymentMethod: selectedMethod === 'wallet' ? PaymentMethod.WALLET : PaymentMethod.RAZORPAY,
      returnBookingId,
    };
    console.log('Confirm Booking Request Payload ===>', payload);
    confirmBooking(payload);
  };

  const handleAddMoney = () => {
    console.log('Initiate Top-Up Request Amount ===>', topUpAmount);
    initiateTopUp(topUpAmount);
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Choose payment method" />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <PaymentMethodCard
            icon={ImageSource.wallet}
            title="Wallet"
            subtitle={isBalanceLoading ? 'Loading balance...' : `Available Balance : ₹${walletBalance}`}
            errorText={insufficientBalance ? 'Insufficient balance' : undefined}
            isSelected={selectedMethod === 'wallet'}
            onPress={() => setSelectedMethod('wallet')}
            tintIconWithPrimary={true}
            rightAction={
              insufficientBalance ? (
                <View style={styles.addMoneyBtnContainer}>
                  <PrimaryButton
                    title={isTopUpPending ? '...' : `Add ₹${topUpAmount}`}
                    onPress={handleAddMoney}
                    btnStyle={styles.addMoneyBtn}
                    textStyle={styles.addMoneyBtnText}
                    disabled={isTopUpPending}
                  />
                </View>
              ) : null
            }
          />

          <PaymentMethodCard
            icon={ImageSource.razorpay}
            title="Pay via Razorpay"
            subtitle="UPI • Card • Net Banking"
            isSelected={selectedMethod === 'razorpay'}
            onPress={() => setSelectedMethod('razorpay')}
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PrimaryButton
          title={isConfirming ? 'Confirming...' : 'Proceed Payment'}
          onPress={handleProceedPayment}
          btnStyle={styles.proceedBtn}
          disabled={isConfirming || isTopUpPending}
        />
      </SafeAreaView>
    </View>
  );
};

export default PaymentOptions;
