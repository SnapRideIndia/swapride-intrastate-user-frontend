import { View } from 'react-native';
import React from 'react';
import { SwText as Text } from '../../../../common/SwText/SwText';
import { useStyles } from './BalanceCard.styles';
import { useTheme } from '../../../../../theme/ThemeProvider';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';

interface IBalanceCardProps {
  balance: number;
  onAddMoney?: () => void;
}
const BalanceCard = ({ balance, onAddMoney }: IBalanceCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Text varient="semi-bold" style={styles.cardTitle}>
        Current Balance
      </Text>
      <Text varient="semi-bold" style={styles.balanceText}>
        ₹ {balance}
      </Text>
      <PrimaryButton
        btnStyle={styles.buttonStyles}
        textStyle={styles.buttonTextStyles}
        title="Add Money"
        onPress={onAddMoney}
      />
    </View>
  );
};

export default BalanceCard;
