import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
import { useBalance, useTransactions } from '../../../hooks/useWallet';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const bottomSheetRef = useRef<BottomSheetType>(null);

  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useBalance();
  const {
    data: transactionsData,
    isLoading: txLoading,
    refetch: refetchTx,
  } = useTransactions();

  const isRefreshing = balanceLoading || txLoading;
  const handleRefresh = () => {
    refetchBalance();
    refetchTx();
  };

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.contentContainer}>
          <BalanceCard
            balance={parseFloat(balanceData?.balance || '0')}
            onAddMoney={handleOpenAddMoney}
          />

          <Text varient="semi-bold" style={styles.transactionTitle}>
            Transaction History
          </Text>

          <View style={styles.transactionContainer}>
            {(transactionsData ?? []).map((tx: any) => (
              <TransactionCard
                key={tx.id}
                type={tx.type === 'CREDIT' ? 'Credit' : 'Debit'}
                amount={tx.amount}
                date={tx.date}
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
