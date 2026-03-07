import React, { useState } from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
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
import { useTicketDetail } from '../../../hooks/useBooking';
import { SwText as Text } from '../../../components/common/SwText/SwText';

const TicketDetailScreen = ({ route }: { route: RouteProp<RootStackParamList, typeof ScreenNames.TICKET_DETAIL_SCREEN> }) => {
  const { ticketId } = route.params || {};
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const { data: ticketData, isLoading, error } = useTicketDetail(ticketId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PrimaryHeader title="Your Ticket" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !ticketData) {
    return (
      <SafeAreaView style={styles.container}>
        <PrimaryHeader title="Your Ticket" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text>Failed to load ticket details.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { route: routeInfo, bus, booking } = ticketData;

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Your Ticket" />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <TicketCard
          from={routeInfo.from}
          to={routeInfo.to}
          timeRange={routeInfo.timeRange}
          busPlate={bus.registrationNumber}
          date={routeInfo.date}
          qrToken={ticketData.qrCodeToken}
        />

        <PrimaryButton
          title="Scan Bus QR"
          onPress={() => console.log('Scan Bus QR')}
          btnStyle={styles.scanButton}
          renderRightIcon={() => <Image source={ImageSource.scan} style={styles.scanIcon} />}
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
