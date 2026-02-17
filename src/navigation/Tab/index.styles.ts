import { StyleSheet } from "react-native";
import { ColorsType } from "../../constants/ui/colors/colors.types";

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    tabBarStyles: {
      backgroundColor: colors.background_primary,
      height:  80,
      alignItems: "center",
      justifyContent: "center"
    },
    tabBarIconStyle: {
      marginTop: 10,
      marginBottom: 7
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: 0,
    },
    active:{
        tintColor: "#1751BC"
    },
    inActive:{
        tintColor: "#7C9AED"
    },
    homeIcon:{
        width: 32,
        height: 32,
    },
    clockIcon:{
        width: 30,
        height: 30
    },
    label:{
        fontSize: 14,
        color: "#7C9AED"
    },
    activeLabel:{
        color: "#072A6A"
    }
  });
