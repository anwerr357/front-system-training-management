
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Participant {
  id: number;
  name: string;
  email: string;
  userId: number;
}

// Hook to fetch all participants - GET http://localhost:8080/api/participants
export const useParticipants = (instructorIds: number[] = []) => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: async (): Promise<Participant[]> => {
      console.log('Fetching all participants from', `${API_URL}/participants`);
      console.log('Will filter out participants who are already instructors with IDs:', instructorIds);
      const response = await axios.get(`${API_URL}/participants`);
      return response.data;
    }
  });
};
