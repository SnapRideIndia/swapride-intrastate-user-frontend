import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 16,
      borderColor: colors.border_3,
      gap: 6,
    },

    cardTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
    },

    balanceText: {
      fontSize: 24,
      color: colors.background_green,
    },

    buttonStyles: {
      backgroundColor: colors.button_secondary,
      width: '100%',
    },

    buttonTextStyles: {
      color: colors.primaryCtaText,
    },
  });
