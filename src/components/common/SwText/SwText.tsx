import { Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SwText.styles';


interface IProps {
    varient: 'regular' | 'bold' | 'semi-bold' | 'medium',
    children: React.ReactNode,
    style: StyleProp<TextStyle>,
    numberOfLines: number,
    onPress: () => void
}
export const getFontFamilyByFW = (type: string) => {
    switch (type) {
        case 'bold':
            return 'Inter-Bold';
        case 'semi-bold':
            return 'Inter-SemiBold';
        case 'medium':
            return 'Inter-Medium';
        default:
            return 'Inter-Regular';
    }
}

export const SwText = ({ varient = 'regular', children, style, numberOfLines }: Partial<IProps>) => {
    const { colors } = useTheme();
    const styles = useStyles(colors, varient);
    return (
        <Text
            numberOfLines={numberOfLines}
            style={[styles.textStyle, style]}
        >{children}</Text>
    )
}
