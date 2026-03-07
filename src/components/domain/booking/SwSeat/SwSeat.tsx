import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './SwSeat.styles';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';

export type SeatStatus = 'available' | 'selected' | 'booked' | 'driver';

interface SwSeatProps {
  status: SeatStatus;
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const SwSeat: React.FC<SwSeatProps> = ({ status, label, onPress, disabled }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const isSelected = status === 'selected';
  const isBooked = status === 'booked';
  const isDriver = status === 'driver';

  if (isDriver) {
    return (
      <View style={styles.driverContainer}>
        <Image source={ImageSource.steering} style={styles.driverIcon} />
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} disabled={disabled || isBooked} onPress={onPress} style={styles.container}>
      <View style={styles.seatTopRow}>
        <View style={[styles.armrest, isSelected && styles.selectedBorder, isBooked && styles.bookedBorder]} />
        <View style={[styles.seatBody, isSelected && styles.selectedBody, isBooked && styles.bookedBody]}>
          {isSelected && label && (
            <Text variant="bold" style={styles.label}>
              {label}
            </Text>
          )}
        </View>
        <View style={[styles.armrest, isSelected && styles.selectedBorder, isBooked && styles.bookedBorder]} />
      </View>
      <View style={[styles.seatBase, isSelected && styles.selectedBorder, isBooked && styles.bookedBorder]} />
    </TouchableOpacity>
  );
};

export default SwSeat;
