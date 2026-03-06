import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BookingOptions.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import BookOnewayCard from '../../../components/domain/booking/BookOnewayCard/BookOnewayCard';
import ReturnRideCard from '../../../components/domain/booking/ReturnRideCard/ReturnRideCard';
import { ScreenNames } from '../../../navigation/constant';

const BookingOptions = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const handleProceedOneway = () => {
    navigation.navigate(ScreenNames.CONFIRM_BOOKING_DETAILS as never);
  };

  const handleShowReturnBuses = () => {
    
    navigation.navigate(ScreenNames.CONFIRM_BOOKING_DETAILS as never);
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="" />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <BookOnewayCard price="199" onProceed={handleProceedOneway} />
          <ReturnRideCard onShowBuses={handleShowReturnBuses} />
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingOptions;
