import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TicketCard.styles';
import { ImageSource } from '../../../../constants/images';

export interface TicketCardProps {
  from: string;
  to: string;
  timeRange: string;
  busPlate: string;
  date: string;
  isActivated: boolean;
  onActivate?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  from,
  to,
  timeRange,
  busPlate,
  date,
  isActivated,
  onActivate,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.cardContainer}>
      {/* QR Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrBackground}>
          <Image
            source={ImageSource.qrCodePlaceholder}
            style={styles.qrImage}
            resizeMode="contain"
          />

          {!isActivated && (
            <TouchableOpacity
              style={styles.qrOverlay}
              activeOpacity={0.9}
              onPress={onActivate}
            >
              <View style={styles.activateStrip}>
                <Text varient="semi-bold" style={styles.activateText}>
                  Click to Activate the QR
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dashed Separator */}
      <View style={styles.dashedLine} />

      {/* Route Info */}
      <View style={styles.routeSection}>
        <Text
          varient="bold"
          style={[styles.locationText, { textAlign: 'left' }]}
        >
          {from}
        </Text>
        <Image
          source={ImageSource.swapPoints}
          style={styles.swapIcon}
          resizeMode="contain"
        />
        <Text
          varient="bold"
          style={[styles.locationText, { textAlign: 'right' }]}
        >
          {to}
        </Text>
      </View>

      {/* Time Strip */}
      <View style={styles.timeStrip}>
        <Text varient="bold" style={styles.timeText}>
          {timeRange}
        </Text>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text varient="bold" style={styles.detailText}>
            {busPlate}
          </Text>
        </View>
        <View style={[styles.detailBox, styles.dateBox]}>
          <Text varient="medium" style={styles.detailText}>
            Date: <Text varient="bold">{date}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
