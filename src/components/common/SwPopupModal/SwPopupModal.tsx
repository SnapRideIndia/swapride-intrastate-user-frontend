import React, { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwText as Text } from '../SwText/SwText';
import { useStyles } from './SwPopupModal.styles';
import type { SwPopupModalVariant } from './SwPopupModal.styles';

export interface SwPopupModalProps {
  /** Whether the modal is visible */
  isVisible: boolean;
  /** Called when the modal should close (backdrop or close button) */
  onClose: () => void;
  /** Modal content. Pass JSX to render inside the card. */
  children: React.ReactNode;
  /** Optional title shown in the header. If omitted, no header row is rendered. */
  title?: string;
  /** Visual/layout variant for future use. Default: 'default'. */
  variant?: SwPopupModalVariant;
  /** When true, title and header content are centered. Default: false. */
  centerTitle?: boolean;
}

/**
 * Reusable popup modal with optional title, close button, and content passed as children.
 * Content height is driven by children. Use variant for different layouts (e.g. compact, centered).
 */
export const SwPopupModal = ({ isVisible, onClose, children, title, variant = 'default', centerTitle = false }: SwPopupModalProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors, variant, centerTitle);
  const [shouldRender, setShouldRender] = useState(isVisible);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
      scale.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
    } else {
      opacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.cubic) });
      scale.value = withTiming(0.92, { duration: 180, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(setShouldRender)(false);
      });
    }
  }, [isVisible, opacity, scale]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!shouldRender) return null;

  return (
    <Modal visible={isVisible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay} pointerEvents={isVisible ? 'auto' : 'none'}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.card, cardStyle]}>
          {title != null && title !== '' && (
            <View style={[styles.header, centerTitle && styles.headerCentered]}>
              <Text variant="semi-bold" style={[styles.headerTitle, centerTitle && styles.headerTitleCentered]}>
                {title}
              </Text>
            </View>
          )}
          <View style={[styles.content, title != null && title !== '' && { paddingTop: 0 }]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};
