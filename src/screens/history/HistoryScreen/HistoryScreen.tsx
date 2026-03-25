import { FlatList, ActivityIndicator, View, RefreshControl, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './HistoryScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useMyBookings } from '../../../hooks/useBooking';
import BookingCard from '../../../components/domain/booking/card/BookingCard/BookingCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { format } from 'date-fns';
import { MyBookingType } from '../../../types/booking.types';
import { ImageSource } from '../../../constants/images';
import { ScreenNames } from '../../../navigation/constant';
import { NoResults } from '../../../components/common/NoResults/NoResults';

const HistoryScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyBookings(MyBookingType.HISTORY);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (bookings) {
      console.log('My Bookings Response ===>', bookings);
    }
    if (isError) {
      console.error('My Bookings History Error ===>', error);
    }
  }, [bookings, isError, error]);

  if (isError) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="History" onBackBtnPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text variant="semi-bold" style={{ textAlign: 'center', color: colors.contentPrimary, marginBottom: 8 }}>
            Unable to load your history
          </Text>
          <Text style={{ textAlign: 'center', color: colors.contenttertiary, marginBottom: 24 }}>
            Something went wrong while fetching your past rides. Please try again.
          </Text>
          <PrimaryButton 
            title="Retry" 
            onPress={() => refetch()}
            btnStyle={{ width: '100%', maxWidth: 200 }}
          />
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
      <NoResults
        image={ImageSource.noTicketsFound}
        title="No History Yet"
        subtitle="Your completed trips and cancellations will appear here once you start riding with us."
      />
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="History" />
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

export default HistoryScreen;
