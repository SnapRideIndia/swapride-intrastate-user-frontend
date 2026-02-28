import React, { useCallback, useMemo, forwardRef } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BottomSheet.styles';
import { SwText as Text } from '../SwText/SwText';
import { ImageSource } from '../../../constants/images';
import { Seperator } from '../Seperator/Seperator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SwBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  index?: number;
}

export const SwBottomSheet = forwardRef<BottomSheetModal, SwBottomSheetProps>(
  ({ title, children, snapPoints, onClose, index = -1 }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const insets = useSafeAreaInsets();

    const resolvedSnapPoints = useMemo(
      () => snapPoints || ['25%', '50%'],
      [snapPoints],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const handleClose = useCallback(() => {
      if (onClose) {
        onClose();
      }
      // @ts-ignore
      ref?.current?.dismiss();
    }, [onClose, ref]);

    return (
      <BottomSheetModal
        ref={ref}
        index={index === -1 ? 0 : index} // If we present it, we want it to show at least at the first point
        snapPoints={resolvedSnapPoints}
        enablePanDownToClose
        enableDynamicSizing={!snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
        onDismiss={onClose}
      >
        <BottomSheetView style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          {title && (
            <>
              <View style={styles.header}>
                <Text varient="bold" style={styles.title}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Image source={ImageSource.cross} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              <Seperator height={1} />
            </>
          )}
          <View style={styles.content}>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
