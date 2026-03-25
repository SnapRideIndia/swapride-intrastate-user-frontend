import { API_ENDPOINTS } from './endpoints';
import { fetchData, postData } from './ApiUtility';

export interface CreateRentalDto {
  originAddress: string;
  originLat: number;
  originLng: number;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  departureDate: string;
  arrivalDate: string;
  passengerRange: string;
}

export const rentalService = {
  createRentalRequest: async (dto: CreateRentalDto) => {
    return postData<any>(API_ENDPOINTS.RENTALS.BASE, dto);
  },
  
  getMyRentals: async () => {
    return fetchData<any>(API_ENDPOINTS.RENTALS.MY);
  },

  getRentalDetail: async (id: string) => {
    return fetchData<any>(`${API_ENDPOINTS.RENTALS.BASE}/${id}`);
  },
};
