import React, { useEffect, useState } from 'react';
import { Image, Pressable, TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SwTopModal.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwText as Text } from '../SwText/SwText';
import { ImageSource } from '../../../constants/images';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const SwTopModal = ({ isVisible, onClose, children, title }: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();

  const [shouldRender, setShouldRender] = useState(isVisible);

  const translateY = useSharedValue(-600);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) });
    } else {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
      translateY.value = withTiming(-600, { duration: 350, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(setShouldRender)(false);
      });
    }
  }, [isVisible, opacity, translateY]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!shouldRender) return null;

  return (
    <View style={styles.modalContainer} pointerEvents={isVisible ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.contentWrapper, { paddingTop: insets.top }, animatedContentStyle]}>
        {title && (
          <View style={styles.header}>
            <Text variant="semi-bold" style={styles.headerTitle}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeButton}>
              <Image source={ImageSource.cross} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        )}
        {children}
      </Animated.View>
    </View>
  );
};
