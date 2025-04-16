
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@/types/employer';

const API_URL = 'http://localhost:8080/api';

export const useUsers = (currentEmployerIds: number[] = []) => {
  // Fetch all users
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    }
  });

  // Filter out users who are already assigned as employers
  const eligibleUsers = users.data?.filter(user => {
    // Filter out users who are already assigned to employers
    return !currentEmployerIds.includes(user.id);
  }) || [];

  return {
    users,
    eligibleUsers,
    isLoading: users.isLoading,
    error: users.error
  };
};
