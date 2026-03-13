import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TransactionDetailScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import type { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { useTransactionDetail } from '../../../hooks/useWallet';
type DetailRoute = RouteProp<RootStackParamList, typeof ScreenNames.TRANSACTION_DETAIL_SCREEN>;
const TransactionDetailScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const route = useRoute<DetailRoute>();
  const { transactionId } = route.params;
  const { data: apiDetail, error, isLoading } = useTransactionDetail(transactionId);

  if (isLoading || !apiDetail) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="Transaction Details" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="Transaction Details" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text variant="regular" style={styles.rowValue}>
              Unable to load this transaction. Please try again later.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isCredit = apiDetail.direction === 'CREDIT';
  const amountColor = isCredit ? colors.contentGreen : colors.contentRed;
  const dateTimeFormatted = format(new Date(apiDetail.createdAt), 'd MMM yyyy, hh:mm a');

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Transaction Details" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={styles.summary}>
          <Text variant="regular" style={styles.title}>
            {apiDetail.title}
          </Text>
          <Text variant="bold" style={[styles.amount, { color: amountColor }]}>
            {isCredit ? '+ ' : '- '}₹ {Number(apiDetail.amount).toFixed(2)}
          </Text>
          <Text variant="regular" style={styles.date}>
            {dateTimeFormatted}
          </Text>
          <View style={styles.statusBadge}>
            <Text variant="regular" style={styles.statusText}>
              {apiDetail.status}
            </Text>
          </View>
        </View>

        {/* Transaction details */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text variant="regular" style={styles.rowLabel}>
              Payment Method :
            </Text>
            <Text variant="regular" style={styles.rowValue}>
              {apiDetail.paymentMethod || '-'}
            </Text>
          </View>

          {apiDetail.transactionRefId && (
            <View style={styles.row}>
              <Text variant="regular" style={styles.rowLabel}>
                Transaction ID :
              </Text>
              <Text variant="regular" style={styles.rowValue}>
                {apiDetail.transactionRefId}
              </Text>
            </View>
          )}

          {apiDetail.gatewayOrderId && (
            <View style={styles.row}>
              <Text variant="regular" style={styles.rowLabel}>
                Gateway Order ID :
              </Text>
              <Text variant="regular" style={styles.rowValue}>
                {apiDetail.gatewayOrderId}
              </Text>
            </View>
          )}

          {apiDetail.balanceBefore != null && apiDetail.balanceAfter != null && (
            <>
              <View style={styles.row}>
                <Text variant="regular" style={styles.rowLabel}>
                  Balance Before :
                </Text>
                <Text variant="regular" style={styles.rowValue}>
                  ₹ {Number(apiDetail.balanceBefore).toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text variant="regular" style={styles.rowLabel}>
                  Balance After :
                </Text>
                <Text variant="regular" style={styles.rowValue}>
                  ₹ {Number(apiDetail.balanceAfter).toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>

        {apiDetail.booking && (
          <View style={[styles.card, styles.bookingCard]}>
            <Text variant="semi-bold" style={styles.title}>
              Booking
            </Text>

            <View style={styles.bookingRow}>
              <Text variant="regular" style={styles.bookingLabel}>
                Booking ID :
              </Text>
              <Text variant="regular" style={styles.bookingValue}>
                {apiDetail.booking.id}
              </Text>
            </View>

            <View style={styles.bookingRow}>
              <Text variant="regular" style={styles.bookingLabel}>
                Booking Status :
              </Text>
              <Text variant="regular" style={styles.bookingValue}>
                {apiDetail.booking.status}
              </Text>
            </View>

            <View style={styles.bookingRow}>
              <Text variant="regular" style={styles.bookingLabel}>
                Amount :
              </Text>
              <Text variant="regular" style={styles.bookingValue}>
                ₹ {Number(apiDetail.booking.totalAmount).toFixed(2)}
              </Text>
            </View>

            {(apiDetail.booking.pickupName || apiDetail.booking.dropName) && (
              <View style={styles.bookingRow}>
                <Text variant="regular" style={styles.bookingLabel}>
                  Route :
                </Text>
                <Text variant="regular" style={styles.bookingValue}>
                  {apiDetail.booking.pickupName || ''}
                  {!!apiDetail.booking.pickupName && apiDetail.booking.dropName ? ' → ' : ''}
                  {apiDetail.booking.dropName || ''}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default TransactionDetailScreen;
