import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    closeIcon: {
      width: 14,
      height: 14,
      tintColor: colors.contentPrimary,
    },
  });

