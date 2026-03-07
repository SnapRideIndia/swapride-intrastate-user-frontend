import { StyleSheet } from 'react-native';

export const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      margin: 2,
    },
    seatTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seatBody: {
      width: 24,
      height: 30,
      borderWidth: 1.5,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderColor: colors.border_3,
      backgroundColor: colors.background_primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    armrest: {
      width: 7,
      height: 24,
      borderWidth: 1.5,
      borderRadius: 3,
      borderColor: colors.border_3,
      backgroundColor: colors.background_primary,
      marginHorizontal: -1,
      alignSelf: 'flex-end',
    },
    seatBase: {
      width: 34,
      height: 8,
      borderWidth: 1.5,
      borderRadius: 4,
      borderColor: colors.border_3,
      backgroundColor: colors.background_primary,
      marginTop: -1.5,
    },
    driverContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 48,
    },
    driverIcon: {
      width: 32,
      height: 32,
    },
    selectedBody: {
      borderColor: colors.secondary,
      backgroundColor: colors.lightOrange,
    },
    selectedBorder: {
      borderColor: colors.secondary,
      backgroundColor: colors.lightOrange,
    },
    bookedBody: {
      borderColor: colors.contenttertiary,
      backgroundColor: colors.contentDisabled,
    },
    bookedBorder: {
      borderColor: colors.contenttertiary,
      backgroundColor: colors.contentDisabled,
    },
    label: {
      fontSize: 10,
      color: colors.contentPrimary,
    },
  });
