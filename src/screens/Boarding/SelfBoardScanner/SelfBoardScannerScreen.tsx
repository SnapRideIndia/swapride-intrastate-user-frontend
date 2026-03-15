import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import QrScannerView from '../../../components/common/Camera/QrScannerView';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SelfBoardScannerScreen.styles';
import { ScreenNames } from '../../../navigation/constant';
import type { RootStackParamList } from '../../../navigation/types';
import { useSelfBoard } from '../../../hooks/useBooking';
import useGetLocation from '../../../hooks/permissions/geoLocation';
import type { ICoords } from '../../../types/coords.types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { setCurrentCoords } from '../../../slice/profileSlice';

type SelfBoardScannerRoute = RouteProp<RootStackParamList, typeof ScreenNames.SELF_BOARD_SCANNER>;

const SelfBoardScannerScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<SelfBoardScannerRoute>();
  const { ticketId } = route.params;

  const { getCurrentLocation } = useGetLocation();
  const dispatch = useDispatch();
  const currentCoords = useSelector((state: RootState) => state.profile.currentCoords);

  const [hasScanned, setHasScanned] = useState(false);
  const isSubmittingRef = useRef(false);

  const { mutate: selfBoardMutate } = useSelfBoard(
    data => {
      console.log('Self-board API success ===>', JSON.stringify(data, null, 2));
      isSubmittingRef.current = false;
      navigation.replace(ScreenNames.SELF_BOARD_SUCCESS, { ticketId, boardingInfo: data });
    },
    error => {
      console.log('Self-board API error ===>', error);
      isSubmittingRef.current = false;
      const message =
        (Array.isArray(error?.message) ? error.message[0] : error?.message) ||
        'We could not confirm your boarding. Please try again.';
      // Navigate to a dedicated error screen to keep flow consistent
      navigation.replace(ScreenNames.SELF_BOARD_ERROR, { ticketId, message });
    },
  );

  const resolveLocation = useCallback(async (): Promise<ICoords | null> => {
    // Always attempt to get a fresh location when needed,
    // instead of relying solely on cached coordinates. This ensures
    // the OS will prompt for location permission if it was revoked.
    const position = await getCurrentLocation();
    if (position?.coords) {
      dispatch(setCurrentCoords(position.coords as unknown as ICoords));
      return position.coords as unknown as ICoords;
    }
    return currentCoords ?? null;
  }, [currentCoords, dispatch, getCurrentLocation]);

  const handleQrScanned = useCallback(
    async (token: string) => {
      if (hasScanned || isSubmittingRef.current) {
        return;
      }
      if (!token) return;

       console.log('Self-board scan payload token ===>', token);

      setHasScanned(true);
      isSubmittingRef.current = true;

      try {
        const coords = await resolveLocation();
        if (!coords) {
          throw new Error('Location unavailable');
        }
        console.log('Self-board scan payload location ===>', coords);
        selfBoardMutate({
          qrToken: token,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (err: any) {
        isSubmittingRef.current = false;
        setHasScanned(false);

        const message = err?.message || 'We could not access your location. Please try again.';

        // If location permission is missing/denied, guide user to app settings
        if (
          message.toLowerCase().includes('location permission') ||
          message.toLowerCase().includes('permission denied')
        ) {
          Alert.alert(
            'Location permission needed',
            Platform.OS === 'ios'
              ? 'We need your location to confirm your boarding. Please enable Location in Settings for this app.'
              : 'We need your location to confirm your boarding. Please enable Location permission in App settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open settings',
                onPress: () => {
                  Linking.openSettings().catch(() => {});
                },
              },
            ],
          );
        } else {
          Alert.alert('Boarding Failed', message);
        }
      }
    },
    [hasScanned, resolveLocation, selfBoardMutate],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Scan bus QR" />
      <View style={styles.scannerContainer}>
        <QrScannerView onQrScanned={handleQrScanned} isActive={!isSubmittingRef.current} />
      </View>
    </SafeAreaView>
  );
};

export default SelfBoardScannerScreen;
