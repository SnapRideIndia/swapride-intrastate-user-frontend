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
      fontSize: 20,
      color: colors.contentPrimary,
      lineHeight: 20,
    },
    closeButton: {
      padding: 6,
    },
    closeIcon: {
      width: 18,
      height: 18,
      tintColor: colors.contentPrimary,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    searchContainer: {
      height: 45,
      borderWidth: 0.4,
      borderColor: '#00000033',
      borderRadius: 15,
      paddingHorizontal: 12,
      // paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.background_primary,
      elevation: 2,
    },
    searchIcon: {
      width: 24,
      height: 24,
      tintColor: colors.contentPrimary,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 0,
      color: colors.contentPrimary,
      fontSize: 16,
    },
    useCurrentLocationRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      paddingVertical: 6,
    },
    useCurrentLocationIconWrap: {
      width: 45,
      height: 45,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ECEFFA',
    },
    useCurrentLocationIcon: {
      width: 22,
      height: 22,
      tintColor: '#2F6BFF',
    },
    useCurrentLocationText: {
      fontSize: 14,
      color: '#1751BC',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border_4,
      marginTop: 10,
    },
    sectionTitle: {
      marginTop: 23,
      marginBottom: 12,
      fontSize: 13,
      color: colors.contentPrimary,
      textTransform: 'lowercase',
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      paddingVertical: 10,
    },
    listIconWrap: {
      width: 45,
      height: 45,
      borderRadius: 999,
      backgroundColor: '#ECEFFA',
      alignItems: 'center',
      justifyContent: 'center',
    },
    listIcon: {
      width: 18,
      height: 18,
      tintColor: '#1751BC',
    },
    listTextWrap: {
      flex: 1,
      gap: 2,
    },
    listTitle: {
      fontSize: 14,
      color: colors.contentPrimary,
      lineHeight: 24,
    },
    listSubtitle: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    rowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border_4,
      marginLeft: 38,
    },
    // Dropdown container for suggestions (positioned over content below)
    dropdownContainer: {
      position: 'absolute',
      top: 52, // just below the search input (height 45 + small gap)
      left: 0,
      right: 0,
      borderWidth: 1,
      borderColor: colors.border_3,
      borderRadius: 12,
      backgroundColor: colors.background_primary,
      maxHeight: 280,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      zIndex: 10,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border_4,
    },
    dropdownItemLast: {
      borderBottomWidth: 0,
    },
    dropdownItemIcon: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: '#ECEFFA',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownItemIconImg: {
      width: 16,
      height: 16,
      tintColor: '#1751BC',
    },
    dropdownItemTextWrap: {
      flex: 1,
    },
    dropdownItemTitle: {
      fontSize: 14,
      color: colors.contentPrimary,
      lineHeight: 20,
    },
    dropdownItemSubtitle: {
      fontSize: 12,
      color: colors.contenttertiary,
      marginTop: 2,
    },
  });
