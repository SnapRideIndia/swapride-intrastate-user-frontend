import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    inputContainer: {
      gap: 25,
      paddingHorizontal: 24,
      paddingVertical: 30
    },
    checkbox: {
      width: 18,
      height: 20,
      marginTop: 5,
    },
    checkBoxAndConditionContainer: {
      flexDirection: 'row',
      gap: 10,
      width: 284,
    },
    spacer: {
      flex: 1,
    },
    linkText: {
      fontSize: 14,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
  });
