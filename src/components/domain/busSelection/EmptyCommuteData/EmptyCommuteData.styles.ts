import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      marginTop: 80,
    },
    iconContainer: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: colors.background_primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    image: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 20,
      color: colors.contentPrimary,
      marginBottom: 12,
      textAlign: 'center',
    },
    text: {
      fontSize: 15,
      textAlign: 'center',
      color: colors.contenttertiary,
      lineHeight: 22,
    },
  });
