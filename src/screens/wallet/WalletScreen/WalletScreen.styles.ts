import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainerStyle: {
      flexGrow: 1,
    },

    contentContainer: {
      paddingVertical: 16,
      gap: 16,
    },

    transactionTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    historyHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seeAllContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    seeAllText: {
      fontSize: 14,
      color: colors.button_secondary,
    },
    chevronIcon: {
      width: 12,
      height: 12,
      tintColor: colors.button_secondary,
    },

    transactionContainer: {
      gap: 10,
      paddingBottom: 20,
      paddingHorizontal: 16,
    },

    errorText: {
      color: colors.contentRed,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 8,
    },

    emptyContainer: {
      alignItems: 'center',
      paddingVertical: 24,
    },

    emptyText: {
      fontSize: 14,
      color: colors.contentSecondary,
    },

    footerLoader: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    shimmerList: {
      paddingVertical: 16,
      gap: 10,
    },
  });
