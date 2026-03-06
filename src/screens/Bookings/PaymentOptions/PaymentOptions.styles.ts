import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_lightBlue,
    },
    scrollContent: {
      flexGrow: 1,
    },
    cardsContainer: {
      padding: 20,
    },
    footer: {
      backgroundColor: colors.background_primary,
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border_2,
    },
    proceedBtn: {
      width: '100%',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    addMoneyBtnContainer: {
      justifyContent: 'center',
    },
    addMoneyBtn: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 16,
      height: 32,
      borderRadius: 6,
    },
    addMoneyBtnText: {
      fontSize: 12,
      color: colors.primaryCtaText,
    },
  });
