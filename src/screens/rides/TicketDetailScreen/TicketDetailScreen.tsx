import React from 'react';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TicketDetailScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';

const TicketDetailScreen = ({
  route,
}: {
  route: RouteProp<RootStackParamList, typeof ScreenNames.TICKET_DETAIL_SCREEN>;
}) => {
  const { ticketId } = route.params || {};
  console.log('Ticket ID:', ticketId);
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Your Ticket" />
    </SafeAreaView>
  );
};

export default TicketDetailScreen;
