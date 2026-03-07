import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_lightBlue,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      marginVertical: 10,
      gap: 16,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    },
    icon: {
      width: 18,
      height: 18,
      tintColor: colors.primary,
      marginTop: 2,
    },
    currencyIconContainer: {
      width: 18,
      height: 18,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    currencyIcon: {
      fontSize: 10,
      color: colors.primary,
    },
    text: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      color: colors.primary,
    },
  });
