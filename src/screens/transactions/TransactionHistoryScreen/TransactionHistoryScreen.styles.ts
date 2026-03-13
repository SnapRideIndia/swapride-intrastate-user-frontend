import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    searchInput: {
      paddingVertical: 3,
    },
    filterBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      columnGap: 8,
    },
    filterScrollContent: {
      columnGap: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border_2,
      backgroundColor: colors.dropdown_primary,
    },
    filterChipText: {
      fontSize: 13,
      color: colors.contentSecondary,
    },
    filterChipIcon: {
      width: 6,
      height: 15,
      marginLeft: 10,
      transform: [{ rotate: '90deg' }],
    },
    clearAllChip: {
      marginLeft: 'auto',
      backgroundColor: colors.button_secondary,
      borderColor: colors.button_secondary,
    },
    clearAllChipText: {
      fontSize: 13,
      color: colors.primaryCtaText,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 12,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 12,
    },
    shimmerList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 12,
    },
    headerTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
      marginBottom: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
    },
    searchIcon: {
      width: 18,
      height: 18,
      tintColor: colors.contentSecondary,
      marginRight: 10,
    },
    errorText: {
      color: colors.contentRed,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 8,
    },
    footerLoader: {
      paddingVertical: 16,
      alignItems: 'center',
    },
  });

