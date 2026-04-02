import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { useStyles } from './RentalRequestsScreen.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import { rentalService } from '../../../services/RentalService';
import { ScreenNames } from '../../../navigation/constant';
import { RootStackParamList } from '../../../navigation/types';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { NoResults } from '../../../components/common/NoResults/NoResults';

const RentalRequestsScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchRentals = useCallback(async () => {
    try {
      setIsError(false);
      const response = await rentalService.getMyRentals();
      console.log('Rental Requests Response ===>', response);
      if (response.success) {
        setRentals(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setIsError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRentals();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return colors.primary;
      case 'CONFIRMED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      case 'QUOTED': return '#3B82F6';
      default: return colors.contentSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Received';
      case 'QUOTED': return 'Quoted';
      case 'CONFIRMED': return 'Confirmed';
      case 'CANCELLED': return 'Cancelled';
      case 'CALLED': return 'Reviewed';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate(ScreenNames.RENTAL_DETAILS_SCREEN, { rentalId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text variant="medium" style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
        <Text style={styles.dateText}>{format(new Date(item.createdAt), 'do MMM, yyyy')}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationRow}>
          <View style={styles.dotLineCol}>
            <View style={[styles.routeDot, { backgroundColor: colors.primaryLight }]} />
            <View style={styles.routeConnector} />
          </View>
          <Text style={styles.locationText}>{item.originAddress}</Text>
        </View>
        <View style={styles.locationRow}>
          <View style={styles.dotLineCol}>
            <View style={[styles.routeDot, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={styles.locationText}>{item.destinationAddress}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.infoPill}>
          <Image source={ImageSource.userOutline} style={styles.pillIcon} />
          <Text style={styles.pillText}>{item.passengerRange} Pax</Text>
        </View>
        <View style={styles.infoPill}>
          <Image source={ImageSource.calenderOutline} style={styles.pillIcon} />
          <Text style={styles.pillText}>{format(new Date(item.departureDate), 'MMM d')}</Text>
        </View>
        <Image source={ImageSource.chevronRight} style={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <PrimaryHeader title="My Rental Requests" onBackBtnPress={() => navigation.goBack()} />
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text variant="semi-bold" style={{ textAlign: 'center', color: colors.contentPrimary, marginBottom: 8 }}>
            Unable to load requests
          </Text>
          <Text style={{ textAlign: 'center', color: colors.contenttertiary, marginBottom: 24 }}>
            Something went wrong while fetching your rental inquiries.
          </Text>
          <PrimaryButton 
            title="Retry" 
            onPress={() => {
              setLoading(true);
              fetchRentals();
            }}
            btnStyle={{ width: '100%', maxWidth: 200 }}
          />
        </View>
      ) : (
        <FlatList
          data={rentals}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <NoResults
              image={ImageSource.clock}
              title="No Requests Yet"
              subtitle="Your bus rental inquiries will appear here."
              imageStyle={{ tintColor: colors.contentDisabled }}
            />
          }
        />
      )}
    </View>
  );
};

export default RentalRequestsScreen;
