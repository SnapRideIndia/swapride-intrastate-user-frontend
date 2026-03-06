import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TimeSlotCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';

interface TimeSlotCardProps {
  startTime: string;
  endTime: string;
  via: string;
  stopsCount: number;
  onPress?: () => void;
}

const TimeSlotCard = ({ startTime, endTime, via, stopsCount, onPress }: TimeSlotCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.leftContent}>
        <Text variant="bold" style={styles.timeRange}>
          {startTime} - {endTime}
        </Text>
        <Text style={styles.viaLocation}>Via {via}</Text>
      </View>
      <View style={styles.rightContent}>
        <Image source={ImageSource.mapPin} style={styles.locationIcon} />
        <Text variant="medium" style={styles.stopsText}>
          {stopsCount} Stop
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TimeSlotCard;
