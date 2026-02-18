import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_primary,
    },
    contentContainerStyle: {
      flexGrow: 1,
      paddingVertical: 25,
      paddingHorizontal: 26,
      gap: 25,
    },
    cardTitle: {
      fontSize: 20,
      color: colors.contentPrimary,
      marginBottom: 10,
    },
    cardText: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.contentPrimary,
    },
    addressContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    cardIcon: {
      width: 14,
      height: 14,
      marginTop: 3,
    },
    travelPreferenceCardsContainer: {
      gap: 7,
    },
    travelPreferenceCardContainer: {
      gap: 7,
    },
    cardblock: {
      paddingBottom: 30,
      borderBottomWidth: 0.5,
      borderColor: colors.border_4,
    },
    cardSubtitle:{
      fontSize: 14,
      lineHeight: 24,
      color: colors.contentPrimary
    },
    spacer:{
      flex:1
    },
    btnStyle:{
      height: 39,
      backgroundColor: colors.background_primary,
      borderWidth:1
    },
    logoutbtn:{
      borderWidth: 0,
      height: 39,
      backgroundColor: colors.background_primary
    },
    textStyle:{
      color: "#FF3B30"
    }
  });
