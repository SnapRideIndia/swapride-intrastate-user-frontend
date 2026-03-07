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
      paddingTop: 20,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    whiteSection: {
      backgroundColor: colors.background_primary,
    },
    whiteSectionWithGap: {
      marginBottom: 18,
      paddingBottom: 24,
    },
    policyRow: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border_2,
    },
    policyText: {
      fontSize: 14,
      color: colors.primary,
    },

    footer: {
      padding: 16,
      marginTop: 'auto', 
    },
    proceedBtn: {
      borderRadius: 12,
      height: 52,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    btnChevron: {
      width: 14,
      height: 14,
      tintColor: colors.primary,
    },
    couponContainer: {
      paddingVertical: 16,
    },
    applyBtnText: {
      color: colors.primaryLight,
      fontSize: 14,
    },
  });
