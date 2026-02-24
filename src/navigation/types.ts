import { ScreenNames } from './constant';

export type RootStackParamList = {
  [ScreenNames.DASHBOARD_SCREEN]: undefined;
  [ScreenNames.LOGIN_SCREEN]: undefined;
  [ScreenNames.VIEW_PROFILE]: undefined;
  [ScreenNames.SUGGEST_YOUR_STOPS]: undefined;
  [ScreenNames.TRACK_RIDE_SCREEN]: { ticketId: string };
  [ScreenNames.TICKET_DETAIL_SCREEN]: { ticketId: string };
  [ScreenNames.MAIN_SCREEN]: undefined;
  [ScreenNames.SET_PROFILE_SCREEN]: undefined;
  [ScreenNames.HOME_SCREEN]: undefined;
  [ScreenNames.WALLET_SCREEN]: undefined;
  [ScreenNames.HISTORY_SCREEN]: undefined;
  [ScreenNames.TICKET_DETAIL_SCREEN]: { ticketId: string };
};
