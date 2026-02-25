import React from 'react';
import { View, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './Seperator.styles';

interface SeparatorProps {
  /**
   * Orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Height of the separator.
   * For horizontal: thickness. For vertical: length.
   */
  height?: DimensionValue;
  /**
   * Width of the separator.
   * For horizontal: length. For vertical: thickness.
   */
  width?: DimensionValue;
  /**
   * Background color of the separator.
   */
  color?: string;
  /**
   * Additional styles for the separator.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable separator component with customizable dimensions, orientation, and color.
 * Default orientation is horizontal with 1px thickness and full width.
 */
export const Seperator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  height,
  width,
  color,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const isHorizontal = orientation === 'horizontal';

  // Default values based on orientation
  const defaultHeight = isHorizontal ? 1 : '100%';
  const defaultWidth = isHorizontal ? '100%' : 1;

  const appliedStyles: ViewStyle = {
    height: height ?? defaultHeight,
    width: width ?? defaultWidth,
    backgroundColor: color ?? colors.border_3,
  };

  return <View style={[styles.container, appliedStyles, style]} />;
};
