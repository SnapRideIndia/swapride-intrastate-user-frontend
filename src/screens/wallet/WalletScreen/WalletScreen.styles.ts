import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_lightBlue,
    },
    contentContainerStyle: {
      flexGrow: 1,
    },

    contentContainer: {
      padding: 26,
      paddingHorizontal: 16,
      gap: 16,
    },

    transactionTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
      textAlign: 'center',
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
  });
