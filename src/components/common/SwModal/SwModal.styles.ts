import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    messageWrap: {
      paddingBottom: 18,
      paddingTop: 8,
      width: '100%',
    },
    message: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
      alignSelf: 'stretch',
    },
    cancelButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border_3,
      backgroundColor: colors.background_primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.contentPrimary,
    },
    confirmButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
    },
    confirmText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primaryCtaText,
    },
  });
