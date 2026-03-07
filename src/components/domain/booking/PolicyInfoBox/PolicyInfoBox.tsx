import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './PolicyInfoBox.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';

const PolicyInfoBox = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={ImageSource.clock} style={styles.icon} />
        <Text style={styles.text}>Reschedule your ride anytime - vehicle timings, stops or seat at no extra cost</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.currencyIconContainer}>
          <Text variant="bold" style={styles.currencyIcon}>
            ₹
          </Text>
        </View>
        <Text style={styles.text}>Cancel more than 30 minutes before your ride & get the full refund to your swapride wallet</Text>
      </View>
    </View>
  );
};

export default PolicyInfoBox;
