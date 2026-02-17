import { StyleSheet } from 'react-native';
import { ColorsType } from '../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    scrollView: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 30,
      paddingTop: 30,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 0,
      padding: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    number: {
      fontSize: 12,
      color: colors.primaryLight,
    },
    dropDownItemsContainer: {
      marginTop: 20,
      gap: 20,
    },
    icon: {
      width: 25,
      height: 25,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    drawerItemTitle: {
      fontSize: 16,
      color: '#081C42',
    },
    spacer: {
      flex: 1,
    },
    logoutBtnSafeArea: {
      paddingHorizontal: 0,
      marginHorizontal: 0,
    },
    logoutBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      padding: 20
    },
    logoutTitle:{
      fontSize: 16,
      color: colors.primaryCtaText
    }
  });
