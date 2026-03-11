import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TrackRideMap.styles';
import SwMapView from '../../../common/SwMapView/SwMapView';
import { decodePolyline, Coordinate } from '../../../../utils/mapUtils';

interface TrackRideMapProps {
  encodedPolyline?: string;
  pickupPoint?: Coordinate;
  dropoffPoint?: Coordinate;
  stops?: Coordinate[];
}

const TrackRideMap: React.FC<TrackRideMapProps> = ({
  encodedPolyline,
  pickupPoint,
  dropoffPoint,
  stops,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const routeCoordinates = useMemo(() => {
    if (!encodedPolyline) return [];
    return decodePolyline(encodedPolyline);
  }, [encodedPolyline]);

  const initialRegion = useMemo(() => {
    if (pickupPoint && pickupPoint.latitude && pickupPoint.longitude) {
      return {
        latitude: Number(pickupPoint.latitude),
        longitude: Number(pickupPoint.longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Fallback to a default location (e.g., Hyderabad center)
    return {
      latitude: 17.385,
      longitude: 78.4867,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [pickupPoint]);


  return (
    <View style={styles.container}>
      <SwMapView
        coordinates={routeCoordinates}
        startCoordinate={pickupPoint}
        endCoordinate={dropoffPoint}
        stops={stops}
        initialRegion={initialRegion}
      />
    </View>
  );
};

export default TrackRideMap;
