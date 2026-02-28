import {
  Image,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef } from 'react';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useStyles } from './TrackRideScreen.style';
import { useTheme } from '../../../theme/ThemeProvider';
import { RouteProp } from '@react-navigation/native';
import TrackRideMap from '../../../components/domain/rides/TrackRideMap/TrackRideMap';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import RideDetails, {
  RideDetailsProps,
} from '../../../components/domain/rides/RideDetails/RideDetails';
import { DriverDetail } from '../../../components/domain/rides/DriverDetail/DriverDetail';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { Seperator } from '../../../components/common/Seperator/Seperator';
import { SwBottomSheet as BottomSheet } from '../../../components/common/BottomSheet/BottomSheet';
import { BottomSheetModal as BottomSheetType } from '@gorhom/bottom-sheet';

interface TrackRideMockData {
  busNo: string;
  seatNo: string;
  pickupTime: string;
  statusMessage: string;
  rideDetails: RideDetailsProps;
  driverData: {
    name: string;
    plate: string;
    experience: string;
    languages: string;
    location: string;
    aboutDescription: string;
  };
}

const mockTrackRideData: TrackRideMockData = {
  busNo: 'C123',
  seatNo: '5B',
  pickupTime: '8:37 am',
  statusMessage: 'Bus is on its way. Last crossed stop is Lodha Splendora.',
  rideDetails: {
    pickupData: {
      time: '9:00 am',
      title: 'Peninsula Corporate Park',
      description: 'In front of Matula cnter, under the fly over',
    },
    dropoffData: {
      time: '10:30 am',
      title: 'Business Hub Central',
      description: 'Main Gate, near the security post',
    },
  },
  driverData: {
    name: 'Mr. Raja Das',
    plate: '( MH-00-AB-1234 )',
    experience: '9 years exp',
    languages: 'Hindi, English',
    location: 'Assam',
    aboutDescription:
      'Raja lives in Thane with his brother, who inspired him to take as a career. he has 3 years of experience.',
  },
};

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

  const helpBottomSheetRef = useRef<BottomSheetType>(null);
  const stopsBottomSheetRef = useRef<BottomSheetType>(null);

  const handleRequestDetailTicket = () => {
    navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN, { ticketId });
  };

  const handleNeedHelp = () => {
    helpBottomSheetRef.current?.present();
  };

  const handleViewAllStops = () => {
    stopsBottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Track Ride" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
                source={ImageSource.chevron}
                style={[
                  styles.chevronIcon,
                  { tintColor: colors.contentPrimary },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.flexRow}>
              <View style={styles.flexRow}>
                <Image
                  style={styles.imageSize}
                  source={ImageSource.busYellow}
                />
                <Text
                  varient="bold"
                  style={[styles.fontFourteen, styles.fontColor]}
                >
                  {mockTrackRideData.busNo}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Image
                  style={styles.imageSize}
                  source={ImageSource.SeatYellow}
                />
                <Text
                  varient="bold"
                  style={[styles.fontFourteen, styles.fontColor]}
                >
                  {mockTrackRideData.seatNo}
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
                  {mockTrackRideData.pickupTime}
                </Text>
              </View>
            </View>

            <Text varient="bold" style={[styles.fontColor, styles.fontSixteen]}>
              {mockTrackRideData.statusMessage}
            </Text>
          </View>

          <PrimaryButton
            title="Need Help"
            btnStyle={styles.buttonStyle}
            onPress={handleNeedHelp}
            renderLeftIcon={() => (
              <Image source={ImageSource.chatIcon} style={styles.chatIcon} />
            )}
          />
        </View>

        <Seperator height={4} />

        {/* Ride Details */}
        <RideDetails
          {...mockTrackRideData.rideDetails}
          onViewAllStops={handleViewAllStops}
        />
        <Seperator height={4} />

        {/* Driver Detail */}
        <DriverDetail {...mockTrackRideData.driverData} />
      </ScrollView>

      <BottomSheet ref={helpBottomSheetRef} title="Need Help">
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <Image source={ImageSource.call} style={styles.helpIcon} />
          </View>
          <View style={styles.helpTextContainer}>
            <Text varient="bold" style={styles.helpTitle}>
              Call customer support - 9063776655
            </Text>
            <Text varient="regular" style={styles.helpSubtext}>
              Facing an issue? Speak to someone at Swapride
            </Text>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet ref={stopsBottomSheetRef} title="All Stops">
        <View style={{ padding: 20 }}>
          <Text varient="medium">Stops content will be added here later.</Text>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default TrackRideScreen;
