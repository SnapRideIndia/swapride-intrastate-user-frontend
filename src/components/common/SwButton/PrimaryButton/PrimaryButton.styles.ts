import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    button: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colors.button_primary,
      gap: 5,
      flexDirection: 'row',
    },
    title: {
      color: colors.contentPrimary,
      fontSize: 16,
    },
  });
