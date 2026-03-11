export enum MyBookingType {
  UPCOMING = 'UPCOMING',
  HISTORY = 'HISTORY',
}

export interface InitiateBookingDto {
  tripId: string;
  pickupStopId: string;
  dropoffStopId: string;
  totalAmount: number;
  seatNumbers?: string[];
}

export interface InitiateRoundTripDto {
  outbound: InitiateBookingDto;
  returnTrip: InitiateBookingDto;
}

export interface BookingResponse {
  bookingId: string;
  expiresAt: string;
  totalAmount: number;
  subTotal: number;
  discountAmount: number;
  assignedSeats: Array<{ seatId: string; seatNumber: string }>;
  message: string;
}

export interface RoundTripBookingResponse {
  outboundBookingId: string;
  returnBookingId: string;
  totalPayable: number;
  expiresAt: string;
  outbound: BookingResponse;
  return: BookingResponse;
  message: string;
}

export interface LegDetail {
  bookingId: string;
  tripId: string;
  bookingStatus: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  expiresAt: string;
  assignedSeats: Array<{ seatId: string; seatNumber: string }>;
  tripDate: string;
  pickup: {
    name: string;
    address: string;
    arrivalTime: string;
    distanceText: string | null;
  };
  dropoff: {
    name: string;
    address: string;
    arrivalTime: string;
  };
}

export interface SingleBookingDetails extends LegDetail {
  isRoundTrip: false;
  totalPayable: number;
}

export interface RoundBookingDetails {
  isRoundTrip: true;
  totalPayable: number;
  expiresAt: string;
  outbound: LegDetail;
  return: LegDetail;
}

export type BookingDetails = SingleBookingDetails | RoundBookingDetails;

export enum PaymentMethod {
  WALLET = 'WALLET',
  RAZORPAY = 'RAZORPAY',
}

export interface ConfirmPaymentDto {
  paymentMethod: PaymentMethod;
  returnBookingId?: string;
  walletAmount?: number;
}

export interface ApplyCouponDto {
  couponCode: string;
  returnBookingId?: string;
}
