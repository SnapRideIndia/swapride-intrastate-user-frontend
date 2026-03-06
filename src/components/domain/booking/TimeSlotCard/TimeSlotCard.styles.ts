import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: colors.background_primary,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      width: '100%',
    },
    leftContent: {
      flex: 1,
    },
    timeRange: {
      fontSize: 16,
      color: colors.contentSecondary,
      marginBottom: 4,
    },
    viaLocation: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
    rightContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    locationIcon: {
      width: 14,
      height: 14,
      tintColor: colors.primary,
    },
    stopsText: {
      fontSize: 14,
      color: colors.primary,
    },
  });
