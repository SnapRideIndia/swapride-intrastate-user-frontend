import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';


export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: colors.background_primary
    },
    contentContainer:{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingVertical: 30,
        gap: 20
    },
    cardContainer:{
        padding: 15,
        borderWidth:1,
        borderColor: colors.border_1,
        borderRadius: 10
    },
    cardHeader:{
        flexDirection: "row",
        alignItems: "center",
    },
    shuttelIcon:{
        width: 26,
        height: 26
    },
    iconContainer:{
        width: 46,
        height: 46,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECEFFA"
    },
    title:{
        fontSize: 18,
        color: colors.contentPrimary
    },
    subTitle:{
        fontSize: 13,
        color: colors.contentPrimary
    },
    min:{
        fontSize: 13,
        color: colors.contentSecondary
    }
  });