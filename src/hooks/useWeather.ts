import { useEffect, useState } from 'react';
import { weatherService, WeatherResponse } from '../services/WeatherService';
import useGetLocation from './permissions/geoLocation';
import { ICoords } from '../types/coords.types';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const { isLocationPermissionGranted, getCurrentLocation } = useGetLocation();

  const fetchWeather = async (coords: ICoords) => {
    try {
      setLoading(true);
      const response = await weatherService.getCurrentWeather(coords.latitude, coords.longitude);
      
      console.log('Weather API Response ===>', response);
      if (response.success && response.data && response.data.temperature !== undefined && response.data.city) {
        setWeather(response.data);
        setError(null);
      } else {
        throw new Error(response.error || 'Incomplete weather data');
      }
    } catch (err: any) {
      console.error('Weather API Error ===>', err);
      setError(err.message);
      setWeather(null);
      // Wait 30s before incrementing retryTrigger to start next attempt
      setTimeout(() => setRetryTrigger(prev => prev + 1), 30000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const location = await getCurrentLocation();
      if (location?.coords) {
        await fetchWeather(location.coords as ICoords);
      } else {
        setLoading(false);
      }
    };

    if (isLocationPermissionGranted === true) {
      init();
    } else if (isLocationPermissionGranted === false) {
      setLoading(false);
    }
  }, [isLocationPermissionGranted, retryTrigger]);

  return {
    weather,
    loading,
    error,
    refreshWeather: async () => {
      const location = await getCurrentLocation();
      if (location?.coords) {
        await fetchWeather(location.coords as ICoords);
      }
    }
  };
};
