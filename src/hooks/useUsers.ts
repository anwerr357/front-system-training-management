
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@/types/employer';

const API_URL = 'http://localhost:8080/api';

export const useUsers = (instructorUserIds: number[] = [], participantUserIds: number[] = []) => {
  // Fetch all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      console.log('Fetching all users from', `${API_URL}/users`);
      console.log('Will filter out users who are already instructors with IDs:', instructorUserIds);
      console.log('Will filter out users who are already participants with IDs:', participantUserIds);
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    }
  });

  // Filter out users who are already assigned as instructors or are participants
  const eligibleUsers = usersQuery.data?.filter(user => {
    // Check if user's ID is in the instructor's userId list
    const isInstructor = instructorUserIds.includes(user.id);
    
    // Check if user's ID is in the participant's userId list
    const isParticipant = participantUserIds.includes(user.id);
    
    // Keep users who are neither instructors nor participants
    return !isInstructor && !isParticipant;
  }) || [];

  return {
    users: usersQuery,
    eligibleUsers,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error
  };
};
