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
  });
