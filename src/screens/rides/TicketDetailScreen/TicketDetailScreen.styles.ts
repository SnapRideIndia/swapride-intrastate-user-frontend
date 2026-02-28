import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainer: {
      flex: 1,
      padding: 24,
      gap: 20,
    },
    scanButton: {
      backgroundColor: colors.secondary,
    },
    scanIcon: {
      width: 20,
      height: 20,
    },
    locationButton: {
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    locationButtonText: {
      color: colors.primary,
    },
  });
