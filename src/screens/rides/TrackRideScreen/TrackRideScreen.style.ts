import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_gray,
    },

    contentContainer: {
      padding: 26,
      paddingHorizontal: 16,
      gap: 20,
      backgroundColor: colors.background_primary,
    },

    fontColor: {
      color: colors.primary,
    },

    fontTweleve: {
      fontSize: 12,
    },

    fontFourteen: {
      fontSize: 14,
    },

    fontSixteen: {
      fontSize: 16,
    },

    fontEighteen: {
      fontSize: 18,
    },

    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },

    justRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },

    pickupContainer: {
      gap: 6,
    },

    badge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 5,
    },

    imageSize: {
      height: 20,
      width: 20,
    },

    buttonStyle: {
      backgroundColor: colors.background_gray,
    },

    showPassRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    chevronIcon: {
      width: 12,
      height: 12,
      transform: [{ rotate: '180deg' }],
    },
  });
