import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './BusSelectionCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../../components/common/SwText/SwText';
import PrimaryButton from '../../../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../../navigation/constant';
import { RootStackParamList } from '../../../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SwBottomSheet } from '../../../../../components/common/BottomSheet/BottomSheet';
import { ICommute, Timing } from '../../../../../types/commute.types';
import { BottomSheetBackdrop, BottomSheetModal, type BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { formatTime } from '../../../../../utils/dateUtils';

interface IBusSelectionCard {
  showLabel: boolean;
  data: ICommute;
  onProceed?: (timing: Timing) => void;
}

const BusSelectionCard = ({ showLabel = false, data, onProceed }: IBusSelectionCard) => {
  const [showSourceStopImages, setShowSourceStopImages] = useState(false);
  const [showDestinationImages, setShowDestinationImages] = useState(false);
  const timingsSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(data.timings?.[0]?.tripId ?? null);

  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const timeSheetRef = useRef<BottomSheetModal>(null);

  const selectedTiming = useMemo(
    () => data.timings?.find(t => t.tripId === selectedTripId) || data.timings?.[0],
    [data.timings, selectedTripId],
  );

  const openDirections = useCallback((lat?: number, lng?: number) => {
    if (typeof lat === 'number' && typeof lng === 'number') {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url);
    }
  }, []);

  const handleOpenPickupDirections = useCallback(() => {
    openDirections(data.pickup?.latitude, data.pickup?.longitude);
  }, [openDirections, data.pickup?.latitude, data.pickup?.longitude]);

  const handleOpenDropoffDirections = useCallback(() => {
    openDirections(data.dropoff?.latitude, data.dropoff?.longitude);
  }, [openDirections, data.dropoff?.latitude, data.dropoff?.longitude]);

  const handlePressBtn = () => {
    if (selectedTiming && onProceed) {
      onProceed(selectedTiming);
    }
  };

  const handleViewFullRoute = (initialOpenId?: string) => {
    navigation.navigate(ScreenNames.FULL_ROUTE_SCREEN, { tripData: data, initialOpenId });
  };

  const openTimingsSheet = useCallback(() => {
    timingsSheetRef.current?.present();
  }, []);

  const closeTimingsSheet = useCallback(() => {
    timingsSheetRef.current?.dismiss();
  }, []);

  const handleSelectTiming = (tripId: string) => {
    setSelectedTripId(tripId);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    [],
  );

  return (
    <View style={styles.container}>
      {/* top pick section */}
      {showLabel && data.nearestPoint && (
        <View style={styles.topPickHeader}>
          <View style={styles.topPickHeaderTitleContainer}>
            <Image source={ImageSource.starBadge} style={styles.starBadgeIcon} />
            <Text variant="bold" style={styles.topPickStyle}>
              {' '}
              Top pick for you
            </Text>
          </View>
          <Text style={styles.topPickDesc}>
            {data.nearestPoint.proximityMessage}
          </Text>
        </View>
      )}
      {/* bottom main card Section */}
      <View style={[styles.mainCard, showLabel && { marginTop: -15 }]}>
        <View style={styles.fromToContainer}>
          <View style={styles.badgeAndDeviderContainer}>
            <View style={styles.badge}>
              <Text variant="medium" style={styles.time}>
                {selectedTiming?.pickupArrivalTime ? formatTime(selectedTiming.pickupArrivalTime) : '--:--'}
              </Text>
            </View>
            <View style={styles.devider} />
            <View style={styles.badge}>
              <Text variant="medium" style={styles.time}>
                {selectedTiming?.dropoffArrivalTime ? formatTime(selectedTiming.dropoffArrivalTime) : '--:--'}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, gap: 15 }}>
            <View style={styles.place}>
              <Text variant="bold" style={styles.placeTitle}>
                {data.pickup?.name}
              </Text>
              <Text variant="medium" style={styles.placeSubtitle}>
                {data.pickup?.address}
              </Text>
              <View style={styles.walkAndDirectionRow}>
                <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowSourceStopImages(prev => !prev)}>
                  <Image
                    source={data.pickup?.travelType === 'WALK' ? ImageSource.walkIcon : ImageSource.car}
                    style={styles.walkIcon}
                    resizeMode="contain"
                  />
                  <Text variant="semi-bold" style={styles.placeSubtitle}>
                    {data.pickup?.travelTime && data.pickup?.distance
                      ? `${data.pickup.travelTime} ${data.pickup.travelType?.toLowerCase() ?? ''} (${data.pickup.distance})`
                      : data.pickup?.distance ?? '-'}
                  </Text>
                  <Image source={ImageSource.downArrow} style={styles.downArrow} />
                </TouchableOpacity>
                {showSourceStopImages && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.directionButton}
                    onPress={handleOpenPickupDirections}
                  >
                    <Image source={ImageSource.direction} style={styles.directionIcon} />
                    <Text variant="medium" style={styles.directionText}>
                      Direction
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {showSourceStopImages && (
                <>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.sourceImagesContainer}>
                    {(data.pickup?.images?.length ? data.pickup.images : [{ id: 'placeholder-pickup', imageUrl: '' }]).map((img, idx) =>
                      img.imageUrl ? (
                        <Image key={img.id || `img-${idx}`} source={{ uri: img.imageUrl }} style={styles.stopImage} />
                      ) : (
                        <View key={img.id || `img-${idx}`} style={styles.stopImagePlaceholder} />
                      ),
                    )}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => handleViewFullRoute(data.pickup?.pointId)}
                    activeOpacity={0.8}
                    style={styles.viewFullRouteContainer}
                  >
                    <View style={styles.locationConnectionContainer}>
                      <View style={styles.connectionLine} />
                      <Image source={ImageSource.locationConnection} style={styles.locationConnectionIcon} />
                    </View>
                    <Text>View full route</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.place}>
              <Text variant="bold" style={styles.placeTitle}>
                {data.dropoff?.name}
              </Text>
              <Text variant="medium" style={styles.placeSubtitle}>
                {data.dropoff?.address}
              </Text>
              <View style={styles.walkAndDirectionRow}>
                <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowDestinationImages(prev => !prev)}>
                  <Image
                    source={data.dropoff?.travelType === 'WALK' ? ImageSource.walkIcon : ImageSource.car}
                    style={styles.walkIcon}
                    resizeMode="contain"
                  />
                  <Text variant="semi-bold" style={styles.placeSubtitle}>
                    {data.dropoff?.travelTime && data.dropoff?.distance
                      ? `${data.dropoff.travelTime} ${data.dropoff.travelType?.toLowerCase() ?? ''} (${data.dropoff.distance})`
                      : data.dropoff?.distance ?? '-'}
                  </Text>
                  <Image source={ImageSource.downArrow} style={styles.downArrow} />
                </TouchableOpacity>
                {showDestinationImages && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.directionButton}
                    onPress={handleOpenDropoffDirections}
                  >
                    <Image source={ImageSource.direction} style={styles.directionIcon} />
                    <Text variant="medium" style={styles.directionText}>
                      Direction
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {showDestinationImages && (
                <>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.sourceImagesContainer}>
                    {(data.dropoff?.images?.length ? data.dropoff.images : [{ id: 'placeholder-dropoff', imageUrl: '' }]).map((img, idx) =>
                      img.imageUrl ? (
                        <Image key={img.id || `img-${idx}`} source={{ uri: img.imageUrl }} style={styles.stopImage} />
                      ) : (
                        <View key={img.id || `img-${idx}`} style={styles.stopImagePlaceholder} />
                      ),
                    )}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => handleViewFullRoute(data.dropoff?.pointId)}
                    activeOpacity={0.8}
                    style={styles.viewFullRouteContainer}
                  >
                    <View style={styles.locationConnectionContainer}>
                      <View style={styles.connectionLine} />
                      <Image source={ImageSource.locationConnection} style={styles.locationConnectionIcon} />
                    </View>
                    <Text variant="semi-bold" style={styles.viewFullRoute}>
                      View full route
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
        {/* Bus timing section */}
        <Text style={styles.bustimings}>Bus Timings</Text>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.contentContainer}>
          {(data.timings ?? []).slice(0, 6).map(t => {
            const isSelected = t.tripId === selectedTripId;
            return (
              <TouchableOpacity
                key={t.tripId}
                activeOpacity={0.85}
                onPress={() => handleSelectTiming(t.tripId)}
                style={[styles.timeSlotContainer, isSelected && styles.timeSlotContainerSelected]}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 5, height: 5, backgroundColor: colors.button_primary, borderRadius: 50 }} />
                  <View style={{ height: 24, borderRightWidth: 1, borderStyle: 'dashed' }} />
                  <View style={{ width: 5, height: 5, backgroundColor: colors.primary, borderRadius: 50 }} />
                </View>

                <View style={{ gap: 5 }}>
                  <Text>{formatTime(t.pickupArrivalTime)}</Text>
                  <Text>{formatTime(t.dropoffArrivalTime)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.ratingAndButtoncontainer}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} activeOpacity={0.8} onPress={openTimingsSheet}>
            <Image source={ImageSource.busTime} style={{ width: 15, height: 15 }} />
            <Text variant="bold" style={styles.viewAllTimings}>
              View all {data.timings?.length ?? 0} timings
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonAndFareContainer}>
            <PrimaryButton title="Proceed" onPress={handlePressBtn} btnStyle={styles.btnstyle} />
            <Text variant="medium" style={styles.fareText}>
              Fares starting from <Text style={styles.farePrice}>₹{data.baseFare}</Text>
            </Text>
          </View>
        </View>
      </View>

      <BottomSheetModal
        ref={timingsSheetRef}
        index={0}
        enableDynamicSizing={true}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.bottomSheetDynamicContent}>
          <View style={styles.sheetHeader}>
            <Text variant="semi-bold" style={styles.sheetTitle}>
              Select a time
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close timings"
              onPress={closeTimingsSheet}
              style={styles.closeButton}
            >
              <Image source={ImageSource.cross} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.timingsListContent}>
            {(data.timings ?? []).map((item: any) => (
              <TouchableOpacity
                key={item.tripId}
                activeOpacity={0.85}
                style={[styles.timingRow, item.tripId === selectedTripId && styles.timingRowSelected]}
                onPress={() => handleSelectTiming(item.tripId)}
              >
                <View style={styles.timingLeft}>
                  <Text variant="semi-bold" style={styles.timingRange}>
                    {formatTime(item.pickupArrivalTime)} - {formatTime(item.dropoffArrivalTime)}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.timingVia} numberOfLines={1}>
                      {data.routeName}
                    </Text>
                    <View style={styles.timingRight}>
                      <Image source={ImageSource.mapPin} style={styles.stopsIcon} />
                      <Text style={styles.stopsText}>{data.allStops?.length ?? 0} Stop</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default BusSelectionCard;
