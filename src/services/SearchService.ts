import { fetchData, handleErrorResponse } from './ApiUtility';
import type { LocationFieldType, RecentSearchDto, SavedLocationDto } from '../types/search.types';
import type { SearchTripsParams, SearchTripsResponseDto } from '../types/trips.types';

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
  // Backend might expect either "dropoff" or "drop"
  return ['dropoff', 'drop'];
};

class SearchService {
  baseUrl = '/search';

  placeAutocomplete = async (input: string, sessionToken: string) => {
    const url = `${this.baseUrl}/place-autocomplete`;
    const res = await fetchData<PlaceSuggestion[]>(url, {
      params: { input, sessionToken },
    });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data ?? [];
  };

  reverseGeocode = async (latitude: number, longitude: number, sessionToken: string) => {
    const url = `${this.baseUrl}/reverse-geocode`;
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
    const url = `${this.baseUrl}/recent-searches`;
    let lastError: unknown;
    for (const t of getTypeCandidates(type)) {
      try {
        const res = await fetchData<RecentSearchDto[]>(url, { params: { type: t } });
        console.log("This is recent searches ===>", res)
        if (!res.success || !res.data) {
          handleErrorResponse(res);
        }
        return res.data ?? [];
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError;
  };

  savedLocations = async (type: LocationFieldType) => {
    const url = `/users/saved-locations?type=${type}`;
    const res = await fetchData(url);

    console.log('response of saved locations', res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };

  searchTrips = async (params: SearchTripsParams) => {
    const url = `${this.baseUrl}/trips`;
    const res = await fetchData<SearchTripsResponseDto>(url, { params });

    console.log("this is the resposne of search trips ===>", res)

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };
}

export default new SearchService();

