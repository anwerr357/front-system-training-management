import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@/types/employer';

const API_URL = 'http://localhost:8080/api';

export const useUsers = (instructorUserIds: number[] = [], participantUserIds: number[] = []) => {
  // Fetch all users
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      console.log('Fetching all users from', `${API_URL}/users`);
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    }
  });

  // Filter out users who are already assigned as instructors or are participants
  const eligibleUsers = users.data?.filter(user => {
    // Filter out users who are already instructors
    const isInstructor = instructorUserIds.includes(user.id);
    
    // Filter out users who are already participants
    const isParticipant = participantUserIds.includes(user.id);
    
    // Keep users who are neither instructors nor participants
    return !isInstructor && !isParticipant;
  }) || [];

  return {
    users,
    eligibleUsers,
    isLoading: users.isLoading,
    error: users.error
  };
};
