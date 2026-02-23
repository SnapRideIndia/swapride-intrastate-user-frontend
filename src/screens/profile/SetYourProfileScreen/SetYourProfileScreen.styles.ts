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
    imageWrapper: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: 125,
      height: 125,
      backgroundColor: colors.border_3,
      borderRadius: 62.5,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    placeholderIcon: {
      width: 60,
      height: 60,
      opacity: 0.6,
    },
    cameraIconContainer: {
      position: 'absolute',
      width: 36,
      height: 36,
      bottom: -15,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
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
    spacer: {
      flex: 1,
    },
    rowInputs: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'flex-start',
    },
    flexInput: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 20,
      color: colors.contentPrimary,
    },
    sectionSubtitle:{
      fontSize: 12, color: colors.contentPrimary
    }
  });
