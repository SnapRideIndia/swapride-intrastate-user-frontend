import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container:{
       
    },
    header:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        padding: 20,
        paddingBottom: 18,
        borderColor: colors.border_1
    },
    crossIcon:{
        width: 18,
        height: 18
    },
    title:{
        fontSize: 20,
    },
    otpContainer:{
        marginTop: 40,
        paddingHorizontal: 20,
        gap: 25
    },
    resendOtpContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    callIcon:{
        width: 17,
        height: 17
    },
    resend:{
        fontSize: 16,
        color: colors.primary,
    },
    spacer: {
      flex: 1,
    },
      buttonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
  });