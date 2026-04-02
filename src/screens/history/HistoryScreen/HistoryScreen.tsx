import { FlatList, ActivityIndicator, View, RefreshControl, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
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
import { MyBookingType } from '../../../types/booking.types';
import { ImageSource } from '../../../constants/images';
import { SwTextInput } from '../../../components/common/SwTextInput/SwTextInput';
import { NoResults } from '../../../components/common/NoResults/NoResults';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ScreenNames } from '../../../navigation/constant';

const HistoryScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profileData } = useSelector((store: RootState) => store.profile);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(text), 500);
  };

  const dateFilter = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;

  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyBookings(MyBookingType.HISTORY, 10, dateFilter, debouncedSearch || undefined);

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
        title="No ticket history"
        subtitle="Your past tickets will appear here after your trips."
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
            textStyle={{ fontSize: 13, color: colors.primaryCtaText }}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="History" />
      
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <SwTextInput
            placeholder="Search bookings, routes."
            value={searchQuery}
            onChangeText={handleSearchChange}
            variant="rounded"
            inputContainerStyle={styles.searchInput}
            containerStyle={{ marginBottom: 0 }}
            renderLeftIcon={() => (
              <Image 
                source={ImageSource.searhIcon} 
                style={{ width: 20, height: 20, tintColor: colors.contenttertiary, marginRight: 8 }} 
                resizeMode="contain" 
              />
            )}
          />
        </View>
        <TouchableOpacity 
          onPress={() => setDatePickerOpen(true)}
          style={styles.dateButton}
        >
          <Image 
            source={ImageSource.calenderOutline} 
            style={styles.dateIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>

      {selectedDate && (
        <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row' }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: colors.primaryLight, 
            paddingHorizontal: 12, 
            paddingVertical: 4, 
            borderRadius: 16,
          }}>
            <Text style={{ fontSize: 13, color: colors.background_primary, fontWeight: '500', marginRight: 8 }}>
              {format(selectedDate, 'MMM dd, yyyy')}
            </Text>
            <TouchableOpacity onPress={() => setSelectedDate(undefined)}>
              <Image 
                source={ImageSource.cross} 
                style={{ width: 10, height: 10, tintColor: colors.background_primary }} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <DatePicker
        modal
        mode="date"
        open={datePickerOpen}
        date={selectedDate ?? new Date()}
        maximumDate={new Date()}
        onConfirm={(date) => {
          setDatePickerOpen(false);
          setSelectedDate(date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
          // If the user clicked "Clear" (which is the cancel label when a date exists), clear it.
          if (selectedDate) {
            setSelectedDate(undefined);
          }
        }}
        title="Filter by Date"
        confirmText="Apply"
        cancelText={selectedDate ? 'Clear' : 'Cancel'}
      />

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
