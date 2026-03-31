import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      paddingBottom: 50,
    },
    headerIcon: {
      width: 24,
      height: 24,
      tintColor: colors.contentPrimary,
    },
    statusSection: {
      alignItems: 'center',
      paddingVertical: 32,
      backgroundColor: colors.background_primary,
    },
    statusIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusIcon: {
      width: 32,
      height: 32,
    },
    statusTitle: {
      fontSize: 20,
      color: colors.contentPrimary,
      marginBottom: 8,
    },
    statusSubtitle: {
      fontSize: 14,
      color: colors.contenttertiary,
    },
    contentCard: {
      marginHorizontal: 16,
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_2,
      padding: 24,
      marginBottom: 16,
      elevation: 1,
      shadowColor: colors.background_black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    routeSection: {
      gap: 16,
    },
    locationBlock: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
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
      marginTop: 2,
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
    locationIcon: {
      width: 18,
      height: 18,
      tintColor: colors.contentSecondary,
    },
    locationTextWrap: {
      flex: 1,
      gap: 4,
    },
    locationLabel: {
      fontSize: 12,
      color: colors.contenttertiary,
      lineHeight: 16,
      textTransform: 'uppercase',
    },
    locationValue: {
      fontSize: 16,
      color: colors.contentPrimary,
      lineHeight: 22,
    },
    cardTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
      marginBottom: 20,
    },
    gridContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    gridItem: {
      flex: 1,
      gap: 8,
    },
    gridLabel: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    gridValue: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border_2,
      gap: 12,
    },
    detailIcon: {
      width: 20,
      height: 20,
      tintColor: colors.contentSecondary,
    },
    detailLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.contentSecondary,
    },
    detailValue: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    notesSection: {
      marginTop: 20,
      gap: 12,
    },
    notesBox: {
      backgroundColor: colors.background_secondary,
      padding: 16,
      borderRadius: 12,
    },
    notesText: {
      fontSize: 14,
      color: colors.contentSecondary,
      lineHeight: 22,
    },
    helpSection: {
      alignItems: 'center',
      marginTop: 20,
      gap: 20,
    },
    helpText: {
      fontSize: 14,
      color: colors.contenttertiary,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_2,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,
      gap: 12,
    },
    callIcon: {
      width: 20,
      height: 20,
      tintColor: colors.contentPrimary,
    },
    contactButtonText: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    errorText: {
      fontSize: 16,
      color: colors.contenttertiary,
    },
  });
