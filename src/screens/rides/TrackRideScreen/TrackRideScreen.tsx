import { Image, TouchableOpacity, View, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef } from 'react';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useStyles } from './TrackRideScreen.style';
import { useTheme } from '../../../theme/ThemeProvider';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import TrackRideMap from '../../../components/domain/rides/TrackRideMap/TrackRideMap';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import RideDetails, { RideDetailsProps } from '../../../components/domain/rides/RideDetails/RideDetails';
import { DriverDetail } from '../../../components/domain/rides/DriverDetail/DriverDetail';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { Seperator } from '../../../components/common/Seperator/Seperator';
import { SwBottomSheet as BottomSheet } from '../../../components/common/BottomSheet/BottomSheet';
import { BottomSheetModal as BottomSheetType, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTrackRide, useDriverDetails } from '../../../hooks/useBooking';
import RouteAccordionItem, { RouteAccordionStep, RouteStepKind } from '../../../components/domain/fullRoute/RouteAccordionItem/RouteAccordionItem';

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
    avatar?: any;
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
    aboutDescription: 'Raja lives in Thane with his brother, who inspired him to take as a career. he has 3 years of experience.',
    avatar: null,
  },
};

const TrackRideScreen = ({ route }: { route: RouteProp<RootStackParamList, typeof ScreenNames.TRACK_RIDE_SCREEN> }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { ticketId } = route.params || {};
  const { data: trackData, isLoading: isTrackLoading, error: trackError } = useTrackRide(ticketId);
  const driverId = trackData?.trip?.driverId;
  const { data: driverData, isLoading: isDriverLoading } = useDriverDetails(driverId);
 
  React.useEffect(() => {
    if (trackData) {
      console.log('Track Ride API Response:', trackData);
    }
    if (trackError) {
      console.error('Track Ride API Error:', trackError);
    }
  }, [trackData, trackError]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const helpBottomSheetRef = useRef<BottomSheetType>(null);
  const stopsBottomSheetRef = useRef<BottomSheetType>(null);
  const [openStopId, setOpenStopId] = React.useState<string>('');
  
  const isSheetOpen = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSheetOpen.current) {
          helpBottomSheetRef.current?.dismiss();
          stopsBottomSheetRef.current?.dismiss();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, []),
  );

  React.useEffect(() => {
    if (trackData?.pickupPoint?.id && !openStopId) {
      setOpenStopId(trackData.pickupPoint.id);
    }
  }, [trackData, openStopId]);

  const stopsSteps = React.useMemo(() => {
    return trackData?.stops?.map((stop: any) => {
      const isPickup = stop.id === trackData?.pickupPoint?.id;
      const isDropoff = stop.id === trackData?.dropoffPoint?.id;
      
      return {
        id: stop.id,
        kind: isPickup ? 'pickup' : (isDropoff ? 'dropoff' : 'normal') as RouteStepKind,
        label: isPickup ? 'Pickup Stop' : (isDropoff ? 'Dropoff Stop' : undefined),
        title: stop.name,
        subtitle: stop.address,
        latitude: stop.latitude,
        longitude: stop.longitude,
        images: stop.images?.map((img: any) => ({ id: img.id, imageUrl: img.imageUrl })),
        showDirectionsCta: (isPickup || isDropoff) && !!stop.latitude && !!stop.longitude,
      };
    }) || [];
  }, [trackData?.stops, trackData?.pickupPoint?.id, trackData?.dropoffPoint?.id]);

  const handleRequestDetailTicket = () => {
    navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN, { ticketId });
  };

  const handleNeedHelp = () => {
    helpBottomSheetRef.current?.present();
  };

  const handleViewAllStops = (defaultOpenStopId?: string) => {
    if (defaultOpenStopId) {
      setOpenStopId(defaultOpenStopId);
    }
    stopsBottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Track Ride" />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TrackRideMap 
          encodedPolyline={trackData?.encodedPolyline}
          pickupPoint={trackData?.pickupPoint}
          dropoffPoint={trackData?.dropoffPoint}
          stops={trackData?.stops}
        />
        <View style={styles.contentContainer}>
          {/* Bus, Seat Details */}
          <View style={styles.flexRow}>
            <TouchableOpacity onPress={handleRequestDetailTicket} style={styles.justRow}>
              <Text variant="bold" style={[styles.fontColor, styles.fontFourteen]}>
                Show ticket to driver
              </Text>
              <Image source={ImageSource.chevron} style={[styles.chevronIcon, { tintColor: colors.contentPrimary }]} />
            </TouchableOpacity>

            <View style={styles.flexRow}>
              <View style={styles.flexRow}>
                <Image style={styles.imageSize} source={ImageSource.busYellow} />
                <Text variant="bold" style={[styles.fontFourteen, styles.fontColor]}>
                  {trackData?.bus?.busNumber || '-'}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Image style={styles.imageSize} source={ImageSource.SeatYellow} />
                <Text variant="bold" style={[styles.fontFourteen, styles.fontColor]}>
                  {trackData?.booking?.assignedSeats?.join(', ') || '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* Pickup Time Content */}
          <View style={styles.pickupContainer}>
            <View style={styles.justRow}>
              <Text style={[styles.fontColor, styles.fontEighteen]}>{trackData?.smartStatus?.header || ''}</Text>
              <View style={styles.badge}>
                <Text variant="bold" style={styles.fontFourteen}>
                  {trackData?.smartStatus?.time || '--:--'}
                </Text>
              </View>
            </View>

            <Text variant="bold" style={[styles.fontColor, styles.fontSixteen]}>
              {trackData?.smartStatus?.description || 'Loading tracking info...'}
            </Text>
          </View>

          <PrimaryButton
            title="Need Help"
            btnStyle={styles.buttonStyle}
            onPress={handleNeedHelp}
            renderLeftIcon={() => <Image source={ImageSource.chatIcon} style={styles.chatIcon} />}
          />
        </View>

        <Seperator height={4} />

        {/* Ride Details */}
        <RideDetails
          pickupData={{
            id: trackData?.pickupPoint?.id,
            time: (trackData?.stops?.find((s: any) => s.id === trackData?.pickupPoint?.id)?.arrivalTime 
              ? new Date(trackData.stops.find((s: any) => s.id === trackData.pickupPoint.id).arrivalTime)
                  .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                  .toLowerCase() 
              : ''),
            title: trackData?.pickupPoint?.name || '',
            description: trackData?.pickupPoint?.address || '',
            images: trackData?.pickupPoint?.images,
          }}
          dropoffData={{
            id: trackData?.dropoffPoint?.id,
            time: (trackData?.stops?.find((s: any) => s.id === trackData?.dropoffPoint?.id)?.arrivalTime 
              ? new Date(trackData.stops.find((s: any) => s.id === trackData.dropoffPoint.id).arrivalTime)
                  .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                  .toLowerCase() 
              : ''),
            title: trackData?.dropoffPoint?.name || '',
            description: trackData?.dropoffPoint?.address || '',
            images: trackData?.dropoffPoint?.images,
          }}
          onViewAllStops={handleViewAllStops}
        />
        <Seperator height={4} />

        {/* Driver Detail */}
        <DriverDetail 
          name={driverData?.name || ''}
          bookingId={ticketId}
          driverId={driverId}
          avatar={driverData?.profileUrl ? { uri: driverData.profileUrl } : null}
          phone={driverData?.mobileNumber}
          rating={driverData?.rating}
        />
      </ScrollView>

      <BottomSheet 
        ref={helpBottomSheetRef} 
        title="Need Help"
        onChange={(index) => (isSheetOpen.current = index >= 0)}
      >
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <Image source={ImageSource.call} style={styles.helpIcon} />
          </View>
          <View style={styles.helpTextContainer}>
            <Text variant="bold" style={styles.helpTitle}>
              Call customer support - 9063776655
            </Text>
            <Text variant="regular" style={styles.helpSubtext}>
              Facing an issue? Speak to someone at Swapride
            </Text>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet 
        ref={stopsBottomSheetRef} 
        title="All Stops" 
        snapPoints={['100%']}
        onChange={(index) => (isSheetOpen.current = index >= 0)}
      >
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 0 }}>
            {stopsSteps.map((step: RouteAccordionStep, index: number) => (
              <RouteAccordionItem
                key={step.id}
                step={step}
                isOpen={openStopId === step.id}
                isFirst={index === 0}
                isLast={index === stopsSteps.length - 1}
                onToggle={() => setOpenStopId(prev => (prev === step.id ? '' : step.id))}
              />
            ))}
          </View>
          {stopsSteps.length === 0 && <Text variant="medium" style={{ padding: 20 }}>Stops content will be added here later.</Text>}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default TrackRideScreen;
