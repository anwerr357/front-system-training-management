
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Instructor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  availability: string;
  employerId?: number;
  userId: number;
}

export interface InstructorFormData {
  userId: number;
  specialty: string;
  phone: string;
  availability: string;
  employerId?: number;
}

export interface Training {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Hook to fetch all instructors
export const useInstructors = () => {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async (): Promise<Instructor[]> => {
      const response = await axios.get(`${API_URL}/instructors`);
      return response.data;
    }
  });
};

// Hook to fetch a single instructor
export const useInstructor = (instructorId: number | null) => {
  return useQuery({
    queryKey: ['instructors', instructorId],
    queryFn: async (): Promise<Instructor> => {
      if (!instructorId) throw new Error('No instructor ID provided');
      const response = await axios.get(`${API_URL}/instructors/${instructorId}`);
      return response.data;
    },
    enabled: !!instructorId
  });
};

// Hook to fetch instructor trainings
export const useInstructorTrainings = (instructorId: number | null) => {
  return useQuery({
    queryKey: ['instructors', instructorId, 'trainings'],
    queryFn: async (): Promise<Training[]> => {
      if (!instructorId) throw new Error('No instructor ID provided');
      const response = await axios.get(`${API_URL}/instructors/${instructorId}/trainings`);
      return response.data;
    },
    enabled: !!instructorId
  });
};

// Hook for CRUD operations on instructors
export const useInstructorActions = () => {
  const queryClient = useQueryClient();
  
  // Create a new instructor
  const createInstructor = useMutation({
    mutationFn: async (instructorData: InstructorFormData) => {
      const response = await axios.post(`${API_URL}/instructors`, instructorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });
  
  // Update an existing instructor
  const updateInstructor = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InstructorFormData }) => {
      const response = await axios.put(`${API_URL}/instructors/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });
  
  // Delete an instructor
  const deleteInstructor = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/instructors/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });
  
  return {
    createInstructor,
    updateInstructor,
    deleteInstructor
  };
};
