import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './HistoryCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { ScreenNames } from '../../../../../navigation/constant';
import { useNavigation } from '@react-navigation/native';

interface IHistoryCardProps {
  seatNumber: string;
  date: string;
  amount: string;
  fromLocation: string;
  toLocation: string;
  fromTime: string;
  toTime: string;
  ticketId: string;
}

const LOCATION_MAX_LENGTH = 25;

const truncateLocation = (text: string) =>
  text.length > LOCATION_MAX_LENGTH
    ? `${text.slice(0, LOCATION_MAX_LENGTH)}...`
    : text;

const HistoryCard = ({
  seatNumber,
  date,
  amount,
  fromLocation,
  toLocation,
  fromTime,
  toTime,
  ticketId,
}: IHistoryCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const handleViewDetails = () => {
    (navigation as any).navigate(ScreenNames.TRACK_RIDE_SCREEN, { ticketId });
  };

  return (
    <View style={styles.container}>
      {/* Upper Container */}
      <View style={styles.flexRow}>
        <View style={styles.flexRow}>
          <View style={styles.indicator}></View>
          <Text varient="medium" style={styles.fontFourteen}>
            Bus Ticket
          </Text>
          <Text
            varient="semi-bold"
            style={[styles.fontTwelve, styles.seatText]}
          >
            {seatNumber}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text varient="medium" style={[styles.fontTwelve, styles.dateText]}>
            {date}
          </Text>
        </View>
      </View>

      {/* Middle Container */}
      <View style={styles.middleRow}>
        <View style={styles.flexColumn}>
          <Text
            varient="bold"
            style={[styles.fontSixteen, styles.locationText]}
          >
            {truncateLocation(fromLocation)}
          </Text>
          <Text varient="medium" style={[styles.fontTwelve, styles.timeText]}>
            {fromTime}
          </Text>
        </View>
        <View style={styles.centerIconContainer}>
          <Image source={ImageSource.busOnTrack} style={styles.busOnTrack} />
        </View>
        <View style={styles.flexColumn}>
          <Text
            varient="bold"
            style={[styles.fontSixteen, styles.locationText]}
          >
            {truncateLocation(toLocation)}
          </Text>
          <Text varient="medium" style={[styles.fontTwelve, styles.timeText]}>
            {toTime}
          </Text>
        </View>
      </View>

      {/* Lower Container */}
      <View style={styles.flexRow}>
        <Text varient="bold" style={[styles.fontSixteen, styles.amountText]}>
          ₹ {amount}
        </Text>
        <TouchableOpacity
          onPress={handleViewDetails}
          style={styles.viewDetailsButton}
        >
          <Text varient="medium" style={styles.fontFourteen}>
            View Ride
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({});
