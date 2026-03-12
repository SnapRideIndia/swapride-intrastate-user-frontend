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
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.error || '#FF3B30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    icon: {
      width: 40,
      height: 40,
      tintColor: '#FFFFFF',
    },
    title: {
      fontSize: 20,
      marginBottom: 8,
      color: colors.contentPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
    },
    footer: {
      padding: 20,
    },
    primaryBtn: {
      marginBottom: 12,
      borderRadius: 12,
    },
    secondaryBtn: {
      borderRadius: 12,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    secondaryBtnText: {
      color: colors.primary,
    },
  });

