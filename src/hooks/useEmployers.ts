
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Employer, EmployerFormData, Instructor } from '@/types/employer';

const API_URL = 'http://localhost:8080/api';

export const useEmployers = () => {
  const queryClient = useQueryClient();

  // Fetch all employers
  const employers = useQuery({
    queryKey: ['employers'],
    queryFn: async (): Promise<Employer[]> => {
      const response = await axios.get(`${API_URL}/employers`);
      return response.data;
    }
  });

  // Fetch a single employer by ID
  const getEmployer = (id: number) => {
    return useQuery({
      queryKey: ['employers', id],
      queryFn: async (): Promise<Employer> => {
        const response = await axios.get(`${API_URL}/employers/${id}`);
        return response.data;
      },
      enabled: !!id
    });
  };

  // Fetch instructors for a specific employer
  const getEmployerInstructors = (employerId: number) => {
    return useQuery({
      queryKey: ['employers', employerId, 'instructors'],
      queryFn: async (): Promise<Instructor[]> => {
        const response = await axios.get(`${API_URL}/employers/${employerId}/instructors`);
        return response.data;
      },
      enabled: !!employerId
    });
  };

  // Create a new employer
  const createEmployer = useMutation({
    mutationFn: async (data: EmployerFormData): Promise<Employer> => {
      const response = await axios.post(`${API_URL}/employers`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
    }
  });

  // Update an employer
  const updateEmployer = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EmployerFormData }): Promise<Employer> => {
      const response = await axios.put(`${API_URL}/employers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
      queryClient.invalidateQueries({ queryKey: ['employers', variables.id] });
    }
  });

  // Delete an employer
  const deleteEmployer = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/employers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
    }
  });

  return {
    employers,
    getEmployer,
    getEmployerInstructors,
    createEmployer,
    updateEmployer,
    deleteEmployer,
    isLoading: employers.isLoading,
    error: employers.error
  };
};
