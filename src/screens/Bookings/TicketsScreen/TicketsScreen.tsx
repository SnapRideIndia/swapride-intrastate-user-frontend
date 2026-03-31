import { FlatList, ActivityIndicator, View, RefreshControl, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TicketsScreen.styles';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const TicketsScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profileData } = useSelector((store: RootState) => store.profile);

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
    if (isError) {
      console.error('My Tickets Error ===>', error);
    }
  }, [bookings, isError, error]);

  const handleExploreTrips = () => {
    if (profileData?.isOnboarded) {
      navigation.navigate(ScreenNames.FIND_COMMUTE as never);
    } else {
      navigation.navigate(ScreenNames.SET_COMMUTE as never);
    }
  };

  if (isError) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="My Tickets" onBackBtnPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text variant="semi-bold" style={{ textAlign: 'center', color: colors.contentPrimary, marginBottom: 8 }}>
            Unable to load your tickets
          </Text>
          <Text style={{ textAlign: 'center', color: colors.contenttertiary, marginBottom: 24 }}>
            Something went wrong while fetching your bookings. Please try again.
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
        title="No active tickets"
        subtitle="Your booked tickets will appear here."
        action={
          <PrimaryButton 
            title="Book Your shuttle" 
            onPress={handleExploreTrips}
            btnStyle={{ 
              height: 36, 
              paddingVertical: 0, 
              paddingHorizontal: 20, 
              backgroundColor: colors.primaryLight,
              width: 'auto',
              maxWidth: 160 
            }}
            textStyle={{ fontSize: 13, color: '#FFFFFF' }}
          />
        }
      />
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
