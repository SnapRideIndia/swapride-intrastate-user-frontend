import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './HistoryScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import HistoryCard from '../../../components/domain/history/card/HistoryCard/HistoryCard';

const mockData = [
  {
    ticketId: '1234567890',
    seatNumber: 'C123',
    date: '01.01.2026',
    amount: '100.00',
    fromLocation: 'Chikkadpally Hyderabad, telangana',
    toLocation: 'Uppal, telanagana hyderabad',
    fromTime: '4:05 AM',
    toTime: '4:05 AM',
  },
  {
    ticketId: '12345678902',
    seatNumber: 'C123',
    date: '01.01.2026',
    amount: '100.00',
    fromLocation: 'Chikkadpally Hyderabad, telangana',
    toLocation: 'Uppal, telanagana hyderabad',
    fromTime: '4:05 AM',
    toTime: '4:05 AM',
  },
];

const HistoryScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="History" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {mockData.map((item, index) => (
          <HistoryCard key={index} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
