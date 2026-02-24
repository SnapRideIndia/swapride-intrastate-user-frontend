import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './TransactionCard.styles';

interface ITransactionCardProps {
  type: 'Credit' | 'Debit';
  amount: number;
  date: number;
}

// Remove later or move to centralized utils
const formatDate = (date: number) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  let hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 -> 12
  const minuteStr = minute.toString().padStart(2, '0');

  return `${day} ${monthName} ${year} . ${hour.toString().padStart(2, '0')}:${minuteStr} ${ampm}`;
};

const TransactionCard = ({ type, amount, date }: ITransactionCardProps) => {
  const { colors } = useTheme();
  const transactionType = type.toLowerCase() as 'credit' | 'debit';
  const styles = useStyles(colors, transactionType);

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text varient="medium" style={styles.typeText}>{type}</Text>
        <Text varient="bold" style={styles.amountText}>
          {transactionType === 'credit' ? '+ ' : '- '}₹{amount}
        </Text>
      </View>
      <Text varient="regular" style={styles.dateText}>{formatDate(date)}</Text>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({});
