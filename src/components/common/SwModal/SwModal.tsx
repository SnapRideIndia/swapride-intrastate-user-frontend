import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwPopupModal } from '../SwPopupModal/SwPopupModal';
import { SwText as Text } from '../SwText/SwText';
import PrimaryButton from '../SwButton/PrimaryButton/PrimaryButton';
import { useStyles } from './SwModal.styles';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export interface SwModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subTitle: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  isDestructive?: boolean;
  confirmButtonStyle?: StyleProp<ViewStyle>;
  confirmButtonTextStyle?: StyleProp<TextStyle>;
}

export const SwModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  subTitle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirmLoading = false,
  isDestructive = false,
  confirmButtonStyle,
  confirmButtonTextStyle,
}: SwModalProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <SwPopupModal 
      isVisible={isVisible} 
      onClose={onClose} 
      title={title} 
      variant="compact" 
      centerTitle
    >
      <View style={styles.content}>
        <View style={styles.messageWrap}>
          {typeof subTitle === 'string' ? (
            <Text style={styles.message}>{subTitle}</Text>
          ) : (
            subTitle
          )}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isConfirmLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
          <PrimaryButton
            title={confirmText}
            onPress={onConfirm}
            loading={isConfirmLoading}
            disabled={isConfirmLoading}
            btnStyle={[
               styles.confirmButton, 
               isDestructive && { backgroundColor: colors.contentRed },
               confirmButtonStyle
            ]}
            textStyle={[
              styles.confirmText, 
              isDestructive && { color: colors.primaryCtaText },
              confirmButtonTextStyle
            ]}
          />
        </View>
      </View>
    </SwPopupModal>
  );
};

