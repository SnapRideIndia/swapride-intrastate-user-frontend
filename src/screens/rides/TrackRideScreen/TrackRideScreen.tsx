import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useStyles } from './TrackRideScreen.style';
import { useTheme } from '../../../theme/ThemeProvider';
import { RouteProp } from '@react-navigation/native';
import TrackRideMap from '../../../components/domain/rides/TrackRideMap/TrackRideMap';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import RideDetails from '../../../components/domain/rides/RideDetails/RideDetails';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';

const TrackRideScreen = ({
  route,
}: {
  route: RouteProp<RootStackParamList, typeof ScreenNames.TRACK_RIDE_SCREEN>;
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { ticketId } = route.params || {};
  console.log(ticketId);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRequestDetailTicket = () => {
    navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN, { ticketId });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Track Ride" />
      <TrackRideMap />
      <View style={styles.contentContainer}>
        {/* Bus, Seat Details */}
        <View style={styles.flexRow}>
          <TouchableOpacity
            onPress={handleRequestDetailTicket}
            style={styles.justRow}
          >
            <Text
              varient="bold"
              style={[styles.fontColor, styles.fontFourteen]}
            >
              Show ticket to driver
            </Text>
            <Image
              source={ImageSource.leftArrow}
              style={[styles.chevronIcon, { tintColor: colors.contentPrimary }]}
            />
          </TouchableOpacity>

          <View style={styles.flexRow}>
            <View style={styles.flexRow}>
              <Image style={styles.imageSize} source={ImageSource.busYellow} />
              <Text
                varient="bold"
                style={[styles.fontFourteen, styles.fontColor]}
              >
                C123
              </Text>
            </View>
            <View style={styles.flexRow}>
              <Image style={styles.imageSize} source={ImageSource.SeatYellow} />
              <Text
                varient="bold"
                style={[styles.fontFourteen, styles.fontColor]}
              >
                5B
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup Time Content */}
        <View style={styles.pickupContainer}>
          <View style={styles.justRow}>
            <Text style={[styles.fontColor, styles.fontEighteen]}>
              Pickup at
            </Text>
            <View style={styles.badge}>
              <Text varient="bold" style={styles.fontFourteen}>
                8:37 am
              </Text>
            </View>
          </View>

          <Text varient="bold" style={[styles.fontColor, styles.fontSixteen]}>
            Bus is on its way. Last crossed stop is Lodha Splendora.
          </Text>
        </View>

        <PrimaryButton title="Need Help" btnStyle={styles.buttonStyle} />
      </View>

      {/* Ride Details */}
      <RideDetails />
    </SafeAreaView>
  );
};

export default TrackRideScreen;
