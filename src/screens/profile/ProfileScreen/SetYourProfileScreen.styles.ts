import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    keyboardAwareScrollContainer: {
      flexGrow: 1,
      // padding: 20,
      //   justifyContent: 'center',
      backgroundColor: '#fff',
      zIndex: 999,
      paddingBottom: 100,
    },
    imageOuterContainer: {
      paddingTop: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: 125,
      height: 125,
      backgroundColor: 'green',
      borderRadius: 125,
    },
    cameraIconContainer: {
      position: 'absolute',
      width: 35,
      height: 35,
      borderRadius: 35,
      backgroundColor: 'red',
      bottom: -10,
    },
    imageDes: {
      fontSize: 12,
      color: colors.contentPrimary,
      lineHeight: 20,
      textAlign: 'center',
      marginTop: 20,
    },
    contentContainer: {
      flexGrow: 1,
    },
    devider: {
      height: 4,
      backgroundColor: colors.border_3,
    },
    inputContainer: {
      paddingVertical: 52,
      paddingHorizontal: 26,
      gap: 20,
    },
    buttonContainer: {
      //   position: 'absolute',
      //   left: 20,
      //   right: 20,
      //   bottom: 20,
      borderTopWidth: 4,
      borderColor: colors.border_3,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    titleIcon: {
      width: 12,
      height: 12,
    },
    spacer:{
        flex:1
    }
  });
