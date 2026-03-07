import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    title: {
      fontSize: 16,
      color: colors.contentSecondary,
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 6,
    },
    clockIcon: {
      width: 14,
      height: 14,
      tintColor: colors.primary,
    },
    infoText: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      fontSize: 22,
      color: colors.contentGreen,
    },
    proceedBtn: {
      paddingHorizontal: 32,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.button_primary,
    },
    proceedBtnTitle: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
  });
