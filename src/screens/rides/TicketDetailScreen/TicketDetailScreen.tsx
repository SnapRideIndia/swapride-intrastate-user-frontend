import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TicketDetailScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { TicketCard } from '../../../components/domain/rides/TicketCard/TicketCard';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../constants/images';

const mockTicketData = {
  from: 'Location A',
  to: 'Location B',
  timeRange: '4:30 PM - 5:30 PM',
  busPlate: 'AB-09-2379',
  date: '23.08.24',
};

const TicketDetailScreen = ({
  route,
}: {
  route: RouteProp<RootStackParamList, typeof ScreenNames.TICKET_DETAIL_SCREEN>;
}) => {
  const { ticketId } = route.params || {};
  console.log('Ticket ID:', ticketId);
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [isActivated, setIsActivated] = useState(false);

  const handleActivateQR = () => {
    setIsActivated(true);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Your Ticket" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TicketCard
          {...mockTicketData}
          isActivated={isActivated}
          onActivate={handleActivateQR}
        />

        <PrimaryButton
          title="Scan Bus QR"
          onPress={() => console.log('Scan Bus QR')}
          btnStyle={styles.scanButton}
          renderRightIcon={() => (
            <Image source={ImageSource.scan} style={styles.scanIcon} />
          )}
        />

        <PrimaryButton
          title="View Bus Location"
          onPress={() => console.log('View Bus Location')}
          btnStyle={styles.locationButton}
          textStyle={styles.locationButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TicketDetailScreen;
