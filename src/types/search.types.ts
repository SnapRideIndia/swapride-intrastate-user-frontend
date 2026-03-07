export type LocationFieldType = 'pickup' | 'drop';

export type SavedLocationDto = {
  id: string;
  userId: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type RecentSearchDto = {
  id: string;
  type: LocationFieldType | 'dropoff';
  address: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};
