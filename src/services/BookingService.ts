import { fetchData, postData, patchData, deleteData, handleErrorResponse } from './ApiUtility';
import type {
  InitiateBookingDto,
  BookingResponse,
  InitiateRoundTripDto,
  RoundTripBookingResponse,
  BookingDetails,
  ConfirmPaymentDto,
  ApplyCouponDto,
} from '../types/booking.types';
import { API_ENDPOINTS } from './endpoints';

class BookingService {
  initiateBooking = async (data: InitiateBookingDto): Promise<BookingResponse> => {
    const url = API_ENDPOINTS.BOOKINGS.INITIATE;
    const res = await postData<BookingResponse>(url, data);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as BookingResponse;
  };

  initiateRoundTrip = async (data: InitiateRoundTripDto): Promise<RoundTripBookingResponse> => {
    const url = API_ENDPOINTS.BOOKINGS.INITIATE_ROUND_TRIP;
    const res = await postData<RoundTripBookingResponse>(url, data);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as RoundTripBookingResponse;
  };

  getBookingDetails = async (
    id: string,
    userLat?: number,
    userLng?: number,
    destLat?: number,
    destLng?: number,
  ): Promise<BookingDetails> => {
    const url = API_ENDPOINTS.BOOKINGS.GET_DETAILS(id);
    const res = await fetchData<BookingDetails>(url, {
      params: { userLat, userLng, destLat, destLng },
    });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as BookingDetails;
  };

  confirmBooking = async (id: string, data: ConfirmPaymentDto): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.CONFIRM(id);
    const res = await postData<any>(url, data);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  applyCoupon = async (id: string, data: ApplyCouponDto): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.APPLY_COUPON(id);
    const res = await postData<any>(url, data);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  removeCoupon = async (id: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.REMOVE_COUPON(id);
    const res = await deleteData<any>(url);

    if (!res.success) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getTicketDetail = async (id: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.TICKET_DETAIL(id);
    const res = await fetchData<any>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getTripSeats = async (tripId: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.GET_SEATS(tripId);
    const res = await fetchData<any>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  changeBookingSeat = async (bookingId: string, seatNumber: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.CHANGE_SEAT(bookingId);
    const res = await patchData<any>(url, { seatNumber });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getMyBookings = async (type?: string, limit: number = 10, offset: number = 0, date?: string, q?: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.MY_BOOKINGS;
    const res = await fetchData<any>(url, {
      params: { type, limit, offset, date, q },
    });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };
 
  trackRide = async (bookingId: string): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.TRACK_RIDE(bookingId);
    const res = await fetchData<any>(url);
 
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
 
    return res.data;
  };

  getDriverDetails = async (driverId: string): Promise<any> => {
    const url = API_ENDPOINTS.DRIVERS.GET_DETAILS(driverId);
    const res = await fetchData<any>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  selfBoard = async (qrToken: string, latitude: number, longitude: number): Promise<any> => {
    const url = API_ENDPOINTS.BOOKINGS.SELF_BOARD;
    const res = await postData<any>(url, { qrToken, latitude, longitude });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };
}

export default new BookingService();
