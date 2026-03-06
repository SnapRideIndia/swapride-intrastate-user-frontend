import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImageSource } from '../constants/images';
import SearchService from '../services/SearchService';
import type { PlaceSuggestion } from '../services/SearchService';
import type { SwLocationSearchItem } from '../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import type { LocationFieldType } from '../types/search.types';
import type { SearchTripsParams } from '../types/trips.types';

const mapPlacesToSearchItems = (places: PlaceSuggestion[]): SwLocationSearchItem[] =>
  places.map((place) => ({
    id: place.placeId,
    title: place.mainText || place.text,
    subtitle: place.text,
    iconSource: ImageSource.searhIcon,
    latitude: place.lat,
    longitude: place.lng,
  }));

export const usePlaceAutocomplete = () => {
  const getPlaceAutocompleteItems = useCallback(async (input: string, sessionToken: string) => {
    const places = await SearchService.placeAutocomplete(input, sessionToken);
    return mapPlacesToSearchItems(places);
  }, []);

  return { getPlaceAutocompleteItems };
};

export const useReverseGeocode = () => {
  const getReverseGeocodeItems = useCallback(
    async (latitude: number, longitude: number, sessionToken: string) => {
      const places = await SearchService.reverseGeocode(latitude, longitude, sessionToken);
      return mapPlacesToSearchItems(places);
    },
    [],
  );

  return { getReverseGeocodeItems };
};

export const useRecentSearch = () => {
  const getRecentSearchItems = useCallback(async (type: LocationFieldType) => {
    const results = await SearchService.recentSearches(type);
    return results.map((item) => ({
      id: item.id,
      title: item.address,
      subtitle: item.address,
      iconSource: ImageSource.clock,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  }, []);

  return { getRecentSearchItems };
};

export const useSavedLocations = () => {
  const getSavedLocationItems = useCallback(async (type: LocationFieldType) => {
    const results = await SearchService.savedLocations(type);
    return results.map((item) => ({
      id: item.id,
      title: item.label || item.address,
      subtitle: item.address,
      iconSource: ImageSource.Home,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  }, []);

  return { getSavedLocationItems };
};

export const useSearchTrips = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation({
    mutationFn: (params: SearchTripsParams) => SearchService.searchTrips(params),
    onSuccess,
    onError,
  });
};

// Backwards-compatible wrapper (so existing imports don't break)
const useSearch = () => {
  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getReverseGeocodeItems } = useReverseGeocode();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  return {
    getPlaceAutocompleteItems,
    getReverseGeocodeItems,
    getRecentSearchItems,
    getSavedLocationItems,
  };
};

export default useSearch;
