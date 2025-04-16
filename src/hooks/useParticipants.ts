
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Participant {
  id: number;
  name: string;
  email: string;
  userId: number;
}

export const useParticipants = (instructorIds: number[] = []) => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: async (): Promise<Participant[]> => {
      const response = await axios.get(`${API_URL}/participants`);
      return response.data;
    }
  });
};
