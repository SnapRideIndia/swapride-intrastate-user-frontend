import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    image: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      color: colors.contentPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.contentSecondary,
      textAlign: 'center',
    },
    actionContainer: {
      marginTop: 16,
    },
  });

