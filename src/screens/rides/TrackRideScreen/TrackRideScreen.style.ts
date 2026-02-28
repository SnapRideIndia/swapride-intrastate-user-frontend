import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },

    scrollContainer: {
      flexGrow: 1,
    },

    contentContainer: {
      padding: 26,
      paddingHorizontal: 16,
      gap: 20,
      backgroundColor: colors.background_primary,
    },

    fontColor: {
      color: colors.primary,
    },

    fontTweleve: {
      fontSize: 12,
    },

    fontFourteen: {
      fontSize: 14,
    },

    fontSixteen: {
      fontSize: 16,
    },

    fontEighteen: {
      fontSize: 18,
    },

    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },

    justRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },

    pickupContainer: {
      gap: 6,
    },

    badge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 5,
    },

    imageSize: {
      height: 20,
      width: 20,
    },

    buttonStyle: {
      backgroundColor: colors.background_gray,
    },
    chatIcon: {
      width: 18,
      height: 18,
      marginRight: 8,
    },

    showPassRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    chevronIcon: {
      width: 14,
      height: 14,
    },

    helpCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      marginTop: 20,
    },
    helpIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background_gray,
      alignItems: 'center',
      justifyContent: 'center',
    },
    helpIcon: {
      width: 20,
      height: 20,
      tintColor: colors.contentSecondary,
    },
    helpTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    helpTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    helpSubtext: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
  });
