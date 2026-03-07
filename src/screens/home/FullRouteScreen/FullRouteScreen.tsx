import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import FullRouteHeader from '../../../components/common/SwHeader/FullRouteHeader/FullRouteHeader';
import RouteAccordionItem, { RouteAccordionStep } from '../../../components/domain/fullRoute/RouteAccordionItem/RouteAccordionItem';
import { useStyles } from './FullRouteScreen.styles';
import { ICommute } from '../../../types/commute.types';

const FullRouteScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.FULL_ROUTE_SCREEN>>();
  const { tripData, initialOpenId } = route.params || {};

  const steps: RouteAccordionStep[] = useMemo(() => {
    if (!tripData?.allStops) return [];

    return tripData.allStops.map(stop => {
      const isPickup = stop.pointId === tripData.pickup?.pointId;
      const isDropoff = stop.pointId === tripData.dropoff?.pointId;

      return {
        id: stop.pointId,
        kind: isPickup ? 'pickup' : isDropoff ? 'dropoff' : 'normal',
        label: isPickup ? 'Pickup Stop' : isDropoff ? 'Dropoff Stop' : undefined,
        title: stop.name,
        subtitle: stop.address,
        latitude: stop.latitude,
        longitude: stop.longitude,
        images: stop.images?.map(img => ({ id: img.id, imageUrl: img.imageUrl })),
        showDirectionsCta: (isPickup || isDropoff) && !!stop.latitude && !!stop.longitude,
      };
    });
  }, [tripData]);

  const [openId, setOpenId] = useState<string>(initialOpenId || tripData?.pickup?.pointId || '');

  useEffect(() => {
    const renderHeader = () => <FullRouteHeader title="Full Route" />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.list}>
          {steps.map((step, index) => (
            <RouteAccordionItem
              key={step.id}
              step={step}
              isOpen={openId === step.id}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
              onToggle={() => setOpenId(prev => (prev === step.id ? '' : step.id))}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullRouteScreen;
