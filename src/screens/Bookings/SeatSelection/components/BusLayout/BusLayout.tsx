import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './BusLayout.styles';
import SwSeat from '../../../../../components/domain/booking/SwSeat/SwSeat';
import { SwText as Text } from '../../../../../components/common/SwText/SwText';

interface BusLayoutProps {
  selectedSeat: string | null;
  onSelectSeat: (seatId: string) => void;
}

const BusLayout: React.FC<BusLayoutProps> = ({ selectedSeat, onSelectSeat }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const bookedSeats = ['2C', '2D', '6D'];

  const renderSeat = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    const status = selectedSeat === seatId ? 'selected' : bookedSeats.includes(seatId) ? 'booked' : 'available';

    return <SwSeat key={seatId} status={status} label={seatId} onPress={() => onSelectSeat(seatId)} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="bold" style={styles.headerLabel}>
          D
        </Text>
        <Text variant="bold" style={styles.headerLabel}>
          C
        </Text>
        <Text variant="bold" style={styles.headerLabel}>
          E
        </Text>
        <Text variant="bold" style={styles.headerLabel}>
          B
        </Text>
        <Text variant="bold" style={styles.headerLabel}>
          A
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.sideIndicatorContainer} />

      <View style={[styles.row, { paddingLeft: 32, paddingRight: 0, marginTop: 8, marginBottom: 14 }]}>
        <View style={styles.column} />
        <View style={styles.column} />
        <View style={styles.column} />
        <View style={styles.column} />
        <View style={styles.column}>
          <SwSeat status="driver" />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.grid}>
        {rows.map(row => (
          <View key={row} style={styles.row}>
            <View style={styles.column}>{renderSeat(row, 'D')}</View>
            <View style={styles.column}>{renderSeat(row, 'C')}</View>

            <View style={styles.column}>{row === 9 ? renderSeat(row, 'E') : <View style={styles.aisle} />}</View>

            <View style={styles.column}>{renderSeat(row, 'B')}</View>
            <View style={styles.column}>{renderSeat(row, 'A')}</View>

            <View style={styles.sideIndicator}>
              <Text variant="bold" style={styles.sideIndicatorText}>
                {row}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BusLayout;
