import React from 'react';
import { View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './PaymentMethodCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';

export interface PaymentMethodCardProps {
  icon: ImageSourcePropType;
  title: string;
  subtitle?: string;
  errorText?: string;
  isSelected?: boolean;
  onPress?: () => void;
  tintIconWithPrimary?: boolean;
  rightAction?: React.ReactNode;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  icon,
  title,
  subtitle,
  errorText,
  isSelected,
  onPress,
  tintIconWithPrimary,
  rightAction,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selectedContainer]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Image
            source={icon}
            style={[styles.icon, tintIconWithPrimary && { tintColor: colors.primaryLight }]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text variant="semi-bold" style={styles.title}>
            {title}
          </Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
        </View>
      </View>
      <View style={styles.rightContent}>
        {rightAction || (
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PaymentMethodCard;
