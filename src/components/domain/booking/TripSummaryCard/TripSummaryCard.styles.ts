import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 20,
    elevation: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.primaryLight,
    },
    outboundHeader: {},
    returnHeader: {},
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerIcon: {
      width: 20,
      height: 20,
      tintColor: colors.button_primary,
    },
    headerText: {
      color: colors.background_primary,
      fontSize: 15,
    },
    returnBadge: {
      backgroundColor: colors.background_primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    returnBadgeText: {
      color: colors.contentPrimary,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      flexDirection: 'row',
    },
    pointsContainer: {
      flex: 1,
    },
    indicatorContainer: {
      width: 76,
      alignItems: 'center',
    },
    verticalConnector: {
      flex: 1,
      width: 0,
      borderLeftWidth: 1.5,
      borderLeftColor: colors.contenttertiary,
      borderStyle: 'dashed',
      marginTop: 4,
    },
    pointRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 0,
    },
    dropoffRow: {
      marginTop: 0,
    },
    timeBadge: {
      backgroundColor: colors.button_primary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      height: 28,
      justifyContent: 'center',
    },
    timeText: {
      fontSize: 12,
      color: colors.primary,
    },
    pointInfo: {
      flex: 1,
      gap: 4,
    },
    pickupInfo: {
      paddingBottom: 32,
    },
    pointTitle: {
      fontSize: 15,
      color: colors.contentPrimary,
    },
    pointDescription: {
      fontSize: 12,
      color: colors.contentPrimary,
    },
    walkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
    },
    walkIcon: {
      width: 14,
      height: 14,
      tintColor: colors.primary,
    },
    walkText: {
      fontSize: 12,
      color: colors.primary,
    },
    cardSeparator: {
      marginHorizontal: 20,
      borderStyle: 'dashed',
      borderWidth: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
      backgroundColor: 'transparent',
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    seatInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    seatIconContainer: {
      width: 40,
      height: 40,
      backgroundColor: colors.background_secondary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seatIcon: {
      width: 20,
      height: 20,
    },
    seatTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    seatNumber: {
      fontSize: 18,
      color: colors.primary,
    },
    autoAssigned: {
      fontSize: 13,
      color: colors.contentSecondary,
    },
    changeSeatText: {
      color: colors.primaryLight,
      fontSize: 14,
    },
  });
