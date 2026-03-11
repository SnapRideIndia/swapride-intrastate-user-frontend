import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Coordinate } from '../../../utils/mapUtils';
import { useTheme } from '../../../theme/ThemeProvider';

interface SwMapViewProps {
  coordinates?: Coordinate[];
  startCoordinate?: Coordinate;
  endCoordinate?: Coordinate;
  style?: ViewStyle;
  initialRegion?: Region;
  stops?: Coordinate[];
}

const SwMapView: React.FC<SwMapViewProps> = ({
  coordinates = [],
  startCoordinate,
  endCoordinate,
  style,
  initialRegion,
  stops = [],
}) => {
  const { colors } = useTheme();
  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    if (initialRegion && mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {coordinates.length > 1 && (
          <>
            {/* Glow Polyline for Premium Look */}
            <Polyline
              coordinates={coordinates}
              strokeColor={colors.primaryLight + '33'}
              strokeWidth={10}
              zIndex={1}
            />
            {/* Main Primary Polyline */}
            <Polyline
              coordinates={coordinates}
              strokeColor={colors.primaryLight}
              strokeWidth={4}
              zIndex={2}
            />
          </>
        )}

        {startCoordinate?.latitude && (
          <Marker 
            coordinate={startCoordinate}
            title="Pickup"
            zIndex={10}
          >
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          </Marker>
        )}

        {endCoordinate?.latitude && (
          <Marker 
            coordinate={endCoordinate}
            title="Dropoff"
            zIndex={10}
          >
            <View style={[styles.dot, { backgroundColor: colors.secondary, borderColor: '#FFFFFF', borderWidth: 2 }]} />
          </Marker>
        )}
        
        {/* Intermediate Stops */}
        {stops.map((stop, idx) => {
          if (!stop.latitude || !stop.longitude) return null;
          
          // Don't render stop dot if it's already a pickup or dropoff marker
          const isPickup = stop.latitude === startCoordinate?.latitude && stop.longitude === startCoordinate?.longitude;
          const isDropoff = stop.latitude === endCoordinate?.latitude && stop.longitude === endCoordinate?.longitude;
          
          if (isPickup || isDropoff) return null;
          
          return (
            <Marker 
              key={`stop-${idx}`}
              coordinate={stop}
              zIndex={5}
            >
              <View style={styles.stopDot} />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FBBF24', // Amber/Yellow matching dashboard
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

export default SwMapView;
