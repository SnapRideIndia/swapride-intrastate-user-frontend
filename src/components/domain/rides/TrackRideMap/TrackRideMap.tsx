import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TrackRideMap.styles';

const TrackRideMap = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.container}>
      <Text>Map View Here</Text>
    </View>
  );
};

export default TrackRideMap;
