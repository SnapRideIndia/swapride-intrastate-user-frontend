import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TransactionHistoryScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import TransactionCard from '../../../components/domain/wallet/card/TransactionCard/TransactionCard';
import { ScreenNames } from '../../../navigation/constant';
import { useTransactions } from '../../../hooks/useWallet';
import type { Transaction } from '../../../services/WalletService';
import { ImageSource } from '../../../constants/images';
import TransactionCardShimmer from '../../../components/domain/wallet/card/TransactionCard/TransactionCardShimmer';
import { useDebounce } from '../../../hooks/useDebounce';
import { NoResults } from '../../../components/common/NoResults/NoResults';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { DATE_FILTER_OPTIONS, TransactionDateFilterSheet } from '../../../components/domain/wallet/sheets/TransactionFilterSheet/TransactionDateFilterSheet';
import {
  AMOUNT_FILTER_OPTIONS,
  TransactionAmountFilterSheet,
} from '../../../components/domain/wallet/sheets/TransactionFilterSheet/TransactionAmountFilterSheet';
import {
  PAYMENT_FILTER_OPTIONS,
  PaymentFilterValue,
  TransactionPaymentFilterSheet,
} from '../../../components/domain/wallet/sheets/TransactionFilterSheet/TransactionPaymentFilterSheet';
import type { AmountFilter, DateFilter } from '../../../types/transactionFilters';

const TransactionHistoryScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [dateFilter, setDateFilter] = useState<DateFilter>({ mode: 'NONE' });
  const dateSheetRef = useRef<BottomSheetModal>(null);
  const [amountFilter, setAmountFilter] = useState<AmountFilter>({ mode: 'NONE' });
  const amountSheetRef = useRef<BottomSheetModal>(null);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilterValue | null>('ALL');
  const paymentSheetRef = useRef<BottomSheetModal>(null);

  // Build filters object for API based on search + selected filters
  const filters = useMemo(() => {
    const base: any = {
      filter: (paymentFilter ?? 'ALL') as PaymentFilterValue,
    };

    const trimmedSearch = debouncedSearch.trim();
    if (trimmedSearch.length > 0) {
      base.search = trimmedSearch;
    }

    if (dateFilter.mode === 'PRESET') {
      base.datePreset = dateFilter.preset;
    } else if (dateFilter.mode === 'CUSTOM') {
      base.startDate = dateFilter.startDate;
      base.endDate = dateFilter.endDate;
    }

    if (amountFilter.mode === 'PRESET' || amountFilter.mode === 'CUSTOM') {
      if (typeof amountFilter.min === 'number') {
        base.minAmount = amountFilter.min;
      }
      if (typeof amountFilter.max === 'number') {
        base.maxAmount = amountFilter.max;
      }
    }

    return base;
  }, [paymentFilter, debouncedSearch, dateFilter, amountFilter]);

  // Fetch real transactions with filters
  const {
    data: txPages,
    isLoading: txLoading,
    isError: txError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTransactions(filters);

  useEffect(() => {
    if (txLoading || txError || !txPages) {
      return;
    }
    console.log('TransactionHistoryScreen transactions pages ===>', JSON.stringify(txPages.pages, null, 2));
  }, [txPages, txLoading, txError]);

  const transactions: Transaction[] = useMemo(
    () => txPages?.pages.flatMap(page => page.data) ?? [],
    [txPages],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleCardPress = (transactionId: string) => {
    navigation.navigate(ScreenNames.TRANSACTION_DETAIL_SCREEN, { transactionId });
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity activeOpacity={1} onPress={() => handleCardPress(item.id)}>
      <TransactionCard
        type={item.type === 'CREDIT' ? 'Credit' : 'Debit'}
        amount={item.amount}
        date={item.date}
      />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <NoResults
      image={ImageSource.noTicketsFound}
      title="No transactions found"
      subtitle="Your transactions will appear here."
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Transaction History" />
      <View style={styles.searchContainer}>
        <SwTextInput
          variant="rounded"
          placeholder="Search by amount, name..."
          value={search}
          onChangeText={setSearch}
          inputContainerStyle={styles.searchInput}
          renderLeftIcon={() => (
            <Image source={ImageSource.searhIcon} style={styles.searchIcon} />
          )}
        />
      </View>

      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterChip}
            onPress={() => dateSheetRef.current?.present()}
          >
            <Text variant="regular" style={styles.filterChipText}>
              {dateFilter.mode === 'PRESET'
                ? DATE_FILTER_OPTIONS.find(opt => opt.value === dateFilter.preset)?.label ?? 'Date'
                : dateFilter.mode === 'CUSTOM'
                ? 'Custom date'
                : 'Date'}
            </Text>
            <Image source={ImageSource.rightTriangleArrow} style={styles.filterChipIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterChip}
            onPress={() => amountSheetRef.current?.present()}
          >
            <Text variant="regular" style={styles.filterChipText}>
              {amountFilter.mode === 'PRESET'
                ? AMOUNT_FILTER_OPTIONS.find(opt => opt.value === (amountFilter as any).preset)?.label ??
                  'Amount'
                : amountFilter.mode === 'CUSTOM'
                ? 'Custom range'
                : 'Amount'}
            </Text>
            <Image source={ImageSource.rightTriangleArrow} style={styles.filterChipIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterChip}
            onPress={() => paymentSheetRef.current?.present()}
          >
            <Text variant="regular" style={styles.filterChipText}>
              {paymentFilter
                ? PAYMENT_FILTER_OPTIONS.find(opt => opt.value === paymentFilter)?.label ?? 'Payment type'
                : 'Payment type'}
            </Text>
            <Image source={ImageSource.rightTriangleArrow} style={styles.filterChipIcon} />
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.filterChip, styles.clearAllChip]}
          onPress={() => {
            setDateFilter({ mode: 'NONE' });
            setAmountFilter({ mode: 'NONE' });
            setPaymentFilter('ALL');
          }}
        >
          <Text variant="regular" style={styles.clearAllChipText}>
            Clear all
          </Text>
        </TouchableOpacity>
      </View>

      {txError && (
        <Text variant="regular" style={styles.errorText}>
          Failed to load transactions. Please try again.
        </Text>
      )}

      {txLoading ? (
        <View style={styles.shimmerList}>
          {[1, 2, 3].map(key => (
            <TransactionCardShimmer key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            transactions.length === 0 ? styles.contentContainer : styles.listContent
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Date filter bottom sheet (UI only, not wired to API yet) */}
      <TransactionDateFilterSheet
        ref={dateSheetRef}
        initialValue={dateFilter}
        onChange={setDateFilter}
      />

      {/* Amount filter bottom sheet (UI only, not wired to API yet) */}
      <TransactionAmountFilterSheet
        ref={amountSheetRef}
        initialValue={amountFilter}
        onChange={setAmountFilter}
      />

      {/* Payment type filter bottom sheet (UI only, not wired to API yet) */}
      <TransactionPaymentFilterSheet
        ref={paymentSheetRef}
        initialValue={paymentFilter}
        onChange={setPaymentFilter}
      />
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;

