import { fetchData, postData, patchData, deleteData, handleErrorResponse } from './ApiUtility';
import type { LocationFieldType, RecentSearchDto, SavedLocationDto } from '../types/search.types';
import type { SearchTripsParams, SearchTripsResponseDto } from '../types/trips.types';
import { API_ENDPOINTS } from './endpoints';

export type PlaceSuggestion = {
  text: string;
  placeId: string;
  mainText: string;
  lat: number;
  lng: number;
};

export type { LocationFieldType };

const getTypeCandidates = (type: LocationFieldType): Array<'pickup' | 'drop' | 'dropoff'> => {
  if (type === 'pickup') return ['pickup'];
  return ['dropoff', 'drop'];
};

class SearchService {
  placeAutocomplete = async (input: string, sessionToken: string) => {
    const url = API_ENDPOINTS.SEARCH.PLACE_AUTOCOMPLETE;
    const res = await fetchData<PlaceSuggestion[]>(url, {
      params: { input, sessionToken },
    });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data ?? [];
  };

  reverseGeocode = async (latitude: number, longitude: number, sessionToken: string) => {
    const url = API_ENDPOINTS.SEARCH.REVERSE_GEOCODE;
    const res = await fetchData<PlaceSuggestion[]>(url, {
      params: {
        latitude,
        longitude,
        lat: latitude,
        lng: longitude,
        sessionToken,
      },
    });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data ?? [];
  };

  recentSearches = async (type: LocationFieldType) => {
    const url = API_ENDPOINTS.SEARCH.RECENT_SEARCHES;
    let lastError: unknown;
    for (const t of getTypeCandidates(type)) {
      try {
        const res = await fetchData<RecentSearchDto[]>(url, { params: { type: t } });
        console.log('Recent searches API response ===>', res?.data ?? res);
        if (!res.success || !res.data) {
          handleErrorResponse(res);
        }
        return res.data ?? [];
      } catch (e) {
        lastError = e;
      }
    }

    return [];
  };

  getTravelPreferenceLocations = async (type?: LocationFieldType) => {
    const url = API_ENDPOINTS.USERS.TRAVEL_PREFERENCE_LOCATIONS;
    const params = type ? { type: type === 'pickup' ? 'pickup' : 'dropoff' } : undefined;
    const res = await fetchData<any>(url, { params });
    console.log('Saved addresses (me/travel-preference) API response ===>', res?.data ?? res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data || [];
  };

  savedLocations = async () => {
    const url = API_ENDPOINTS.USERS.SAVED_LOCATIONS;
    const res = await fetchData<any>(url);
    console.log('Saved locations list API response ===>', res?.data ?? res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data || [];
  };

  createSavedLocation = async (dto: { label: string; address: string; latitude: number; longitude: number }) => {
    const url = API_ENDPOINTS.USERS.SAVED_LOCATIONS;
    const res = await postData<SavedLocationDto>(url, dto);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data;
  };

  updateSavedLocation = async (id: string, dto: { label: string; address: string; latitude: number; longitude: number }) => {
    const url = `${API_ENDPOINTS.USERS.SAVED_LOCATIONS}/${id}`;
    const res = await patchData<SavedLocationDto>(url, dto);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data;
  };

  deleteSavedLocation = async (id: string) => {
    const url = `${API_ENDPOINTS.USERS.SAVED_LOCATIONS}/${id}`;
    const res = await deleteData(url);
    if (!res.success) {
      handleErrorResponse(res);
    }
  };

  searchTrips = async (params: SearchTripsParams) => {
    const url = API_ENDPOINTS.SEARCH.TRIPS;
    const res = await postData<SearchTripsResponseDto>(url, params);

    console.log('Trips API Response ===>', res.data);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as SearchTripsResponseDto;
  };
}

export default new SearchService();
