import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainerStyle: {
      flexGrow: 1,
      paddingVertical: 25,
      paddingHorizontal: 26,
      gap: 25,
    },
    cardTitle: {
      fontSize: 20,
      color: colors.contentPrimary,
      marginBottom: 10,
    },
    cardText: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.contentPrimary,
    },
    addressContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    cardIcon: {
      width: 14,
      height: 14,
      marginTop: 3,
    },
    travelPreferenceCardsContainer: {
      gap: 7,
    },
    travelPreferenceCardContainer: {
      gap: 7,
    },
    cardblock: {
      paddingBottom: 30,
      borderBottomWidth: 0.5,
      borderColor: colors.border_4,
    },
    cardSubtitle: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.contentPrimary,
    },
    spacer: {
      flex: 1,
    },
    btnStyle: {
      height: 39,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
    },
    logoutbtn: {
      borderWidth: 0,
      height: 39,
      backgroundColor: colors.background_primary,
    },
    textStyle: {
      color: '#FF3B30',
    },
    deleteSheetBackground: {
      backgroundColor: colors.background_primary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    deleteSheetHandleIndicator: {
      backgroundColor: colors.border_3,
      width: 40,
    },
    deleteSheetHeader: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    deleteSheetTitle: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    deleteSheetCloseButton: {
      padding: 4,
    },
    deleteSheetCloseIcon: {
      width: 16,
      height: 16,
      tintColor: colors.contentPrimary,
    },
    deleteSheetContent: {
      paddingHorizontal: 16,
    },
    deleteSheetLabel: {
      marginTop: 8,
      marginBottom: 8,
      fontSize: 14,
      color: colors.contentPrimary,
    },
    deleteSheetInput: {
      height: 44,
      borderWidth: 1,
      borderColor: colors.border_4,
      borderRadius: 10,
      paddingHorizontal: 14,
      color: colors.contentPrimary,
      backgroundColor: colors.background_primary,
    },
    deleteSheetButtonsRow: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 12,
    },
    deleteSheetCancelBtn: {
      flex: 1,
      height: 44,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_4,
    },
    deleteSheetCancelText: {
      color: colors.contentPrimary,
    },
    deleteSheetConfirmBtn: {
      flex: 1,
      height: 44,
      backgroundColor: '#FF3B30',
    },
    deleteSheetConfirmText: {
      color: '#FFFFFF',
    },
    headerTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
      width: 284,
    },
    crossIcon: {
      width: 18,
      height: 18,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    deleteDesc: {
      color: colors.contentPrimary,
      width: 293,
    },
    inputTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    inputContainer: {
      borderBottomWidth: 1,
      marginTop: 22,
    },
    inputInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginTop: 20,
    },
    btnWrapper: {
      flex: 1,
    },
    circleStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
