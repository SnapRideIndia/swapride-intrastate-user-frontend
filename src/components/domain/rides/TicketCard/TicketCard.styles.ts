import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: colors.secondary,
      borderRadius: 16,
      overflow: 'hidden',
      paddingBottom: 20,
      width: '100%',
    },
    qrSection: {
      paddingVertical: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrBackground: {
      width: 220,
      height: 220,
      backgroundColor: colors.background_primary,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: colors.background_black,
    },
    qrOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.modalOverlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrImage: {
      width: 218,
      height: 218,
    },
    activateStrip: {
      backgroundColor: colors.background_primary,
      width: '100%',
      paddingVertical: 10,
      alignItems: 'center',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.secondary,
    },
    activateText: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    dashedLine: {
      borderWidth: 1,
      borderColor: colors.border_7,
      borderStyle: 'dashed',
      width: '100%',
      height: 1,
    },
    routeSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    locationText: {
      fontSize: 14,
      color: colors.contentSecondary,
      flex: 1,
    },
    swapIcon: {
      width: 60,
      height: 24,
      marginHorizontal: 10,
    },
    timeStrip: {
      backgroundColor: colors.background_black,
      paddingVertical: 8,
      alignItems: 'center',
      marginVertical: 10,
    },
    timeText: {
      color: colors.primaryCtaText,
      fontSize: 14,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 10,
      gap: 15,
    },
    detailBox: {
      flex: 1,
      height: 44,
      backgroundColor: colors.background_primary,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    dateBox: {
      flex: 1.2,
      backgroundColor: colors.secondary,
      borderColor: colors.primary,
    },
    detailText: {
      fontSize: 14,
      color: colors.primary,
    },
  });
