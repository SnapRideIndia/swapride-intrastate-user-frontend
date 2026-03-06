import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
    },
    pickupWrapper: {
      position: 'relative',
    },
    swapButton: {
      position: 'absolute',
      right: -16,
      bottom: -15,
      backgroundColor: colors.background_primary,
      borderRadius: 999,
      elevation: 2,
      zIndex: 10,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    swapIcon: {
      width: 35,
      height: 35,
    },
  });
