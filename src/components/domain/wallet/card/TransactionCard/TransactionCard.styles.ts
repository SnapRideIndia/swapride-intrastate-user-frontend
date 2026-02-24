import { StyleSheet } from "react-native";
import { ColorsType } from "../../../../../constants/ui/colors/colors.types";

type TransactionType = 'credit' | 'debit';

export const useStyles = (colors: ColorsType, transactionType: TransactionType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
    },

    upperContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    typeText: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    amountText: {
      fontSize: 16,
      color: transactionType === 'credit' ? colors.contentGreen : colors.contentRed,
    },

    dateText: {
      fontSize: 13,
      color: colors.contentSecondary,
    },
  });
