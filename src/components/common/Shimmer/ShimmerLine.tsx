import React from 'react';
import { type ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';

type ShimmerLineProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

/** Line-shaped shimmer (e.g. text placeholder). */
export const ShimmerLine = ({
  width = '100%',
  height = 12,
  borderRadius = 4,
  style,
}: ShimmerLineProps) => {
  return (
    <Shimmer
      style={[{ width, height, borderRadius } as ViewStyle, style]}
    />
  );
};