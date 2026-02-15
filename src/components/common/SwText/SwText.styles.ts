import { StyleSheet } from 'react-native';
import { getFontFamilyByFW } from './SwText';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType, varient: 'regular' | 'bold' | 'semi-bold' | 'medium') => StyleSheet.create({
    textStyle: {
        fontFamily: getFontFamilyByFW(varient),
        color: colors.contentPrimary,
        fontSize: 14
    }
});
