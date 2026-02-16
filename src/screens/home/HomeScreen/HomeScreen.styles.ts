import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary
    },
    contentContainerStyle: {
      flexGrow: 1,
    },
    upperSection: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 24,
      paddingBottom: 50
    },
    lowerSection: {
      flex: 1, backgroundColor: colors.background_primary, borderTopRightRadius: 30, borderTopLeftRadius: 30,
      marginTop: -30,
      paddingVertical: 23,
      paddingHorizontal: 20,
      gap: 17,
    
    },
    optionCardContainerTitle: {
      fontSize: 14,
      color: colors.contentSecondary
    },
    title: {
      marginTop: 16,
      marginBottom: 15,
      fontSize: 20,
      color: colors.primaryCtaText
    },
    optionCardContainer: {
      flexDirection: "row",
      gap: 24,
      paddingBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: colors.border_3
    }

  });