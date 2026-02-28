import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './TransactionCard.styles';
import { formatTransactionDate } from '../../../../../utils/dateUtils';

interface ITransactionCardProps {
  type: 'Credit' | 'Debit';
  amount: number;
  date: number | string;
}

const TransactionCard = ({ type, amount, date }: ITransactionCardProps) => {
  const { colors } = useTheme();
  const transactionType = type.toLowerCase() as 'credit' | 'debit';
  const styles = useStyles(colors, transactionType);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text varient="medium" style={styles.typeText}>
          {type}
        </Text>
        <Text varient="bold" style={styles.amountText}>
          {transactionType === 'credit' ? '+ ' : '- '}₹{amount}
        </Text>
      </View>
      <Text varient="regular" style={styles.dateText}>
        {formatTransactionDate(date)}
      </Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({});
