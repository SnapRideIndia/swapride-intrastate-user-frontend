import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
    },

    contentWrapper: {
      paddingVertical: 26,
      paddingHorizontal: 16,
    },

    primaryFont: {
      color: colors.primary,
    },

    title: {
      fontSize: 18,
    },

    shareContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    shareText: {
      fontSize: 16,
    },

    shareIcon: {
      width: 16,
      height: 16,
    },

    chevronIcon: {
      width: 14,
      height: 14,
    },

    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },

    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },

    tabsWrapper: {
      flexDirection: 'row',
      gap: 20,
    },

    tabItem: {
      paddingBottom: 8,
    },

    activeTabItem: {},

    tabText: {
      fontSize: 16,
      color: colors.primary,
    },

    activeTabText: {},

    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: colors.primaryLight,
    },

    viewAllStopsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingBottom: 8,
    },

    viewAllStopsText: {
      fontSize: 16,
    },

    tabContentContainer: {
      paddingVertical: 12,
    },
  });
