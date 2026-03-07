import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SeatSelection.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import BusLayout from './components/BusLayout/BusLayout';

const SeatSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [selectedSeat, setSelectedSeat] = useState<string | null>('7B');

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Select a seat" />

      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.content}>
        <BusLayout selectedSeat={selectedSeat} onSelectSeat={id => setSelectedSeat(id)} />
      </ScrollView>

      <View style={styles.selectionContainer}>
        <Text variant="medium" style={styles.selectionText}>
          {selectedSeat ? `you have selected the seat ${selectedSeat} !` : 'Please select a seat'}
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="Confirm Seat" onPress={() => {}} />
      </View>
    </View>
  );
};

export default SeatSelection;
