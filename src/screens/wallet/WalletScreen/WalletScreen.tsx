import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React, { useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './WalletScreen.styles';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import BalanceCard from '../../../components/domain/wallet/card/BalanceCard/BalanceCard';
import TransactionCard from '../../../components/domain/wallet/card/TransactionCard/TransactionCard';
import { BottomSheetModal as BottomSheetType } from '@gorhom/bottom-sheet';
import { AddAmountSheet } from '../../../components/domain/wallet/sheets/AddAmountSheet/AddAmountSheet';
import {
  useBalance,
  useInitiateTopUp,
  useTransactions,
} from '../../../hooks/useWallet';
import { Transaction } from '../../../services/WalletService';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const bottomSheetRef = useRef<BottomSheetType>(null);

  // Balance
  const {
    data: balanceData,
    isLoading: balanceLoading,
    isError: balanceError,
    refetch: refetchBalance,
  } = useBalance();

  // Transactions (infinite)
  const {
    data: txPages,
    isLoading: txLoading,
    isError: txError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchTx,
  } = useTransactions();

  // Top-up mutation
  const { mutate: initiateTopUp, isPending: topUpLoading } = useInitiateTopUp({
    onSuccess: () => {
      bottomSheetRef.current?.dismiss();
    },
    onError: () => {
      // Error handled inside the hook; dismiss sheet so user can retry
      bottomSheetRef.current?.dismiss();
    },
  });

  // Flatten pages into a single array
  const transactions: Transaction[] = txPages?.pages.flatMap(p => p.data) ?? [];

  const isRefreshing = balanceLoading || txLoading;

  const handleRefresh = useCallback(() => {
    refetchBalance();
    refetchTx();
  }, [refetchBalance, refetchTx]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOpenAddMoney = () => {
    bottomSheetRef.current?.present();
  };

  const handleContinueAddMoney = (amount: number) => {
    initiateTopUp(amount);
  };

  // Renders
  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionCard
        key={item.id}
        type={item.type === 'CREDIT' ? 'Credit' : 'Debit'}
        amount={item.amount}
        date={item.date}
      />
    ),
    [],
  );

  const renderHeader = () => (
    <View style={styles.contentContainer}>
      {balanceError ? (
        <Text varient="regular" style={styles.errorText}>
          Failed to load balance. Pull down to retry.
        </Text>
      ) : (
        <BalanceCard
          balance={balanceData?.balance || '0.00'}
          onAddMoney={handleOpenAddMoney}
        />
      )}

      <Text varient="semi-bold" style={styles.transactionTitle}>
        Transaction History
      </Text>

      {txError && (
        <Text varient="regular" style={styles.errorText}>
          Failed to load transactions. Pull down to retry.
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (txLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text varient="regular" style={styles.emptyText}>
          No transactions found.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Wallet" />
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <AddAmountSheet
        ref={bottomSheetRef}
        onContinue={handleContinueAddMoney}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({});
