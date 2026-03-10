import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    title: {
      fontSize: 16,
      color: colors.contentSecondary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 12,
      color: colors.contentSecondary,
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border_3,
      paddingBottom: 8,
      marginBottom: 24,
    },
    inputLabel: {
      flex: 1,
      justifyContent: 'center',
    },
    timeDisplayText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.contentSecondary,
    },
    showBusesBtn: {
      height: 44,
      borderRadius: 8,
      backgroundColor: colors.button_primary,
    },
    showBusesBtnTitle: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
  });
