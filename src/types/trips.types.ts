import type { Root } from './commute.types';

export type SearchTripsParams = {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  tripDate: string; // YYYY-MM-DD
  userLat: number;
  userLng: number;
  pickupName?: string;
  dropoffName?: string;
  preferredTime?: string;
};

export type SearchTripsBaseParams = Omit<SearchTripsParams, 'tripDate'>;

// /search/trips response
export type SearchTripsResponseDto = Root;

