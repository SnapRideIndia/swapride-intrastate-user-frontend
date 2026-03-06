import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkPermissionsHelper, getCurrentLocationHelper } from './helper';
import { AppState } from 'react-native';
import { AppDispatch } from '../../../store';
import { setCurrentCoords } from '../../../features/profile/slice/profileSlice';
import { ICoordinate } from '../../../features/profile/core/CoordinateTypes';

const useGetLocation = () => {
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const checkPermission = async () => {
    const granted = await checkPermissionsHelper();
    setIsLocationPermissionGranted(granted);
    return granted;
  };
  const requestPermission = async () => {
    const granted = await checkPermissionsHelper();
    setIsLocationPermissionGranted(granted);
    return granted;
  };

  const getCurrentLocation = async () => {
    console.log('Getting current location...');
    const currentLocation = await getCurrentLocationHelper();
    if (currentLocation?.coords) {
      // dispatch();
      dispatch(setCurrentCoords(currentLocation.coords as ICoordinate));
      return currentLocation;
    }
    return null;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        await checkPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    isLocationPermissionGranted,
    checkPermission,
    requestPermission,
    getCurrentLocation,
  };
};

export default useGetLocation;
