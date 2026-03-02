import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingVertical: 30,
      gap: 25,
    },
    eyeOff: {
      width: 24,
      height: 24,
    },
    forgotPassword: {
      textAlign: 'right',
      marginTop: 15,
      textDecorationLine: 'underline',
      color: colors.contentRed,
    },
    spacer: {
      flex: 1,
    },
    loginPhno: {
      fontSize: 14,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    buttonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
  });
