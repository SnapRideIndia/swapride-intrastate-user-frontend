import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container:{
        paddingHorizontal: 27,
        paddingTop: 37,
        paddingBottom: 20,
        borderBottomWidth: 4,
        borderColor: colors.border_3,
        backgroundColor: colors.background_primary
    },
    headerInnerContainer:{
        flexDirection: "row",
        gap: 23,
        alignItems: "center"
    },
    backArrow:{
        height: 15.75,
        width: 18.75
    },
    title:{
        fontSize: 18,
        color: colors.contentPrimary
    }
  });