import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background_success_light,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginTop: 4,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    icon: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    textContainer: {
      flexDirection: 'column',
      gap: 2,
    },
    title: {
      fontSize: 14,
      color: colors.contentSuccess,
      textTransform: 'uppercase',
    },
    subtitle: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    crossIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.contentSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    crossIcon: {
      width: 10,
      height: 10,
      resizeMode: 'contain',
      tintColor: colors.contentSecondary,
    },
  });
