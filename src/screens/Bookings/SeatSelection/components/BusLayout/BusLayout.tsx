import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './BusLayout.styles';
import SwSeat from '../../../../../components/domain/booking/SwSeat/SwSeat';
import { SwText as Text } from '../../../../../components/common/SwText/SwText';

export interface ApiSeat {
  seatId: string;
  seatNumber: string;
  rowPosition: number;
  colPosition: number;
  seatType: 'SEATER' | 'SLEEPER' | 'DRIVER' | 'EMPTY' | string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED' | string;
}

interface BusLayoutProps {
  seats: ApiSeat[];
  selectedSeat: string | null;
  onSelectSeat: (seatNumber: string) => void;
}

const BusLayout: React.FC<BusLayoutProps> = ({ seats, selectedSeat, onSelectSeat }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  if (!seats || seats.length === 0) return null;

  const maxRow = Math.max(...seats.map(s => s.rowPosition));
  const maxCol = Math.max(...seats.map(s => s.colPosition));

  const rows = Array.from({ length: maxRow + 1 }, (_, i) => i);
  const columns = Array.from({ length: maxCol + 1 }, (_, i) => i);

  const getSeatAt = (row: number, col: number) => seats.find(s => s.rowPosition === row && s.colPosition === col);

  const renderCell = (row: number, col: number) => {
    const seat = getSeatAt(row, col);

    if (!seat || seat.seatType === 'EMPTY') {
      return <View key={`empty-${row}-${col}`} style={styles.column} />;
    }

    const isSelected = selectedSeat === seat.seatNumber;
    const isBooked = seat.status === 'BOOKED' || seat.status === 'HELD';
    const seatStatus = isSelected ? 'selected' : isBooked ? 'booked' : 'available';

    return (
      <View key={seat.seatId} style={styles.column}>
        <SwSeat
          status={seatStatus}
          label={seat.seatNumber}
          disabled={isBooked}
          onPress={() => !isBooked && onSelectSeat(seat.seatNumber)}
        />
      </View>
    );
  };

  const lastRow = rows[rows.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {columns.map(col => (
          <Text key={col} variant="semi-bold" style={styles.headerLabel}>
            {String.fromCharCode(65 + col)}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          {columns.map(col =>
            col === maxCol ? (
              <View key="driver-cell" style={[styles.column, { alignItems: 'center' }]}>
                <SwSeat status="driver" />
              </View>
            ) : (
              <View key={`driver-empty-${col}`} style={styles.column} />
            ),
          )}
          <View style={styles.sideIndicator} />
        </View>

        {rows.map(row => {
          const isFirst = row === rows[0];
          const isLast = row === lastRow;
          return (
            <View key={row} style={styles.row}>
              {columns.map(col => renderCell(row, col))}
              <View
                style={[
                  styles.sideIndicator,
                  {
                    backgroundColor: colors.background_gray,
                    borderTopLeftRadius: isFirst ? 16 : 0,
                    borderBottomLeftRadius: isLast ? 16 : 0,
                  },
                ]}
              >
                <Text variant="bold" style={styles.sideIndicatorText}>
                  {row + 1}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default BusLayout;
