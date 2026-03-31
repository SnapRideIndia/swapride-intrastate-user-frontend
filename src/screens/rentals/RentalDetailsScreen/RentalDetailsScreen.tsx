import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { useStyles } from './RentalDetailsScreen.styles';
import { useTheme } from '../../../theme/ThemeProvider';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { ImageSource } from '../../../constants/images';
import { rentalService } from '../../../services/RentalService';
import { RootStackParamList } from '../../../navigation/types';
import { ScreenNames } from '../../../navigation/constant';
import { Contact } from '../../../constants/contact';

const RentalDetailsScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ScreenNames.RENTAL_DETAILS_SCREEN>>();
  const { rentalId } = route.params;

  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const response = await rentalService.getRentalDetail(rentalId);
      console.log('Rental Detail Response ===>', response);
      if (response.success) {
        setRental(response.data);
      }
    } catch (error) {
      console.error('Error fetching rental details:', error);
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Request Received';
      case 'QUOTED': return 'Quote Prepared';
      case 'CONFIRMED': return 'Booking Confirmed';
      case 'CANCELLED': return 'Request Cancelled';
      case 'CALLED': return 'In Review';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return colors.primary;
      case 'CONFIRMED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      default: return colors.contentSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <PrimaryHeader title="Rental Details" onBackBtnPress={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!rental) {
    return (
      <View style={styles.container}>
        <PrimaryHeader title="Rental Details" onBackBtnPress={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Rental details not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PrimaryHeader 
        title="Rental Details" 
        onBackBtnPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statusSection}>
          <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(rental.status) + '20' }]}>
            <Image source={ImageSource.clock} style={[styles.statusIcon, { tintColor: getStatusColor(rental.status) }]} />
          </View>
          <Text variant="semi-bold" style={styles.statusTitle}>
            {getStatusLabel(rental.status)}
          </Text>
          <Text style={styles.statusSubtitle}>
            Your request is being processed
          </Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.routeSection}>
            <View style={styles.locationBlock}>
              <View style={styles.dotLineCol}>
                <View style={[styles.routeDot, { backgroundColor: colors.primaryLight }]} />
                <View style={styles.routeConnector} />
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationLabel}>Origin</Text>
                <Text variant="medium" style={styles.locationValue}>{rental.originAddress}</Text>
              </View>
            </View>

            <View style={styles.locationBlock}>
              <View style={styles.dotLineCol}>
                <View style={[styles.routeDot, { backgroundColor: colors.secondary }]} />
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text variant="medium" style={styles.locationValue}>{rental.destinationAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text variant="semi-bold" style={styles.cardTitle}>Trip Schedule</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Depature Date</Text>
              <Text variant="medium" style={styles.gridValue}>
                {format(new Date(rental.departureDate), 'do MMM, yyyy')}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Arrival Date</Text>
              <Text variant="medium" style={styles.gridValue}>
                {format(new Date(rental.arrivalDate), 'do MMM, yyyy')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text variant="semi-bold" style={styles.cardTitle}>Requirement Details</Text>
          <View style={styles.detailRow}>
            <Image source={ImageSource.userOutline} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Estimated Passengers</Text>
            <Text variant="medium" style={styles.detailValue}>{rental.passengerRange}</Text>
          </View>
          {rental.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.gridLabel}>Special Instructions</Text>
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{rental.notes}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>Need immediate assistance?</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:+91${Contact.support}`)}
          >
            <Image source={ImageSource.call} style={styles.callIcon} />
            <Text variant="semi-bold" style={styles.contactButtonText}>Call Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RentalDetailsScreen;
