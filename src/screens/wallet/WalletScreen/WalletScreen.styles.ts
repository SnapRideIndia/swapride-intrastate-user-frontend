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
    },
  });
