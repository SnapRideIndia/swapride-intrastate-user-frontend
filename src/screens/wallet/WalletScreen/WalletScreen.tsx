import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
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
import { ImageSource } from '../../../constants/images';
import { useBalance, useInitiateTopUp, useTransactions } from '../../../hooks/useWallet';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../navigation/constant';
import { Transaction } from '../../../services/WalletService';
import TransactionCardShimmer from '../../../components/domain/wallet/card/TransactionCard/TransactionCardShimmer';
import { NoResults } from '../../../components/common/NoResults/NoResults';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const bottomSheetRef = useRef<BottomSheetType>(null);
  const navigation = useNavigation<any>();

  // Balance
  const { data: balanceData, isLoading: balanceLoading, isError: balanceError, refetch: refetchBalance } = useBalance();

  // Transactions (infinite) - always show wallet transactions here
  const {
    data: txPages,
    isLoading: txLoading,
    isError: txError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchTx,
  } = useTransactions({ filter: 'WALLET' });


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

  const handleTransactionPress = useCallback(
    (id: string) => {
      navigation.navigate(ScreenNames.TRANSACTION_DETAIL_SCREEN as never, { transactionId: id } as never);
    },
    [navigation],
  );

  // Renders
  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TouchableOpacity activeOpacity={1} onPress={() => handleTransactionPress(item.id)}>
        <TransactionCard
          key={item.id}
          type={item.type === 'CREDIT' ? 'Credit' : 'Debit'}
          amount={item.amount}
          date={item.date}
        />
      </TouchableOpacity>
    ),
    [handleTransactionPress],
  );

  const renderHeader = () => (
    <View style={styles.contentContainer}>
      {balanceError ? (
        <Text variant="regular" style={styles.errorText}>
          Failed to load balance. Pull down to retry.
        </Text>
      ) : (
        <BalanceCard balance={balanceData?.balance || '0.00'} onAddMoney={handleOpenAddMoney} />
      )}

      <View style={styles.historyHeaderRow}>
        <Text variant="semi-bold" style={styles.transactionTitle}>
          Transaction History
        </Text>
        <TouchableOpacity
          style={styles.seeAllContainer}
          onPress={() => navigation.navigate(ScreenNames.TRANSACTION_HISTORY_SCREEN)}
        >
          <Text variant="semi-bold" style={styles.seeAllText}>
            See all
          </Text>
          <Image source={ImageSource.chevron} style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {txError && (
        <Text variant="regular" style={styles.errorText}>
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
    if (txLoading) {
      return (
        <View style={styles.shimmerList}>
          {[1, 2, 3].map(key => (
            <TransactionCardShimmer key={key} />
          ))}
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <NoResults
          image={ImageSource.noTicketsFound}
          title="No wallet transactions found"
          subtitle="Your wallet transactions will appear here."
        />
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
        contentContainerStyle={[styles.transactionContainer, transactions.length === 0 && { flexGrow: 1 }]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
      />

      <AddAmountSheet ref={bottomSheetRef} onContinue={handleContinueAddMoney} />
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({});
