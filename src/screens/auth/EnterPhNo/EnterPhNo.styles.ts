import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
      zIndex: 999,
    },
    banner: {
      width: '100%',
      height: 412,
    },
    keyboardAwareScrollContainer: {
      flexGrow: 1,
      // padding: 20,
      //   justifyContent: 'center',
      backgroundColor: '#fff',
      zIndex: 999,
    },
    bannerTextContainer: {
      position: 'absolute',
      top: 96,
      left: 24,
      gap: 16,
      width: 303,
    },
    bannerTitle: {
      fontSize: 26,
      color: colors.primary,
      lineHeight: 28,
    },
    bannerSubTitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.primary,
    },

    buttonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    spacer: {
      flex: 1,
    },
  });
