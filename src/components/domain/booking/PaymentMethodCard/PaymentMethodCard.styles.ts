import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background_primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    selectedContainer: {
      borderColor: colors.primaryLight,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    icon: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 4,
    },
    title: {
      fontSize: 16,
      color: colors.contentSecondary,
    },
    subtitle: {
      fontSize: 12,
      color: colors.contentSecondary,
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: colors.contentRed,
      marginTop: 2,
    },
    rightContent: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.contentSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      borderColor: colors.primaryLight,
    },
    radioButtonInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primaryLight,
    },
  });
