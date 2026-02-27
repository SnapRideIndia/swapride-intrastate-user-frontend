import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border_2,
    },
    tabsContentContainer: {
      paddingHorizontal: 16,
      paddingRight: 24,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 20,
      minWidth: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabTitle: {
      fontSize: 14,
      color: colors.contentSecondary,
    },
    tabTitleActive: {
      color: colors.primary,
      fontSize: 14,
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      left: 8,
      right: 8,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
  });
