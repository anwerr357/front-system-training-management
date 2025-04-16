
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllProfiles, 
  createProfile, 
  updateProfile, 
  deleteProfile,
  getProfileParticipants
} from '@/api/profiles';
import { ProfileFormData } from '@/types/profile';

export function useProfiles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const profiles = useQuery({
    queryKey: ['profiles'],
    queryFn: getAllProfiles
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "Profile created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive"
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProfileFormData }) => 
      updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id: number) => deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "Profile deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive"
      });
    }
  });

  const getProfileParticipantsQuery = (profileId: number) => useQuery({
    queryKey: ['profileParticipants', profileId],
    queryFn: () => getProfileParticipants(profileId),
    enabled: !!profileId
  });

  return {
    profiles,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    deleteProfile: deleteProfileMutation.mutate,
    isLoading: profiles.isLoading || 
               createProfileMutation.isPending || 
               updateProfileMutation.isPending || 
               deleteProfileMutation.isPending,
    getProfileParticipants: getProfileParticipantsQuery
  };
}
