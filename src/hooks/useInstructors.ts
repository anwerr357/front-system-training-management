
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  employerId?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  type?: string;
  specialty?: string;
  availability?: string;
}

export interface InstructorFormData {
  userId?: number;
  phone: string;
  employerId?: number;
  firstName?: string;
  lastName?: string;
  type?: string;
  email?: string;
  role?: string;  // Added role field
}

export interface Training {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Hook to fetch all instructors - GET http://localhost:8080/api/instructors
export const useInstructors = () => {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async (): Promise<Instructor[]> => {
      console.log('Fetching all instructors from', `${API_URL}/instructors`);
      const response = await axios.get(`${API_URL}/instructors`);
      return response.data;
    }
  });
};

// Hook to fetch a single instructor - GET http://localhost:8080/api/instructors/:id
export const useInstructor = (instructorId: number | null) => {
  return useQuery({
    queryKey: ['instructors', instructorId],
    queryFn: async (): Promise<Instructor> => {
      if (!instructorId) throw new Error('No instructor ID provided');
      console.log('Fetching instructor by ID from', `${API_URL}/instructors/${instructorId}`);
      const response = await axios.get(`${API_URL}/instructors/${instructorId}`);
      return response.data;
    },
    enabled: !!instructorId
  });
};

// Hook to fetch instructor trainings - GET http://localhost:8080/api/instructors/:instructorId/trainings
export const useInstructorTrainings = (instructorId: number | null) => {
  return useQuery({
    queryKey: ['instructors', instructorId, 'trainings'],
    queryFn: async (): Promise<Training[]> => {
      if (!instructorId) throw new Error('No instructor ID provided');
      console.log('Fetching instructor trainings from', `${API_URL}/instructors/${instructorId}/trainings`);
      const response = await axios.get(`${API_URL}/instructors/${instructorId}/trainings`);
      return response.data;
    },
    enabled: !!instructorId
  });
};

// Hook for CRUD operations on instructors
export const useInstructorActions = () => {
  const queryClient = useQueryClient();
  
  // Create a new instructor - POST http://localhost:8080/api/instructors
  const createInstructor = useMutation({
    mutationFn: async (instructorData: InstructorFormData) => {
      console.log('Creating new instructor with data', instructorData);
      console.log('POST request to', `${API_URL}/instructors`);
      const response = await axios.post(`${API_URL}/instructors`, instructorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });
  
  // Update an existing instructor - PUT http://localhost:8080/api/instructors/:id
  const updateInstructor = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InstructorFormData }) => {
      console.log('Updating instructor', id, 'with data', data);
      console.log('PUT request to', `${API_URL}/instructors/${id}`);
      const response = await axios.put(`${API_URL}/instructors/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });
  
  // Delete an instructor - DELETE http://localhost:8080/api/instructors/:id
  const deleteInstructor = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting instructor', id);
      console.log('DELETE request to', `${API_URL}/instructors/${id}`);
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
