import { ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';
import { useStyles } from './HomeScreen.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import HomeScreenHeader from '../../../components/domain/home/SwHeader/HomeScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../../../components/domain/home/card/OptionCard/OptionCard';
import { ImageSource } from '../../../constants/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ScreenNames } from '../../../navigation/constant';
import { useMyBookings } from '../../../hooks/useBooking';
import { MyBookingType } from '../../../types/booking.types';
import BookingCard from '../../../components/domain/booking/card/BookingCard/BookingCard';
import { format } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profileData } = useSelector((store: RootState) => store.profile);

  const { data: bookings } = useMyBookings(MyBookingType.UPCOMING);
  
  const upcomingRide = bookings?.pages?.[0]?.data?.[0];

  console.log('this is profile data ===>', profileData);

  const handlePressOptionCard = (type: 'shuttel' | 'wallet' | 'ticket') => {
    switch (type) {
      case 'shuttel':
        if (profileData?.isOnboarded) {
          navigation.navigate(ScreenNames.FIND_COMMUTE as never);
        } else {
          navigation.navigate(ScreenNames.SET_COMMUTE as never);
        }
        break;

      case 'wallet':
        navigation.navigate(ScreenNames.WALLET_SCREEN as never);
        break;

      default:
        navigation.navigate(ScreenNames.TICKETS_SCREEN as never);
        break;
    }
  };

  useEffect(() => {
    const renderHeader = () => <HomeScreenHeader />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  const renderUpcomingRide = () => {
    if (!upcomingRide) return null;

    const departureDate = upcomingRide.trip?.departureTime || upcomingRide.createdAt;
    const formattedDate = departureDate ? format(new Date(departureDate), 'dd.MM.yyyy') : '--. --. ----';
    
    const fromTime = upcomingRide.trip?.departureTime 
      ? format(new Date(upcomingRide.trip.departureTime), 'hh:mm a') 
      : '--:--';
    
    const toTime = upcomingRide.trip?.arrivalTime 
      ? format(new Date(upcomingRide.trip.arrivalTime), 'hh:mm a') 
      : '--:--';

    return (
      <View style={styles.upcomingSection}>
        <Text style={styles.optionCardContainerTitle} variant="semi-bold">
          Upcoming Rides
        </Text>
        <BookingCard
          bookingId={upcomingRide.id}
          seatNumber={upcomingRide.seatNumbers && upcomingRide.seatNumbers.length > 0 ? upcomingRide.seatNumbers.join(', ') : `x${upcomingRide.seatCount}`}
          date={formattedDate}
          fromLocation={upcomingRide.pickup}
          toLocation={upcomingRide.dropoff}
          fromTime={fromTime}
          toTime={toTime}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.upperSection}>
          <Text style={styles.title}>Choose your commute options</Text>
          <OptionCard imgUri={ImageSource.shuttel} title="Shuttle" onPress={() => handlePressOptionCard('shuttel')} />
        </View>
        <View style={styles.lowerSection}>
          <Text style={styles.optionCardContainerTitle} variant="semi-bold">
            Your Active Wallet
          </Text>
          <View style={styles.optionCardContainer}>
            <OptionCard imgUri={ImageSource.ticket} title="Tickets" onPress={() => handlePressOptionCard('ticket')} />
            <OptionCard imgUri={ImageSource.wallet} title="Wallet" onPress={() => handlePressOptionCard('wallet')} />
          </View>

          {renderUpcomingRide()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
