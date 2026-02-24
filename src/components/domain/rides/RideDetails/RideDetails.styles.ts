import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
    },

    contentWrapper: {
      paddingVertical: 26,
      paddingHorizontal: 16,
    },

    primaryFont: {
      color: colors.primary,
    },

    title: {
      fontSize: 18,
    },

    shareContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    shareText: {
      fontSize: 16,
    },


    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    }
  });
