import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TicketCard.styles';
import { ImageSource } from '../../../../constants/images';
import QRCode from 'react-native-qrcode-svg';

export interface TicketCardProps {
  from: string;
  to: string;
  busPlate: string;
  seatNumbers: string[];
  date: string;
  qrToken?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({ from, to, busPlate, seatNumbers, date, qrToken }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.cardContainer}>
      {/* QR Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrBackground}>
          {qrToken ? (
            <QRCode value={qrToken} size={180} color="#000000" backgroundColor="white" />
          ) : (
            <Image source={ImageSource.qrCodePlaceholder} style={styles.qrImage} resizeMode="contain" />
          )}
        </View>
      </View>

      {/* Dashed Separator */}
      <View style={styles.dashedLine} />

      {/* Route Info */}
      <View style={styles.routeSection}>
        <Text variant="bold" style={[styles.locationText, { textAlign: 'center' }]}>
          {from}
        </Text>
        <Image source={ImageSource.swapPoints} style={styles.swapIcon} resizeMode="contain" />
        <Text variant="bold" style={[styles.locationText, { textAlign: 'center' }]}>
          {to}
        </Text>
      </View>

      {/* Time Strip */}
      <View style={styles.timeStrip}>
        <Text variant="medium" style={styles.timeText}>
          Date: {date}
        </Text>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text variant="bold" style={styles.detailText}>
            BusNo: {busPlate}
          </Text>
        </View>
        <View style={styles.detailBox}>
          <Text variant="bold" style={styles.detailText}>
            Seat No: {seatNumbers?.join(', ') || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};
