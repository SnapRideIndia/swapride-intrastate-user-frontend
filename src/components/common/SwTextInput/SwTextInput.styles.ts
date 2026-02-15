import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';
import { getFontFamilyByFW } from '../SwText/SwText';

export const useStyles = (colors: ColorsType) => StyleSheet.create({
    inputOuterContainer:{
        flex:1,
    },
    iconWithTitle:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    inputInnerContainer:{
        marginTop: 5,
        paddingBottom: 7,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    phNoStyle:{
        flexDirection: "row",
        gap: 5
    },
    inputStyle:{
        flex:1,
        height: 40,
    },
    title:{
        fontSize: 14,
        color: colors.primary
    }
});
