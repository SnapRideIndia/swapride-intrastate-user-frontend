import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './WalletScreen.styles';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import BalanceCard from '../../../components/domain/wallet/card/BalanceCard/BalanceCard';
import TransactionCard from '../../../components/domain/wallet/card/TransactionCard/TransactionCard';
import { BottomSheetModal as BottomSheetType } from '@gorhom/bottom-sheet';
import { AddAmountSheet } from '../../../components/domain/wallet/sheets/AddAmountSheet/AddAmountSheet';

const mockTransactions: {
  type: 'Credit' | 'Debit';
  amount: number;
  date: number;
}[] = [
  {
    type: 'Credit',
    amount: 100.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Debit',
    amount: 50.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Credit',
    amount: 100.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Debit',
    amount: 50.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Credit',
    amount: 100.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Debit',
    amount: 50.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Credit',
    amount: 100.0,
    date: 1740451200, //timestamp in milliseconds
  },
  {
    type: 'Debit',
    amount: 50.0,
    date: 1740451200, //timestamp in milliseconds
  },
];

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const bottomSheetRef = useRef<BottomSheetType>(null);

  const handleOpenAddMoney = () => {
    bottomSheetRef.current?.present();
  };

  const handleContinueAddMoney = (amount: string) => {
    console.log('Continuing with amount:', amount);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Wallet" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentContainerStyle}
      >
        <View style={styles.contentContainer}>
          <BalanceCard balance={199.5} onAddMoney={handleOpenAddMoney} />

          <Text varient="semi-bold" style={styles.transactionTitle}>
            Transaction History
          </Text>

          <View style={styles.transactionContainer}>
            {mockTransactions.map((transaction, index) => (
              <TransactionCard
                key={index}
                type={transaction.type}
                amount={transaction.amount}
                date={transaction.date}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <AddAmountSheet
        ref={bottomSheetRef}
        onContinue={handleContinueAddMoney}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({});
