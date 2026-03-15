export type SuggestionShift = 'MORNING' | 'EVENING';

export type SuggestionStatus = 'PENDING' | 'REVIEWED' | 'IMPLEMENTED' | 'REJECTED';

export interface StopSuggestionListItem {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  shift: SuggestionShift;
  reachingTime: string;
  description?: string | null;
  status: SuggestionStatus;
  createdAt: string;
}

export interface SuggestionsListResponse {
  data: StopSuggestionListItem[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

export interface CreateStopSuggestionDto {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  shift: SuggestionShift;
  reachingTime: string;
  description?: string;
  updatePrefs?: boolean;
}
