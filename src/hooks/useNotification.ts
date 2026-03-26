import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationService from '../services/NotificationService';
import { INotification, INotificationListResponse } from '../types/notificationsList.types';
import { INotificationStatsResponse } from '../types/notificationStats.types';

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => NotificationService.markSingleNotificationRead(id),
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ['notificationList'] });
      await queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      onSuccess(data);
    },
    onError,
  });
};

export const useGetNotificationStats = () => {
  return useQuery<INotificationStatsResponse>({
    queryKey: ['notification-stats'],
    queryFn: () => NotificationService.getNotificationStats(),
    enabled: true,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time feel
  });
};

export const useMarkAllNotificationsRead = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.markAllNotificationsRead(),
    onSuccess: async data => {
      queryClient.setQueryData<INotificationStatsResponse>(['notification-stats'], previous =>
        previous
          ? { ...previous, unreadCount: 0 }
          : { sentCount: 0, unreadCount: 0, openRate: 0, criticalAlerts: 0 },
      );
      await queryClient.invalidateQueries({ queryKey: ['notificationList'] });
      await queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      onSuccess?.(data);
    },
    onError: error => {
      onError?.(error);
    },
  });
};

