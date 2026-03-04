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
      lineHeight: 20
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
      borderColor: "#00000033",
      borderRadius: 15,
      paddingHorizontal: 12,
      // paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.background_primary,
      elevation:2
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
      backgroundColor: "#ECEFFA",
    },
    useCurrentLocationIcon: {
      width: 22,
      height: 22,
      tintColor: '#2F6BFF',
    },
    useCurrentLocationText: {
      fontSize: 14,
      color: "#1751BC",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border_4,
      marginTop: 10,
    },
    sectionTitle: {
      marginTop: 23,
      marginBottom:12,
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
      backgroundColor: "#ECEFFA",
      alignItems: 'center',
      justifyContent: 'center',
    },
    listIcon: {
      width: 18,
      height: 18,
      tintColor: "#1751BC",
    },
    listTextWrap: {
      flex: 1,
      gap: 2,
    },
    listTitle: {
      fontSize: 14,
      color: colors.contentPrimary,
      lineHeight: 24
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
  });

