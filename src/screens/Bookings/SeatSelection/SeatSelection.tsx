import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SeatSelection.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import BusLayout from './components/BusLayout/BusLayout';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { useGetTripSeats, useChangeSeat } from '../../../hooks/useBooking';
import SeatSelectionSkeleton from './SeatSelectionSkeleton';

const SeatSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.SEAT_SELECTION>>();
  const { tripId, bookingId, initialSeatNumber } = route.params;

  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSeatNumber || null);

  const { data: seatData, isLoading, error } = useGetTripSeats(tripId);

  const { mutate: changeSeat, isPending: isChanging } = useChangeSeat(
    data => {
      navigation.goBack();
    },
    err => {
      Alert.alert('Failed to change seat', err?.message || 'Something went wrong');
    },
  );

  const handleConfirm = () => {
    if (!selectedSeat) return;
    changeSeat({ bookingId, seatNumber: selectedSeat });
  };

  const seats = seatData?.seats || [];
  const showSkeleton = isLoading;

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Select a seat" />

      {showSkeleton ? (
        <SeatSelectionSkeleton />
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text>Failed to load seat layout.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.content}>
          <BusLayout seats={seats} selectedSeat={selectedSeat} onSelectSeat={seat => setSelectedSeat(seat)} />
        </ScrollView>
      )}

      {!showSkeleton && (
        <>
          <View style={styles.selectionContainer}>
            <Text variant="medium" style={styles.selectionText}>
              {selectedSeat ? `You have selected seat ${selectedSeat}!` : 'Please select a seat'}
            </Text>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={isChanging ? 'Saving...' : 'Confirm Seat'}
              onPress={handleConfirm}
              disabled={!selectedSeat || isChanging || isLoading}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default SeatSelection;
