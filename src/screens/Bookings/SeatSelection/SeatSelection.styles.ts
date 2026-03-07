import { StyleSheet } from 'react-native';

export const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background_lightBlue,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 40,
    },
    selectionContainer: {
      backgroundColor: colors.background_primary,
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
    },
    selectionText: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    footer: {
      padding: 16,
      backgroundColor: colors.background_primary,
    },
  });
