import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      width: 100,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderRadius: 16,
    },
    icon: {
      width: 89,
      height: 50,
    },
  });
