export const API_ENDPOINTS = {
  SEARCH: {
    PLACE_AUTOCOMPLETE: '/search/place-autocomplete',
    REVERSE_GEOCODE: '/search/reverse-geocode',
    RECENT_SEARCHES: '/search/recent-searches',
    TRIPS: '/search/trips',
  },
  BOOKINGS: {
    INITIATE: '/bookings/initiate',
    INITIATE_ROUND_TRIP: '/bookings/initiate-round-trip',
    SELF_BOARD: '/bookings/self-board',
    CONFIRM: (id: string) => `/bookings/${id}/confirm`,
    APPLY_COUPON: (id: string) => `/bookings/${id}/apply-coupon`,
    REMOVE_COUPON: (id: string) => `/bookings/${id}/coupon`,
    CHANGE_SEAT: (id: string) => `/bookings/${id}/seat`,
    GET_SEATS: (id: string) => `/trips/${id}/seats`,
    MY_BOOKINGS: '/bookings/my-bookings',
    GET_BY_ID: (id: string) => `/bookings/${id}`,
    GET_DETAILS: (id: string) => `/bookings/${id}/details`,
    TICKET_DETAIL: (id: string) => `/bookings/ticket/${id}`,
    TRACK_RIDE: (id: string) => `/bookings/track/${id}`,
  },
  USERS: {
    SAVED_LOCATIONS: '/users/me/saved-locations',
    TRAVEL_PREFERENCE_LOCATIONS: '/users/me/travel-preferences/locations',
  },
  DRIVERS: {
    GET_DETAILS: (id: string) => `/drivers/${id}/details`,
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/financials/transactions',
    TRANSACTION_DETAIL: (id: string) => `/financials/transactions/${id}`,
    TOPUP_INITIATE: '/wallet/topup/initiate',
  },
  SUGGESTIONS: {
    CREATE: '/suggestions',
    ME: '/suggestions/me',
    DELETE: (id: string) => `/suggestions/${id}`,
  },
  WEATHER: {
    CURRENT: '/weather',
  },
  RENTALS: {
    BASE: '/rentals',
    MY: '/rentals/my',
  },
};
