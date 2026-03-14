import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border_3,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 14,
      elevation: 1,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background_lightBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: colors.primaryLight,
    },
    content: {
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    label: {
      fontSize: 15,
      color: colors.contentPrimary,
      fontWeight: '600',
    },
    addressLine: {
      fontSize: 13,
      color: colors.contenttertiary,
      lineHeight: 18,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    actionBtn: {
      padding: 6,
    },
    editIcon: {
      width: 20,
      height: 20,
      tintColor: colors.contentPrimary,
    },
    deleteIcon: {
      width: 20,
      height: 20,
  
    },
  });
