import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './AppliedCoupon.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';

export interface AppliedCouponProps {
  code: string;
  savings: number;
  onRemove?: () => void;
}

const AppliedCoupon: React.FC<AppliedCouponProps> = ({ code, savings, onRemove }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Image source={ImageSource.offer} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text variant="bold" style={styles.title}>
            You saved ₹{savings.toFixed(2)}
          </Text>
          <Text style={styles.subtitle}>With {code}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.crossIconContainer}>
        <Image source={ImageSource.cross} style={styles.crossIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default AppliedCoupon;
