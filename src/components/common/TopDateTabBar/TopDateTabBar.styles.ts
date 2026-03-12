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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 8,
    },
    tabsContentContainer: {
      paddingHorizontal: 16,
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabsScroll: {
      flex: 1,
    },
    tabItem: {
      paddingTop: 8,
      paddingBottom: 10,
      paddingHorizontal: 12,
      width: 110,
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
    calendarButton: {
      paddingHorizontal: 8,
      paddingTop: 16,
      paddingBottom: 10,
    },
    calendarIcon: {
      width: 20,
      height: 20,
    },
  });
