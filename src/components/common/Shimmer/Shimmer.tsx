import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeProvider';

const SHIMMER_WIDTH = 100;
const SHIMMER_DURATION = 1200;

type ShimmerProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Base shimmer: animated sweep overlay. Use as wrapper or full-area. */
export const Shimmer = ({ style, children }: ShimmerProps) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(-SHIMMER_WIDTH);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(SHIMMER_WIDTH + 320, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [translateX]);

  const animatedSweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const baseColor = colors.border_3 || '#E8E8E8';
  const highlightColor = 'rgba(255, 255, 255, 0.5)';

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: baseColor }]} />
      <Animated.View style={[styles.sweep, { backgroundColor: highlightColor }, animatedSweepStyle]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
  },
});
