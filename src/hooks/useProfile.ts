import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileService, { ProfileObj } from '../services/ProfileService';

export const useFetchCurrentProfile = () => {
  return useQuery({
    queryKey: ['currentProfile'],
    queryFn: () => {
      return ProfileService.getCurrentUserProfile();
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFetchTravelPreferences = () => {
  return useQuery({
    queryKey: ['travelPreferences'],
    queryFn: () => ProfileService.getTravelPreferences(),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileObj, profileImageUri }: { profileObj: ProfileObj; profileImageUri: string | null }) =>
      ProfileService.updateProfile(profileObj, profileImageUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentProfile'] });
    },
  });
};

export const useUpdateTravelPreference = (onSuccess: (data: any) => void, onError: (error: any) => void)=>{
    return useMutation({
      mutationFn: ({endpoint, payload}: {endpoint: "/home" | "/office", payload: any})=>ProfileService.updateTravelPreference(endpoint, payload),
      onSuccess,
      onError,
    });
}

export const useUpdateOfficeTimings = (onSuccess: (data: any) => void, onError: (error: any) => void)=>{
    return useMutation({
      mutationFn: ({payload}: {payload: any})=>ProfileService.updateOfficeTimings("office-timings", payload),
      onSuccess,
      onError,
    });
}

export const useDeleteProfile = (onSuccess: (data: any) => void, onError: (error: any) => void)=>{
    return useMutation({
      mutationFn: ProfileService.deleteProfile,
      onSuccess,
      onError,
    });
}