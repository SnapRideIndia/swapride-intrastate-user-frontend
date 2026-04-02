import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    successIcon: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      marginBottom: 32,
    },
    title: {
      fontSize: 20,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    footer: {
      padding: 24,
      gap: 16,
    },
    viewTicketBtn: {
      width: '100%',
      backgroundColor: colors.button_primary,
      borderRadius: 12,
      height: 52,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    viewRideBtn: {
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: 12,
      height: 52,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      elevation: 0,
      shadowOpacity: 0,
    },
    viewRideBtnText: {
      color: colors.primaryLight,
    },
  });
