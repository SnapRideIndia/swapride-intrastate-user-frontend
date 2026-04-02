import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_lightBlue,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 10,
      paddingVertical: 20,
      gap: 10,
    },
    bannerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderRadius: 10,
      paddingHorizontal: 29,
      gap: 20,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    bannerText: {
      fontSize: 14,
      width: 200,
      color: colors.primary,
    },
    shuttel: {
      width: 80,
      height: 80,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
      marginRight: 40,
    },
    headerTitleText: {
      fontSize: 16,
      color: colors.contentPrimary,
      flexShrink: 1,
    },
    headerArrow: {
      fontSize: 14,
      color: colors.contenttertiary,
    },
  });
