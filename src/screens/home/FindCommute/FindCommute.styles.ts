import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 11,
      paddingVertical: 20,
    },
    title: {
      fontSize: 16,
      lineHeight: 20,
      color: colors.primary,
    },
    titleIcon: {
      width: 14,
      height: 14,
    },
    timeInputContainer: {
      gap: 8,
    },
    timeInputsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      paddingLeft: 24,
    },
    timeInput: {
      width: 73,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderColor: colors.border_4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clock: {
      width: 14,
      height: 14,
    },
    inputTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    btnContainer: {
      marginTop: 10,
    },
    btnStyle: {
      height: 36,
    },
    textStyle: {
      fontSize: 16,
    },
  });
