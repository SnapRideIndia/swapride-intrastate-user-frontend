import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './PaymentOptions.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PaymentMethodCard from '../../../components/domain/booking/PaymentMethodCard/PaymentMethodCard';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNames } from '../../../navigation/constant';

const PaymentOptions = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'razorpay'>('razorpay');

  const handleProceedPayment = () => {
    // Payment processing logic
    console.log('Proceeding with', selectedMethod);
    navigation.navigate(ScreenNames.BOOKING_SUCCESS as never);
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Choose payment method" />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <PaymentMethodCard
            icon={ImageSource.wallet}
            title="Wallet"
            subtitle="Available Balance : ₹200"
            errorText="Insufficient balance"
            isSelected={selectedMethod === 'wallet'}
            onPress={() => setSelectedMethod('wallet')}
            tintIconWithPrimary={true}
            rightAction={
              <View style={styles.addMoneyBtnContainer}>
                <PrimaryButton title="Add ₹100" btnStyle={styles.addMoneyBtn} textStyle={styles.addMoneyBtnText} />
              </View>
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
        <PrimaryButton title="Proceed Payment" onPress={handleProceedPayment} btnStyle={styles.proceedBtn} />
      </SafeAreaView>
    </View>
  );
};

export default PaymentOptions;
