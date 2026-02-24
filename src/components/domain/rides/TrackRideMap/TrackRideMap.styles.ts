import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      height: 250,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      backgroundColor: colors.background_primary,
      borderColor: colors.border_3,
    },
  });
