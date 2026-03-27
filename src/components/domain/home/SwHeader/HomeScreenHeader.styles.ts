import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      backgroundColor: colors.primaryLight,
      borderBottomWidth: 1,
      borderBottomColor: colors.contenttertiary,
    },
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    greeting: {
      fontSize: 16,
      color: colors.primaryCtaText,
    },
    weatherIcon: {
      width: 28,
      height: 28,
    },
    tempText: {
      fontSize: 16,
      color: colors.yellow,
      marginLeft: 6,
    },
    locationText: {
      fontSize: 12,
      color: colors.contenttertiary,
      marginLeft: 8,
    },
    menuIcon: {
      width: 27,
      height: 18,
    },
    bellIcon: {
      width: 27,
      height: 30,
    },
    bellIconWrapper: {
      position: 'relative',
      padding: 2,
    },
    unreadBadge: {
      position: 'absolute',
      top: -6,
      right: -8,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: '#E53935',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    unreadBadgeText: {
      fontSize: 10,
      lineHeight: 12,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
