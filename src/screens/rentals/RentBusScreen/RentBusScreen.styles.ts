import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    scrollView: {
      flex: 1,
    },
    contentSection: {
      padding: 20,
    },
    introContainer: {
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    introTitle: {
      fontSize: 22,
      color: colors.contentPrimary,
      marginBottom: 4,
    },
    introSubtitle: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'left',
    },
    formContainer: {
      gap: 16,
    },
    fieldIcon: {
      width: 16,
      height: 16,
      marginRight: 10,
    },
    passengerSection: {
      marginTop: 24,
      marginBottom: 100,
    },
    passengerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    passengerLabel: {
      fontSize: 14,
      color: colors.contentPrimary,
      marginLeft: 8,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
    },
    chipSelected: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
    },
    chipText: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    chipTextSelected: {
      color: colors.primaryCtaText,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background_primary,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
      elevation: 5,
      shadowColor: colors.background_black,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    footerButton: {
      height: 50,
    },
    footerButtonText: {
      fontSize: 16,
    },
    modalContent: {
      alignItems: 'center',
      padding: 10,
    },
    successIcon: {
      width: 50,
      height: 50,
      marginBottom: 16,
    },
    successTitle: {
      fontSize: 20,
      color: colors.contentPrimary,
      textAlign: 'center',
    },
    successSubtitle: {
      fontSize: 14,
      color: colors.contentSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    modalButton: {
      marginTop: 24,
      width: '100%',
    },
  });
