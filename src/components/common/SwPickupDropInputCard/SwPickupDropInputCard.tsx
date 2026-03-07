import React, { useCallback } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { ImageSource } from '../../../constants/images';
import { SwTextInput } from '../SwTextInput/SwTextInput';
import { useStyles } from './SwPickupDropInputCard.styles';

type SwTextInputProps = React.ComponentProps<typeof SwTextInput>;

export type SwPickupDropInputCardSwapPayload = {
  pickup: string;
  drop: string;
};

type Props = {
  pickupInputProps: SwTextInputProps;
  dropInputProps: SwTextInputProps;
  onPressPickup?: () => void;
  onPressDrop?: () => void;
  showSwapArrow?: boolean;
  swapIconSource?: ImageSourcePropType;
  onSwap?: (payload: SwPickupDropInputCardSwapPayload) => void;
  containerStyle?: StyleProp<ViewStyle>;
  swapButtonAccessibilityLabel?: string;
};

export const SwPickupDropInputCard = ({
  pickupInputProps,
  dropInputProps,
  onPressPickup,
  onPressDrop,
  showSwapArrow = true,
  swapIconSource = ImageSource.updownArrow,
  onSwap,
  containerStyle,
  swapButtonAccessibilityLabel = 'Swap pickup and drop locations',
}: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const pickupValue = typeof pickupInputProps.value === 'string' ? pickupInputProps.value : '';
  const dropValue = typeof dropInputProps.value === 'string' ? dropInputProps.value : '';

  const handleSwap = useCallback(() => {
    const next = { pickup: dropValue, drop: pickupValue };
    pickupInputProps.onChangeText?.(next.pickup);
    dropInputProps.onChangeText?.(next.drop);
    onSwap?.(next);
  }, [dropInputProps, dropValue, onSwap, pickupInputProps, pickupValue]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.connectorLine}>
        {[...Array(11)].map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>

      <View style={styles.pickupWrapper}>
        <View style={styles.pickupDot} />
        {onPressPickup ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onPressPickup}>
            <View pointerEvents="none">
              <SwTextInput {...pickupInputProps} editable={false} />
            </View>
          </TouchableOpacity>
        ) : (
          <SwTextInput {...pickupInputProps} />
        )}
        {showSwapArrow && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={swapButtonAccessibilityLabel}
            onPress={handleSwap}
            activeOpacity={0.85}
            style={styles.swapButton}
            hitSlop={10}
          >
            <Image source={swapIconSource} style={styles.swapIcon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dropWrapper}>
        <View style={styles.dropoffDot} />
        {onPressDrop ? (
          <TouchableOpacity activeOpacity={0.9} onPress={onPressDrop}>
            <View pointerEvents="none">
              <SwTextInput {...dropInputProps} editable={false} />
            </View>
          </TouchableOpacity>
        ) : (
          <SwTextInput {...dropInputProps} />
        )}
      </View>
    </View>
  );
};
