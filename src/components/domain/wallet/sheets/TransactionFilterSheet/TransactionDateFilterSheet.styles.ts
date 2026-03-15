import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    listScroll: {
      flexGrow: 0,
    },
    container: {
      paddingTop: 8,
      paddingHorizontal: 0,
      gap: 8,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    optionLabel: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border_3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.button_secondary,
    },
    customSection: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    customRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      columnGap: 12,
    },
    customLabel: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
    customValue: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
    badge: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border_3,
      backgroundColor: colors.background_primary,
    },
    toText: {
      marginHorizontal: 8,
      fontSize: 14,
      color: colors.contentSecondary,
    },
    buttonRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
      columnGap: 8,
      marginTop: 'auto',
      backgroundColor: colors.background_primary,
    },
    primaryButton: {
      flex: 1,
      borderRadius: 10,
      height: 48,
      backgroundColor: colors.button_secondary,
    },
    primaryButtonText: {
      color: colors.primaryCtaText,
      fontSize: 16,
    },
    secondaryButton: {
      flex: 1,
      borderRadius: 10,
      height: 48,
      backgroundColor: colors.background_primary,
      borderWidth: 1,
      borderColor: colors.border_2,
    },
    secondaryButtonText: {
      color: colors.contentPrimary,
    },
  });
