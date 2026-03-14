import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ImageSource } from '../constants/images';
import SearchService from '../services/SearchService';
import type { PlaceSuggestion } from '../services/SearchService';
import type { SwLocationSearchItem } from '../types/placeAutofill.types';
import type { LocationFieldType } from '../types/search.types';
import type { SearchTripsParams } from '../types/trips.types';
import { showToast } from '../utils/showToast';

const mapPlacesToSearchItems = (places: PlaceSuggestion[]): SwLocationSearchItem[] =>
  places.map(place => ({
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
  const getReverseGeocodeItems = useCallback(async (latitude: number, longitude: number, sessionToken: string) => {
    const places = await SearchService.reverseGeocode(latitude, longitude, sessionToken);
    return mapPlacesToSearchItems(places);
  }, []);

  return { getReverseGeocodeItems };
};

export const useRecentSearch = () => {
  const getRecentSearchItems = useCallback(async (type: LocationFieldType) => {
    try {
      const results = await SearchService.recentSearches(type);
      return (results || []).map(item => {
        const address = item.address || '';
        return {
          id: item.id || Math.random().toString(),
          title: (item.place_name ?? address) || 'Recent Location',
          subtitle: address,
          iconSource: ImageSource.clock,
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          isSaved: item.is_saved ?? false,
        };
      });
    } catch (e) {
      console.warn('Error in getRecentSearchItems:', e);
      return [];
    }
  }, []);

  return { getRecentSearchItems };
};

function getSavedItemIcon(label: string) {
  const lower = (label || '').toLowerCase().trim();
  if (lower === 'home') return ImageSource.Home;
  if (lower === 'work' || lower === 'office') return ImageSource.Work;
  return ImageSource.mapPin;
}

export const useSavedLocations = () => {
  const getSavedLocationItems = useCallback(async (type?: LocationFieldType) => {
    try {
      const results = await SearchService.getTravelPreferenceLocations(type);
      return (results || []).map((item: any) => ({
        id: item.id || Math.random().toString(),
        title: item.label || item.address || 'Saved Location',
        subtitle: item.address || '',
        iconSource: getSavedItemIcon(item.label),
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
      }));
    } catch (e) {
      console.warn('Error in getSavedLocationItems:', e);
      return [];
    }
  }, []);

  return { getSavedLocationItems };
};

export const useSaveLocation = (onSaved?: () => void | Promise<void>) => {
  const saveLocation = useCallback(
    async (item: SwLocationSearchItem, label: string) => {
      try {
        const address = item.subtitle || item.title || '';
        const lat = item.latitude ?? 0;
        const lng = item.longitude ?? 0;
        await SearchService.createSavedLocation({
          label: label.trim(),
          address,
          latitude: lat,
          longitude: lng,
        });
        showToast('success', 'Location saved', '', 2000);
        await onSaved?.();
      } catch (e: any) {
        showToast('error', e?.message ?? 'Failed to save location', '', 2000);
        throw e;
      }
    },
    [onSaved],
  );
  return { saveLocation };
};

export const useSearchTrips = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
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
