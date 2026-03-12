import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';

type ShimmerBoxProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
};

/** Box-shaped shimmer placeholder (icons, blocks). */
export const ShimmerBox = ({
  width,
  height,
  borderRadius = 8,
  style,
}: ShimmerBoxProps) => {
  return (
    <Shimmer
      style={[{ width: width ?? '100%', height: height ?? 48, borderRadius } as ViewStyle, style]}
    />
  );
};
