import { ICommute, Timing } from '../types/commute.types';
import { ScreenNames } from './constant';

export type RootStackParamList = {
  [ScreenNames.DASHBOARD_SCREEN]: undefined;
  [ScreenNames.LOGIN_SCREEN]: undefined;
  [ScreenNames.VIEW_PROFILE]: undefined;
  [ScreenNames.SUGGEST_YOUR_STOPS]: undefined;
  [ScreenNames.TRACK_RIDE_SCREEN]: { ticketId: string };
  [ScreenNames.TICKET_DETAIL_SCREEN]: { ticketId: string };
  [ScreenNames.MAIN_SCREEN]: undefined;
  [ScreenNames.SET_PROFILE_SCREEN]: { isFromRegister?: boolean } | undefined;
  [ScreenNames.HOME_SCREEN]: undefined;
  [ScreenNames.WALLET_SCREEN]: undefined;
  [ScreenNames.HISTORY_SCREEN]: undefined;
  [ScreenNames.CONFIRM_BOOKING_DETAILS]: { bookingId: string };
  [ScreenNames.BOOKING_OPTIONS]: { outbound: { result: ICommute; timing: Timing } };
  [ScreenNames.PAYMENT_OPTIONS]: { bookingId: string; returnBookingId?: string; totalAmount: number };
  [ScreenNames.BOOKING_SUCCESS]: { bookingId: string };
  [ScreenNames.SEAT_SELECTION]: { tripId: string; bookingId: string; initialSeatNumber?: string; returnBookingId?: string };
  [ScreenNames.BUS_SELECTION_SCREEN]:
    | { isReturnLeg?: boolean; outboundBookingId?: string; outbound?: { result: ICommute; timing: Timing } }
    | undefined;
  [ScreenNames.FULL_ROUTE_SCREEN]: { tripData: ICommute; initialOpenId?: string };
  [ScreenNames.NOTIFICATION_SCREEN]: undefined;
  [ScreenNames.SET_COMMUTE]: undefined;
  [ScreenNames.FIND_COMMUTE]: undefined;
  [ScreenNames.POLICY_SCREEN]: undefined;
  [ScreenNames.RENT_A_BUS_SCREEN]: undefined;
  [ScreenNames.ACCOUNT_SETTING_SCREEN]: undefined;
};
