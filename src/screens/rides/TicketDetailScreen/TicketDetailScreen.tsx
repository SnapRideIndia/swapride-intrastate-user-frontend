import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './TicketDetailScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { RouteProp, useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();

  const { data: ticketData, isLoading, error } = useTicketDetail(ticketId);

  useEffect(() => {
    if (ticketData) {
      console.log('Ticket Response ===>', JSON.stringify(ticketData, null, 2));
    }
  }, [ticketData]);

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
          busPlate={bus.registrationNumber}
          seatNumbers={booking?.seats || []}
          date={routeInfo.date}
          qrToken={ticketData.qrCodeToken}
        />

        <PrimaryButton
          title="Scan Bus QR"
          onPress={() => navigation.navigate(ScreenNames.SELF_BOARD_SCANNER, { ticketId })}
          btnStyle={styles.scanButton}
          renderRightIcon={() => <Image source={ImageSource.scan} style={styles.scanIcon} />}
        />

        <PrimaryButton
          title="View Bus Location"
          onPress={() => navigation.navigate(ScreenNames.TRACK_RIDE_SCREEN, { ticketId })}
          btnStyle={styles.locationButton}
          textStyle={styles.locationButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TicketDetailScreen;
