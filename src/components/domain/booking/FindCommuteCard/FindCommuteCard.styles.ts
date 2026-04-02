import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.border_3,
      borderRadius: 16,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 21,
      gap: 8,
      backgroundColor: colors.background_primary,
      elevation: 2,
      shadowColor: colors.contentPrimary,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    dateSection: {
      flexDirection: 'row',
      gap: 10,
    },
    dateList: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexGrow: 1,
      paddingHorizontal: 10,
    },
    dateTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderWidth: 1,
      paddingHorizontal: 10,
      height: 23,
      justifyContent: 'center',
      borderRadius: 6,
      borderColor: colors.border_4,
    },
    activeDateTab: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
    },
    activeDateText: {
      color: colors.background_primary,
    },
    inactiveDateText: {
      color: colors.contentPrimary,
    },
    checkIcon: {
      width: 11,
      height: 11,
    },
    calendarIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primaryLight,
    },
    btnContainer: {
      marginTop: 12,
    },
    btnStyle: {
      height: 36,
    },
    btnTextStyle: {
      fontSize: 16,
    },
  });
