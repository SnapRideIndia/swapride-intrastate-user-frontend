import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';
import { commonColors } from '../../../constants/ui/colors';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    inputOuterContainer: {
      marginBottom: 4,
    },
    iconWithTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 24,
      overflow: 'visible',
    },
    inputInnerContainer: {
      marginTop: 0,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.border_3,
    },
    inputErrorBorder: {
      borderColor: commonColors.error,
    },
    roundedContainer: {
      borderWidth: 1,
      borderColor: colors.border_3,
      borderRadius: 12,
      borderBottomWidth: 1,
      paddingHorizontal: 16,
      marginTop: 0,
    },
    phNoStyle: {
      flexDirection: 'row',
      gap: 5,
    },
    inputStyle: {
      flex: 1,
      minHeight: 40,
      paddingVertical: 4,
    },
    title: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    errorText: {
      marginTop: 4,
      fontSize: 12,
      color: commonColors.error,
    },
  });
