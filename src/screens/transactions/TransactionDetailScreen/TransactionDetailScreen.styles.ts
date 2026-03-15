import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },

    summary: {
      padding: 16,
      marginBottom: 16,
      borderRadius: 16,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_3,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      alignItems: 'center',
    },

    amount: {
      fontSize: 32,
      marginBottom: 6,
    },

    title: {
      fontSize: 15,
      color: colors.contentSecondary,
      marginBottom: 4,
    },

    date: {
      fontSize: 13,
      color: colors.contentSecondary,
    },

    statusBadge: {
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.background_secondary,
    },

    statusText: {
      fontSize: 12,
      color: colors.contentPrimary,
    },

    section: {
      marginTop: 20,
    },

    sectionTitle: {
      fontSize: 14,
      marginBottom: 14,
      color: colors.contentSecondary,
    },

    detailItem: {
      marginBottom: 16,
    },

    detailLabel: {
      fontSize: 12,
      color: colors.contentSecondary,
      marginBottom: 4,
    },

    detailValue: {
      fontSize: 15,
      color: colors.contentPrimary,
      flexShrink: 1,
    },

    // Legacy layout styles still used by screen
    card: {
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      padding: 20,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    rowLabel: {
      fontSize: 14,
      color: colors.contentSecondary,
    },

    rowValue: {
      fontSize: 14,
      color: colors.contentPrimary,
    },

    statusSuccess: {
      fontSize: 14,
      color: colors.contentGreen,
    },

    errorText: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
    },

    bookingCard: {
      marginTop: 16,
    },

    bookingRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },

    bookingLabel: {
      fontSize: 14,
      color: colors.contentSecondary,
      minWidth: 110,
    },

    bookingValue: {
      flex: 1,
      fontSize: 14,
      color: colors.contentPrimary,
    },
  });
