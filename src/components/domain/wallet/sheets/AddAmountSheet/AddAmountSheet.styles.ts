import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    sheetContent: {
      paddingBottom: 20,
      paddingTop: 20, // Add top space
      paddingHorizontal: 0, // Parent SwBottomSheet already has 16
      gap: 20,
    },
    inputInnerContainer: {
      borderWidth: 1,
      borderColor: colors.border_3,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
    },
    quickAmountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    quickAmountButton: {
      flex: 1,
      backgroundColor: colors.secondary,
      height: 44,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',

      elevation: 1.5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    quickAmountText: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    continueButton: {
      marginTop: 10,
      backgroundColor: colors.button_secondary,
      borderRadius: 10,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1.5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    continueButtonText: {
      color: colors.primaryCtaText,
      fontSize: 18,
    },
  });
