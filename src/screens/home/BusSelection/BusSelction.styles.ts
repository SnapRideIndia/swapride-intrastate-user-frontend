import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 10,
      paddingVertical: 20,
      gap: 10,
    },
    bannerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: "center"
      backgroundColor: colors.background_primary,
      borderRadius: 10,
      paddingHorizontal: 29,
      gap: 20,
      marginHorizontal: 15,
      marginTop: 20,
      marginBottom: 10,
    },
    bannerText: {
      fontSize: 14,
      width: 200,
      color: colors.primary,
    },
    shuttel: {
      width: 80,
      height: 80,
    },
  });
