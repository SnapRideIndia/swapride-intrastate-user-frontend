import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TripSummaryCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { Seperator } from '../../../common/Seperator/Seperator';

interface PointData {
  time: string;
  title: string;
  description: string;
  walkText: string;
  travelType?: 'WALK' | 'DRIVE' | null;
}

export interface TripSummaryCardProps {
  type: 'outbound' | 'return';
  date: string;
  pickup: PointData;
  dropoff: PointData;
  seat: string;
  onChangeSeat?: () => void;
}

const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ type, date, pickup, dropoff, seat, onChangeSeat }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const isOutbound = type === 'outbound';

  return (
    <View style={styles.container}>
      {/* Card Header */}
      <View style={[styles.header, isOutbound ? styles.outboundHeader : styles.returnHeader]}>
        <View style={styles.headerLeft}>
          <Image source={isOutbound ? ImageSource.sun : ImageSource.weather} style={styles.headerIcon} />
          <Text variant="semi-bold" style={styles.headerText}>
            {date}
          </Text>
        </View>
        {!isOutbound && (
          <View style={styles.returnBadge}>
            <Text variant="bold" style={styles.returnBadgeText}>
              Return
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.pointsContainer}>
          {/* Pickup Point */}
          <View style={styles.pointRow}>
            <View style={styles.indicatorContainer}>
              <View style={styles.timeBadge}>
                <Text variant="bold" style={styles.timeText}>
                  {pickup.time}
                </Text>
              </View>
              <View style={styles.verticalConnector} />
            </View>
            <View style={[styles.pointInfo, styles.pickupInfo]}>
              <Text variant="bold" style={styles.pointTitle}>
                {pickup.title}
              </Text>
              <Text style={styles.pointDescription}>{pickup.description}</Text>
              <View style={styles.walkContainer}>
                <Image
                  source={pickup.travelType === 'DRIVE' ? ImageSource.car : ImageSource.walkIcon}
                  style={styles.walkIcon}
                  resizeMode="contain"
                />
                <Text variant="semi-bold" style={styles.walkText}>
                  {pickup.walkText}
                </Text>
              </View>
            </View>
          </View>

          {/* Dropoff Point */}
          <View style={[styles.pointRow, styles.dropoffRow]}>
            <View style={styles.indicatorContainer}>
              <View style={styles.timeBadge}>
                <Text variant="bold" style={styles.timeText}>
                  {dropoff.time}
                </Text>
              </View>
            </View>
            <View style={styles.pointInfo}>
              <Text variant="bold" style={styles.pointTitle}>
                {dropoff.title}
              </Text>
              <Text style={styles.pointDescription}>{dropoff.description}</Text>
              <View style={styles.walkContainer}>
                <Image
                  source={dropoff.travelType === 'DRIVE' ? ImageSource.car : ImageSource.walkIcon}
                  style={styles.walkIcon}
                  resizeMode="contain"
                />
                <Text variant="semi-bold" style={styles.walkText}>
                  {dropoff.walkText}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Seperator style={styles.cardSeparator} color="transparent" />

      {/* Seat Info */}
      <View style={styles.footer}>
        <View style={styles.seatInfo}>
          <View style={styles.seatIconContainer}>
            <Image source={ImageSource.SeatYellow} style={styles.seatIcon} />
          </View>
          <View style={styles.seatTextContainer}>
            <Text variant="bold" style={styles.seatNumber}>
              {seat}
            </Text>
            <Text style={styles.autoAssigned}>Auto assigned</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onChangeSeat}>
          <Text variant="bold" style={styles.changeSeatText}>
            Change Seat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripSummaryCard;
