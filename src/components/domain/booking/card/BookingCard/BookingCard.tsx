import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './BookingCard.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { ImageSource } from '../../../../../constants/images';
import { ScreenNames } from '../../../../../navigation/constant';
import { useNavigation } from '@react-navigation/native';

export interface BookingCardProps {
  bookingId: string;
  seatNumber: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  fromTime: string;
  toTime: string;
  onTrackRide?: () => void;
  onViewTicket?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  bookingId,
  seatNumber,
  date,
  fromLocation,
  toLocation,
  fromTime,
  toTime,
  onTrackRide,
  onViewTicket,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();

  const handleTrackRide = () => {
    if (onTrackRide) {
      onTrackRide();
    } else {
      navigation.navigate(ScreenNames.TRACK_RIDE_SCREEN, { ticketId: bookingId });
    }
  };

  const handleViewTicket = () => {
    if (onViewTicket) {
      onViewTicket();
    } else {
      navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN, { ticketId: bookingId });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.indicator} />
          <Text variant="medium" style={styles.headerText}>
            Bus Ticket <Text style={styles.bullet}>•</Text> {seatNumber}
          </Text>
        </View>
        <View style={styles.dateBadge}>
          <Text variant="medium" style={styles.dateText}>
            {date}
          </Text>
        </View>
      </View>

      {/* Route Info */}
      <View style={styles.routeContainer}>
        <View style={styles.locationBlock}>
          <Text variant="bold" style={styles.locationName} numberOfLines={2}>
            {fromLocation}
          </Text>
          <Text style={styles.timeText}>{fromTime}</Text>
        </View>

        <View style={styles.centerIconContainer}>
          <Image source={ImageSource.busOnTrack} style={styles.busOnTrack} />
        </View>

        <View style={styles.locationBlock}>
          <Text variant="bold" style={[styles.locationName, { textAlign: 'right' }]} numberOfLines={2}>
            {toLocation}
          </Text>
          <Text style={[styles.timeText, { textAlign: 'right' }]}>{toTime}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewTicketBtn} onPress={handleViewTicket}>
          <Text variant="bold" style={styles.viewTicketBtnText}>
            View ticket
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackRideBtn} onPress={handleTrackRide}>
          <Text variant="bold" style={styles.trackRideBtnText}>
            Track Ride
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingCard;
