import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      backgroundColor: colors.background_primary,
    },
    title: {
      fontSize: 17,
      color: colors.primary,
      marginBottom: 20,
    },
    rows: {
      gap: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      color: colors.contentSecondary,
      textTransform: 'lowercase',
    },
    subLabel: {
      fontSize: 11,
      color: colors.contenttertiary,
    },
    value: {
      fontSize: 14,
      color: colors.primary,
    },
    promoButton: {
      marginTop: 4,
      alignSelf: 'flex-start',
    },
    promoText: {
      fontSize: 14,
      color: colors.primaryLight,
    },
    separator: {
      marginVertical: 20,
      borderStyle: 'dashed',
      borderWidth: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
      backgroundColor: 'transparent',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 17,
      color: colors.primary,
    },
    totalValue: {
      fontSize: 17,
      color: colors.primary,
    },
  });
