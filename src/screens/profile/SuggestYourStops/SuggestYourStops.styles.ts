import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainerStyle: {
      paddingVertical: 30,
      paddingHorizontal: 11,
      backgroundColor: colors.background_primary,
    },
    keyboardAwareScrollContainer: {
      flexGrow: 1,
      paddingVertical: 30,
      paddingHorizontal: 11,
      backgroundColor: colors.background_primary,
    },
    checkCircle: {
      width: 18,
      height: 18,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    clockIcon: {
      width: 13,
      height: 13,
    },
    checkSquare: {
      width: 18,
      height: 18,
      marginTop: 5,
    },
  });
