import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) => StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    pinCodeContainer: {
        width: 42,
        height: 42,
      borderWidth: 0,
      borderBottomWidth: 1,
        borderColor: colors.contentDisabled,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pinCodeText: {
        fontSize: 16,
        color: colors.contentPrimary,
        textAlign: 'center',
    },
    focusStick: {
        backgroundColor: colors.contentPrimary,
        height: 16,
    },
    activePinCodeContainer: {
        borderColor: colors.primary,
    },
    placeholderText: {
        color: colors.contentSecondary,
    },
    filledPinCodeContainer: {
        borderColor: colors.contentPrimary,
    },
    disabledPinCodeContainer: {
        backgroundColor: colors.contentDisabled,
    },
});