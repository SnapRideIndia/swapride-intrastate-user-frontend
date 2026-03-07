import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './BusSelectionCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../../components/common/SwText/SwText';
import PrimaryButton from '../../../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../../navigation/constant';
import { SwBottomSheet } from '../../../../../components/common/BottomSheet/BottomSheet';
import TimeSlotCard from '../../../../../components/domain/booking/TimeSlotCard/TimeSlotCard';
import { ICommute } from '../../../../../types/commute.types';
import { format, isValid, parseISO } from 'date-fns';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { formatTime } from '../../../../../utils/dateUtils';

interface IBusSelectionCard {
  showLabel: boolean;
  data: ICommute;
}

const BusSelectionCard = ({ showLabel = false, data }: IBusSelectionCard) => {
  const [showSourceStopImages, setShowSourceStopImages] = useState(false);
  const [showDestinationImages, setShowDestinationImages] = useState(false);
  const timingsSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(data.timings?.[0]?.tripId ?? null);

  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const timeSheetRef = useRef<BottomSheetModal>(null);

  const mockTimeSlots = [
    { startTime: '5:55 PM', endTime: '8:17 PM', via: 'Majiwada', stopsCount: 12 },
    { startTime: '5:55 PM', endTime: '8:17 PM', via: 'Majiwada', stopsCount: 12 },
    { startTime: '6:15 PM', endTime: '8:45 PM', via: 'Majiwada', stopsCount: 10 },
    { startTime: '7:00 PM', endTime: '9:30 PM', via: 'Majiwada', stopsCount: 15 },
  ];

  const handlePressBtn = () => {
    navigation.navigate(ScreenNames.BOOKING_OPTIONS as never);
  };

  const handleOpenTimeSheet = () => {
    timeSheetRef.current?.present();
  };

  const handleViewFullRoute = () => {
    navigation.navigate(ScreenNames.FULL_ROUTE_SCREEN as never);
  };

  const snapPoints = useMemo(() => ['70%'], []);

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
      {showLabel && (
        <View style={styles.topPickHeader}>
          <View style={styles.topPickHeaderTitleContainer}>
            <Image source={ImageSource.starBadge} style={styles.starBadgeIcon} />
            <Text variant="bold" style={styles.topPickStyle}>
              Top pick for you
            </Text>
          </View>
          <Text style={styles.topPickDesc}>Yay! Your pickup is just 3 min walk away</Text>
        </View>
      )}
      {/* bottom main card Section */}
      <View style={[styles.mainCard, showLabel && { marginTop: -15 }]}>
        <View style={styles.fromToContainer}>
          <View style={styles.badgeAndDeviderContainer}>
            <View style={styles.badge}>
              <Text variant="medium" style={styles.time}>
                4:05 pm
              </Text>
            </View>
            <View style={styles.devider} />
            <View style={styles.badge}>
              <Text variant="medium" style={styles.time}>
                4:05 pm
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
              <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowSourceStopImages(prev => !prev)}>
                <Image source={ImageSource.walkIcon} style={styles.walkIcon} />
                <Text variant="semi-bold" style={styles.placeSubtitle}>
                  {data.pickup?.distanceText ?? '-'}
                </Text>
                <Image source={ImageSource.downArrow} style={styles.downArrow} />
              </TouchableOpacity>

              {showSourceStopImages && (
                <>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                    {[1, 2, 3, 4].map((item, _idx) => (
                      <View
                        style={{
                          width: 150,
                          height: 100,
                          backgroundColor: 'gray',
                          borderRadius: 10,
                        }}
                      />
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={handleViewFullRoute}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: colors.border_4,
                        }}
                      />
                      <Image source={ImageSource.locationConnection} style={styles.locationConnectionIcon} />
                    </View>
                    <Text>View full route</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.place}>
              <Text variant="bold" style={styles.placeTitle}>
                Peninsula Corporate PArk
              </Text>
              <Text variant="medium" style={styles.placeSubtitle}>
                In front of Matula cnter , under the fly over
              </Text>
              <TouchableOpacity style={styles.walkAndTimeContainer} onPress={() => setShowDestinationImages(prev => !prev)}>
                <Image source={ImageSource.walkIcon} style={styles.walkIcon} />
                <Text variant="semi-bold" style={styles.placeSubtitle}>
                  3 min walk (17 m )
                </Text>
                <Image source={ImageSource.downArrow} style={styles.downArrow} />
              </TouchableOpacity>

              {showDestinationImages && (
                <>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ paddingVertical: 20, gap: 10 }}>
                    {(data.dropoff?.images?.length ? data.dropoff.images : [{ id: 'placeholder', imageUrl: '' }]).map(img =>
                      img.imageUrl ? (
                        <Image key={img.id} source={{ uri: img.imageUrl }} style={styles.stopImage} />
                      ) : (
                        <View key={img.id} style={styles.stopImagePlaceholder} />
                      ),
                    )}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={handleViewFullRoute}
                    activeOpacity={0.8}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                  >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: colors.border_4 }} />
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
            <PrimaryButton title="Continue" onPress={handlePressBtn} btnStyle={styles.btnstyle} />
            <Text variant="medium" style={styles.fareText}>
              Fares starting from ₹{data.baseFare}
            </Text>
          </View>
        </View>
      </View>

      <BottomSheetModal
        ref={timingsSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
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
        <View style={styles.sheetContent}>
          <BottomSheetFlatList
            data={data.timings ?? []}
            keyExtractor={(item: any) => item.tripId}
            contentContainerStyle={styles.timingsListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
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
                      Via {data.routeName}
                    </Text>
                    <View style={styles.timingRight}>
                      <Image source={ImageSource.mapPin} style={styles.stopsIcon} />
                      <Text style={styles.stopsText}>{data.allStops?.length ?? 0} Stop</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default BusSelectionCard;
