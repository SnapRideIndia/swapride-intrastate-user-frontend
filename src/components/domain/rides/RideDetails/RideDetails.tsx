import { View } from 'react-native';
import { SwText as Text } from '../../../../components/common/SwText/SwText';
import React from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './RideDetails.styles';

const RideDetails = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <View style={[styles.contentWrapper, styles.flexRow]}>
        <Text varient="bold" style={[styles.primaryFont, styles.title]}>
          Ride Details
        </Text>

        <View style={styles.shareContainer}>
          <Text varient="bold" style={[styles.primaryFont, styles.shareText]}>
            Share
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideDetails;
