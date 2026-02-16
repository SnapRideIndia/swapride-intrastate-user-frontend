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
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    icon: {
      width: 89,
      height: 50,
    },
    title: {
      fontSize: 12,
      color: colors.contentSecondary
    }

  });
