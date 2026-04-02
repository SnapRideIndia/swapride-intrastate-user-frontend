import { ScreenNames } from '../navigation/constant';
import { INotification } from '../types/notificationsList.types';

export const handleNotificationNavigation = (
  notification: INotification,
  navigation: any
) => {
  const { type, metadata } = notification;

  switch (type) {
    case 'BOOKING':
      if (metadata?.bookingId) {
        navigation.navigate(ScreenNames.TICKET_DETAIL_SCREEN, {
          ticketId: metadata.bookingId,
        });
      }
      break;

    case 'WALLET_UPDATE':
      if (metadata?.referenceId) {
        navigation.navigate(ScreenNames.TRANSACTION_DETAIL_SCREEN, {
          transactionId: metadata.referenceId,
        });
      } else {
        navigation.navigate(ScreenNames.TRANSACTION_HISTORY_SCREEN);
      }
      break;

    case 'PROXIMITY_ALERT':
    case 'TRIP_UPDATE':
      if (metadata?.bookingId) {
        navigation.navigate(ScreenNames.TRACK_RIDE_SCREEN, {
          ticketId: metadata.bookingId,
        });
      }
      break;

    case 'STOP_SUGGESTION':
      navigation.navigate(ScreenNames.MY_SUGGESTIONS);
      break;

    case 'RENTAL_REQUEST':
      if (metadata?.rentalId) {
        navigation.navigate(ScreenNames.RENTAL_DETAILS_SCREEN, {
          rentalId: metadata.rentalId,
        });
      }
      break;

    default:
      console.warn(`[NotificationNavigation] No specific handler for type: ${type}. Staying on current screen or falling back to list.`);
      break;
  }
};
