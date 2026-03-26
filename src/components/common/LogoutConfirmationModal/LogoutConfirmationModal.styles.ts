import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    description: {
      color: colors.contentSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 18,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
    },
    buttonWrapper: {
      flex: 1,
    },
    cancelButton: {
      backgroundColor: colors.contentDisabled,
    },
    cancelButtonText: {
      color: colors.contentPrimary,
    },
    confirmButton: {
      backgroundColor: colors.contentRed,
    },
    confirmButtonText: {
      color: '#FFFFFF',
    },
  });
