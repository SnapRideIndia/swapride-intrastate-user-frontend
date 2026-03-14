import { StyleSheet } from 'react-native';
import { ColorsType } from '../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    scrollWrap: {
      flex: 1,
      minHeight: 0,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    list: {
      marginBottom: 12,
    },
    buttonWrap: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    addButton: {
      alignSelf: 'stretch',
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      height: 44,
      elevation: 1,
    },
    addButtonText: {
      color: colors.primaryCtaText,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteModalContent: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    deleteModalMessage: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 8,
      marginBottom: 24,
    },
    deleteModalMessageBold: {
      fontWeight: '700',
      color: colors.contentPrimary,
    },
    deleteModalButtonRow: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      alignSelf: 'stretch',
      marginTop: 4,
    },
    deleteModalCancelButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      backgroundColor: colors.background_primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteModalCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primaryLight,
    },
    deleteModalDeleteButton: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    deleteModalDeleteText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
