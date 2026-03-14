import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export type SwPopupModalVariant = 'default' | 'compact' | 'centered';

export const useStyles = (colors: ColorsType, variant: SwPopupModalVariant, centerTitle?: boolean) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10000,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.modalOverlay ?? 'rgba(0,0,0,0.5)',
    },
    card: {
      width: '100%',
      maxWidth: variant === 'compact' ? 360 : 420,
      backgroundColor: colors.background_primary,
      borderRadius: 24,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
    header: {
      paddingHorizontal: variant === 'compact' ? 20 : 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    headerCentered: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    headerTitleCentered: {
      textAlign: 'center',
    },
    content: {
      paddingHorizontal: variant === 'compact' ? 20 : 20,
      paddingTop: 12,
      paddingBottom: 20,
    },
  });
