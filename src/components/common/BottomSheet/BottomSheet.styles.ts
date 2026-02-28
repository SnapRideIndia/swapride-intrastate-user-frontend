import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.background_primary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: colors.border_3,
      width: 40,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    closeButton: {
      padding: 4,
    },
    closeIcon: {
      width: 16,
      height: 16,
      tintColor: colors.contentPrimary,
    },
    content: {
      paddingHorizontal: 16,
    },
  });
