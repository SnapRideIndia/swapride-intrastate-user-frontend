import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    modalContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 9999,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.modalOverlay,
    },
    contentWrapper: {
      width: '100%',
      backgroundColor: colors.background_primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
      shadowColor: colors.contentPrimary,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 0,
    },
    headerTitle: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    closeButton: {
      padding: 6,
    },
    closeIcon: {
      width: 18,
      height: 18,
      tintColor: colors.contentPrimary,
    },
  });
