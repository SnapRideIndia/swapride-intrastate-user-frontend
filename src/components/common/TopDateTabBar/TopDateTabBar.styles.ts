import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border_2,
      // Drop shadow behind the whole top tab bar (iOS + Android)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 6,
      zIndex: 10,
    },
    tabsContentContainer: {
      paddingHorizontal: 16,
      paddingRight: 24,
      // paddingVertical: 12,
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabItem: {
      paddingTop: 8,
      paddingBottom: 10,
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
