import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './BookingSuccess.styles';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { ImageSource } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingSuccess = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <PrimaryHeader title="" />

      <View style={styles.content}>
        <Image source={ImageSource.checkCircle} style={styles.successIcon} />
        <Text variant="bold" style={styles.title}>
          Ride Booked Successfully
        </Text>
        <Text style={styles.subtitle}>Your shuttle ride has been successfully booked.</Text>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PrimaryButton title="View ticket" onPress={() => console.log('View ticket')} btnStyle={styles.viewTicketBtn} />
        <PrimaryButton
          title="view ride"
          onPress={() => navigation.popToTop()}
          btnStyle={styles.viewRideBtn}
          textStyle={styles.viewRideBtnText}
        />
      </SafeAreaView>
    </View>
  );
};

export default BookingSuccess;
