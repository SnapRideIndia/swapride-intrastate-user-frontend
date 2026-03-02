import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    sheetBackground: {
      backgroundColor: colors.background_primary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: colors.border_3,
      width: 40,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    closeButton: {
      padding: 6,
    },
    closeIcon: {
      width: 14,
      height: 14,
      tintColor: colors.contentPrimary,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    searchContainer: {
      height: 36,
      borderWidth: 1,
      borderColor: colors.border_4,
      borderRadius: 10,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.background_primary,
    },
    searchIcon: {
      width: 14,
      height: 14,
      tintColor: colors.border_3,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 0,
      color: colors.contentPrimary,
      fontSize: 12,
    },
    useCurrentLocationRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
    },
    useCurrentLocationIconWrap: {
      width: 22,
      height: 22,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border_4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background_primary,
    },
    useCurrentLocationIcon: {
      width: 12,
      height: 12,
      tintColor: '#2F6BFF',
    },
    useCurrentLocationText: {
      fontSize: 12,
      color: '#2F6BFF',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border_4,
      marginTop: 10,
    },
    sectionTitle: {
      marginTop: 12,
      fontSize: 10,
      color: colors.border_3,
      textTransform: 'lowercase',
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      paddingVertical: 10,
    },
    listIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_4,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    listIcon: {
      width: 14,
      height: 14,
      tintColor: colors.contentPrimary,
    },
    listTextWrap: {
      flex: 1,
      gap: 2,
    },
    listTitle: {
      fontSize: 12,
      color: colors.contentPrimary,
    },
    listSubtitle: {
      fontSize: 10,
      color: colors.border_3,
    },
    rowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border_4,
      marginLeft: 38,
    },
  });

