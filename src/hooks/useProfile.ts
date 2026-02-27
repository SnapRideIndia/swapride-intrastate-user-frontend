import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProfileService, { ProfileObj } from "../services/ProfileService";

export const useFetchCurrentProfile = () => {
    return useQuery({
        queryKey: ["currentProfile"],
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
        queryKey: ["travelPreferences"],
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
            queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
        },
    });
};
