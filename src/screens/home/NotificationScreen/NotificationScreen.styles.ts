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
      paddingHorizontal: 16,
      paddingVertical: 20,
      gap: 12,
    },
    cardContainer: {
      padding: 16,
      borderRadius: 14,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_3,
      elevation: 1.5,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    shuttelIcon: {
      width: 26,
      height: 26,
    },
    iconContainer: {
      width: 46,
      height: 46,
      borderRadius: 23,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background_lightBlue,
    },
    title: {
      fontSize: 15,
      color: colors.contentPrimary,
      flex: 1,
    },
    subTitle: {
      fontSize: 13,
      color: colors.contentSecondary,
      textAlign: 'left',
      lineHeight: 18,
    },
    min: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    unreadStyle: {
      backgroundColor: colors.background_lightBlue,
      borderColor: colors.border_8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
