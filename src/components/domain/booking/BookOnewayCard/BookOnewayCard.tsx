import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './BookOnewayCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../../constants/images';

interface BookOnewayCardProps {
  price?: string;
  onProceed?: () => void;
}

const BookOnewayCard = ({ price = '199', onProceed }: BookOnewayCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <Text variant="bold" style={styles.title}>
        Book One-way ride
      </Text>
      <View style={styles.infoRow}>
        <Image source={ImageSource.clock} style={styles.clockIcon} />
        <Text style={styles.infoText}>Free rescheduling,Cancel anytime</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text variant="bold" style={styles.price}>
          ₹{price}
        </Text>
        <PrimaryButton title="Proceed" onPress={onProceed} btnStyle={styles.proceedBtn} textStyle={styles.proceedBtnTitle} />
      </View>
    </View>
  );
};

export default BookOnewayCard;
