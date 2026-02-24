import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      elevation: 1,
      gap: 12,
    },
    busOnTrack: {
      //   width: 100,
      //   height: 100,
    },

    indicator: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: colors.primaryLight,
    },

    fontTwelve: {
      fontSize: 12,
      color: colors.contentPrimary,
    },

    fontFourteen: {
      fontSize: 14,
      color: colors.contentPrimary,
    },

    fontSixteen: {
      fontSize: 16,
      color: colors.contentPrimary,
    },

    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },

    middleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    seatText: {
      color: colors.contenttertiary,
    },

    dateContainer: {
      padding: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.contentGreen,
      borderRadius: 4,
    },

    dateText: {
      color: colors.contentGreen,
    },

    timeText: {
      color: colors.contentSecondary,
    },

    amountText: {
      color: colors.contentGreen,
    },

    viewDetailsButton: {
      borderWidth: 1,
      borderColor: colors.border_8,
      padding: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },

    locationText: {
      flexWrap: 'wrap',
    },

    flexColumn: {
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
    },

    centerIconContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
  });
