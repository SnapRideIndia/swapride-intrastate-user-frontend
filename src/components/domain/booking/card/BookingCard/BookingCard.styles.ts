import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    indicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#2E5BFF',
      marginRight: 8,
    },
    headerText: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
    bullet: {
      color: colors.border_5,
      marginHorizontal: 4,
    },
    dateBadge: {
      borderWidth: 1,
      borderColor: colors.contentGreen,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    dateText: {
      fontSize: 12,
      color: colors.contentGreen,
    },
    routeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    locationBlock: {
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
    },
    locationName: {
      fontSize: 16,
      color: colors.contentPrimary,
      marginBottom: 4,
    },
    timeText: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    centerIconContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    busOnTrack: {
      height: 24,
      width: 100,
      resizeMode: 'contain',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 4,
    },
    viewTicketBtn: {
      flex: 1,
      backgroundColor: '#FFBE18', // Yellow/Gold as per screenshot
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
    },
    viewTicketBtnText: {
      color: colors.contentPrimary,
      fontSize: 14,
    },
    trackRideBtn: {
      flex: 1,
      backgroundColor: colors.background_primary,
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.contentPrimary,
    },
    trackRideBtnText: {
      color: colors.contentPrimary,
      fontSize: 14,
    },
  });
