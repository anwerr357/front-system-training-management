
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Training {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  enrolledCount?: number;
  instructorId?: number;
  instructorName?: string;
}

// Hook to fetch all trainings
export const useTrainings = () => {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: async (): Promise<Training[]> => {
      console.log('Fetching all trainings from', `${API_URL}/trainings`);
      const response = await axios.get(`${API_URL}/trainings`);
      return response.data;
    }
  });
};

// Hook to fetch a single training
export const useTraining = (trainingId: number | null) => {
  return useQuery({
    queryKey: ['trainings', trainingId],
    queryFn: async (): Promise<Training> => {
      if (!trainingId) throw new Error('No training ID provided');
      console.log('Fetching training by ID from', `${API_URL}/trainings/${trainingId}`);
      const response = await axios.get(`${API_URL}/trainings/${trainingId}`);
      return response.data;
    },
    enabled: !!trainingId
  });
};

// Hook for CRUD operations on trainings
export const useTrainingActions = () => {
  const queryClient = useQueryClient();
  
  // Create a new training
  const createTraining = useMutation({
    mutationFn: async (trainingData: Omit<Training, 'id'>) => {
      console.log('Creating new training with data', trainingData);
      const response = await axios.post(`${API_URL}/trainings`, trainingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    }
  });
  
  // Update an existing training
  const updateTraining = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Training> }) => {
      console.log('Updating training', id, 'with data', data);
      const response = await axios.put(`${API_URL}/trainings/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    }
  });
  
  // Delete a training
  const deleteTraining = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting training', id);
      await axios.delete(`${API_URL}/trainings/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    }
  });
  
  return {
    createTraining,
    updateTraining,
    deleteTraining
  };
};
