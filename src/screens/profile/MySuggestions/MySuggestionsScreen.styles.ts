import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    scrollWrap: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: colors.background_black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.background_secondary,
    },
    statusText: {
      fontSize: 10,
      color: colors.contentPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    dateText: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    routeContainer: {
      gap: 12,
      marginBottom: 16,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    dotLineCol: {
      alignItems: 'center',
      minWidth: 8,
      alignSelf: 'stretch',
    },
    routeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 6,
    },
    routeConnector: {
      flex: 1,
      width: 0,
      borderLeftWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.border_3,
      marginTop: 4,
      marginBottom: -22,
    },
    locationText: {
      fontSize: 14,
      color: colors.contentPrimary,
      flex: 1,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
    },
    infoPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 6,
    },
    pillIcon: {
      width: 12,
      height: 12,
      tintColor: colors.contentSecondary,
    },
    pillText: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      marginLeft: 'auto',
      gap: 12,
    },
    actionIconButton: {
      padding: 4,
    },
    actionIcon: {
      width: 18,
      height: 18,
      tintColor: colors.contenttertiary,
    },
    viewOnMapButton: {
      justifyContent: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    viewOnMapText: {
      fontSize: 12,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    deleteIcon: {
      tintColor: colors.contentRed,
    },
    descriptionBox: {
      marginTop: 12,
      backgroundColor: colors.background_secondary,
      padding: 10,
      borderRadius: 10,
    },
    descriptionText: {
      fontSize: 12,
      color: colors.contentSecondary,
      fontStyle: 'italic',
      lineHeight: 18,
    },
  });
