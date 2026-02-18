import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container:{
        paddingHorizontal: 26,
        backgroundColor: "#072A6A",
        paddingVertical: 35,
        gap: 30
    },
    innerContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    leftArrow:{
        width: 19,
        height: 16,
        tintColor: colors.primaryCtaText
    },
    detailsContainer:{
        flexDirection: "row",
        alignItems: "center",
    },
    profileContainer:{
        width: 91,
        height: 91,
        backgroundColor: "green",
        borderRadius: 91
    },
    detailsSection:{
        flex:1,
    },
    detailtext:{
        color: colors.primaryCtaText,
        fontSize: 16,
        lineHeight: 24
    }
  });