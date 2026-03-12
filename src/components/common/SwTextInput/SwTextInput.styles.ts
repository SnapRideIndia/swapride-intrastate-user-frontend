import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';
import { getFontFamilyByFW } from '../SwText/SwText';
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
    },
    inputInnerContainer: {
      marginTop: 0,
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
      height: 40,
    },
    title: {
      fontSize: 14,
      color: colors.primary,
    },
    errorText: {
      marginTop: 4,
      fontSize: 12,
      color: commonColors.error,
    },
  });
