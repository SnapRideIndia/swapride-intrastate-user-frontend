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
      padding: 26,
      paddingHorizontal: 16,
      gap: 16,
    },
  });
