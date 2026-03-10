import { FlatList, ActivityIndicator, View, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TicketsScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useMyBookings } from '../../../hooks/useBooking';
import BookingCard from '../../../components/domain/booking/card/BookingCard/BookingCard';
import { format } from 'date-fns';
import { MyBookingType } from '../../../types/booking.types';

const TicketsScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyBookings(MyBookingType.UPCOMING);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (bookings) {
      console.log('My Tickets Response ===>', bookings);
    }
  }, [bookings]);

  if (isError) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="My Tickets" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Text variant="semi-bold" style={{ textAlign: 'center', color: colors.contentSecondary }}>
            {(error as any)?.message || 'Failed to load tickets'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const allBookings = bookings?.pages?.flatMap(page => page.data) || [];

  const renderItem = ({ item }: { item: any }) => (
    <BookingCard
      bookingId={item.id}
      seatNumber={item.seatNumbers && item.seatNumbers.length > 0 ? item.seatNumbers.join(', ') : `x${item.seatCount}`}
      date={format(new Date(item.trip?.departureTime || item.createdAt), 'dd.MM.yyyy')}
      fromLocation={item.pickup}
      toLocation={item.dropoff}
      fromTime={item.trip?.departureTime ? format(new Date(item.trip.departureTime), 'hh:mm a') : '--:--'}
      toTime={item.trip?.arrivalTime ? format(new Date(item.trip.arrivalTime), 'hh:mm a') : '--:--'}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <Text variant="medium" style={{ color: colors.contenttertiary }}>
          No tickets found
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="My Tickets" />
      <FlatList
        data={allBookings}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

export default TicketsScreen;
