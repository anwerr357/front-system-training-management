
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Training, TrainingFormData } from '@/types/training';
interface EnrollmentRequestDto {
  trainingId: number;
  userId: number;
  description: string;
}
const API_URL = 'http://localhost:8080/api';

// Hook to fetch all trainings
export const useTrainings = () => {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: async (): Promise<Training[]> => {
      const response = await axios.get(`${API_URL}/trainings`);
      return response.data.map((training: Training) => ({
        ...training,
        status: calculateTrainingStatus(training)
      }));
    }
  });
};

const calculateTrainingStatus = (training: Training): 'Upcoming' | 'Active' | 'Completed' => {
  const start = new Date(`${training.startDate}T${training.startTime}`);
  const end = new Date(start.getTime() + (training.duration * 24 * 60 * 60 * 1000));
  const now = new Date();

  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'Active';
};

// Hook to fetch a single training
export const useTraining = (trainingId: number | null) => {
  return useQuery({
    queryKey: ['trainings', trainingId],
    queryFn: async (): Promise<Training> => {
      if (!trainingId) throw new Error('No training ID provided');
      // console.log('Fetching training by ID from', `${API_URL}/trainings/${trainingId}`);
      const response = await axios.get(`${API_URL}/trainings/${trainingId}`);
      return response.data;
    },
    enabled: !!trainingId
  });
};

// Hook to send request to the admin to enroll for a certain training



export const useTrainingRequest = () => {
  return useMutation({
    mutationFn: async (data: EnrollmentRequestDto): Promise<EnrollmentRequestDto> => {
      console.log("data: ",data);
      console.log('Creating enrollment request at', `${API_URL}/enrollments`);
      const response = await axios.post(`${API_URL}/enrollments`, data);
      return response.data;
    },
  });
};


// Hook for CRUD operations on trainings
export const useTrainingActions = () => {
  const queryClient = useQueryClient();
  
  // Create a new training
  const createTraining = useMutation({
    mutationFn: async (trainingData: Omit<Training, 'id' | 'status' | 'endDate' | 'endTime' | 'instructorName' | 'domainName' | 'enrolledCount'>) => {
      // console.log('Creating new training with data', trainingData);
      const response = await axios.post(`${API_URL}/trainings`, trainingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    }
  });
  
  // Update an existing training
  const updateTraining = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<Training, 'id' | 'status' | 'endDate' | 'endTime' | 'instructorName' | 'domainName' | 'enrolledCount'>> }) => {
      // console.log('Updating training', id, 'with data', data);
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
      // console.log('Deleting training', id);
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
