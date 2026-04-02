import { fetchData, handleErrorResponse, patchData } from './ApiUtility';
import { INotificationListResponse } from '../types/notificationsList.types';

class NotificationService {
  baseUrl = '/notifications';

    // get notificatin stats for current user
  getNotificationStats = async () => {
    const url = `${this.baseUrl}/stats`;
    const res = await fetchData(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };


  // List of notifications for current user
  getNotificationList = async () => {
    const url = `${this.baseUrl}`;
    const res = await fetchData(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };

  // get notification details
  getNotificationDetails = async ({ id }: { id: string }) => {
    const url = `${this.baseUrl}/${id}`;
    const res = await fetchData(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };

  // Mark Notification as read
  markSingleNotificationRead = async ( id : string) => {
    const url = `${this.baseUrl}/${id}/read`;
    const res = await patchData(url, {});

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  //   Mark all notifications as read for current user
  markAllNotificationsRead = async () => {
    const url = `${this.baseUrl}/read-all`;
    const res = await patchData(url, {});

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };


}

export default new NotificationService();
