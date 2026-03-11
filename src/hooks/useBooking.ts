import { useMutation, useQuery } from '@tanstack/react-query';
import BookingService from '../services/BookingService';
import { ConfirmPaymentDto, ApplyCouponDto } from '../types/booking.types';

export const useInitiateBooking = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: (data: any) => BookingService.initiateBooking(data),
    onSuccess,
    onError,
  });
};

export const useInitiateRoundTrip = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: (data: any) => BookingService.initiateRoundTrip(data),
    onSuccess,
    onError,
  });
};

export const useBookingDetails = (bookingId: string, userLat?: number, userLng?: number) => {
  return useQuery({
    queryKey: ['bookingDetails', bookingId, userLat, userLng],
    queryFn: () => BookingService.getBookingDetails(bookingId, userLat, userLng),
    enabled: !!bookingId,
  });
};

export const useConfirmBooking = (bookingId: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: (data: ConfirmPaymentDto) => BookingService.confirmBooking(bookingId, data),
    onSuccess,
    onError,
  });
};

export const useApplyCoupon = (id: string, onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: (data: ApplyCouponDto) => BookingService.applyCoupon(id, data),
    onSuccess,
    onError,
  });
};

export const useTicketDetail = (id: string) => {
  return useQuery({
    queryKey: ['ticket-detail', id],
    queryFn: () => BookingService.getTicketDetail(id),
    enabled: !!id,
  });
};

export const useGetTripSeats = (tripId: string) => {
  return useQuery({
    queryKey: ['trip-seats', tripId],
    queryFn: () => BookingService.getTripSeats(tripId),
    enabled: !!tripId,
  });
};

export const useChangeSeat = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: ({ bookingId, seatNumber }: { bookingId: string; seatNumber: string }) =>
      BookingService.changeBookingSeat(bookingId, seatNumber),
    onSuccess,
    onError,
  });
};
