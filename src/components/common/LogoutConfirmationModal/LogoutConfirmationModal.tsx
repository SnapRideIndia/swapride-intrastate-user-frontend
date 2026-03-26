import React, { useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwPopupModal } from '../SwPopupModal';
import { SwText as Text } from '../SwText/SwText';
import PrimaryButton from '../SwButton/PrimaryButton/PrimaryButton';
import { useStyles } from './LogoutConfirmationModal.styles';

type LogoutConfirmationModalProps = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

const LogoutConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title = 'Confirm logout',
  description = 'Are you sure you want to log out from this account?',
  confirmText = 'Logout',
  cancelText = 'Cancel',
}: LogoutConfirmationModalProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  useEffect(() => {
    if (isVisible) {
      Keyboard.dismiss();
    }
  }, [isVisible]);

  const handleCancel = () => {
    Keyboard.dismiss();
    onCancel();
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    onConfirm();
  };

  return (
    <SwPopupModal isVisible={isVisible} onClose={handleCancel} title={title} variant="compact">
      <Text variant="medium" style={styles.description}>
        {description}
      </Text>
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={cancelText}
            onPress={handleCancel}
            btnStyle={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={confirmText}
            onPress={handleConfirm}
            btnStyle={styles.confirmButton}
            textStyle={styles.confirmButtonText}
          />
        </View>
      </View>
    </SwPopupModal>
  );
};

export default LogoutConfirmationModal;
