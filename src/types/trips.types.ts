import type { Root } from './commute.types';

export type SearchTripsParams = {
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };
  dropoff: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  };
  userLocation: {
    latitude: number;
    longitude: number;
  };
  tripDate: string; // YYYY-MM-DD
  preferredTime?: string;
  pickupPointId?: string;
  dropoffPointId?: string;
  officeTimings?: string;
};

export type SearchTripsBaseParams = Omit<SearchTripsParams, 'tripDate'>;

// /search/trips response
export type SearchTripsResponseDto = Root;

