import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    listContent: {
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
      elevation: 1,
      shadowColor: colors.background_black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_secondary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      gap: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 10,
      color: colors.contentPrimary,
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
      gap: 12,
      paddingTop: 16,
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
    arrowIcon: {
      width: 14,
      height: 14,
      marginLeft: 'auto',
      tintColor: colors.contenttertiary,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyIcon: {
      width: 48,
      height: 48,
      tintColor: colors.border_3,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      color: colors.contentPrimary,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.contenttertiary,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
  });
