import { useMutation, useQuery } from "@tanstack/react-query";
import NotificationService from "../services/NotificationService";
import { INotification, INotificationListResponse } from "../types/notificationsList.types";

export const useFetchNotificationList = () => {
  return useQuery<INotificationListResponse, unknown, INotification[]>({
    queryKey: ['notificationList'],
    queryFn: () => NotificationService.getNotificationList(),
    // select: (res) => (Array.isArray(res?.data) ? res.data : []),
    // enabled: true,
    // staleTime: 5 * 60 * 1000,
    // retry: 2,
  });
};

export const useSingleNotificationRead = (onSuccess: (data: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn:({id}: {id: string})=> NotificationService.markSingleNotificationRead(id),
    onSuccess,
    onError,
  });
};
