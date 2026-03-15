import { StyleSheet } from 'react-native';
import { ColorsType } from '../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    card: {
      marginHorizontal: 20,
      marginTop: 20,
      padding: 20,
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      elevation: 1,
    },
    saveButton: {
      marginTop: 24,
      alignSelf: 'stretch',
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      height: 44,
      elevation: 1,
    },
    saveButtonText: {
      color: colors.primaryCtaText,
      fontSize: 16,
      fontWeight: '600',
    },
    locationIcon: {
      width: 14,
      height: 20,
    },
    bookmarkIcon: {
      width: 20,
      height: 20,
    },
  });
