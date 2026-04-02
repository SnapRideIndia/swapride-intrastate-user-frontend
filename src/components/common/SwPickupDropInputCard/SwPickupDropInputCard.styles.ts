import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      gap: 8,
      paddingLeft: 24,
    },
    pickupWrapper: {
      position: 'relative',
      zIndex: 2,
    },
    dropWrapper: {
      position: 'relative',
      zIndex: 2,
    },
    pickupDot: {
      position: 'absolute',
      left: -18,
      top: 4,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.secondary,
      zIndex: 10,
    },
    dropoffDot: {
      position: 'absolute',
      left: -18,
      top: 4,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      zIndex: 10,
    },
    connectorLine: {
      position: 'absolute',
      left: 11,
      top: 18,
      height: 85,
      width: 1,
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1,
      overflow: 'hidden',
    },
    dash: {
      width: 1,
      height: 3,
      backgroundColor: colors.contenttertiary,
      marginBottom: 3,
    },
    swapButton: {
      position: 'absolute',
      right: -5,
      bottom: -15,
      backgroundColor: colors.background_primary,
      borderRadius: 999,
      elevation: 2,
      zIndex: 10,
      shadowColor: colors.contentPrimary,
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    swapIcon: {
      width: 35,
      height: 35,
    },
  });
