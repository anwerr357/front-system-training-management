
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  structureId?: number;
  profileId?: number;
  trainingId?: number;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  structureId?: number;
  profileId?: number;
  trainingId?: number;
  userId: number;
}

export interface Training {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endDate: string;
  status: string;
  duration:number;
}

export interface Structure {
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  title: string;
}

// Hook to fetch all participants - GET http://localhost:8080/api/participants
export const useParticipants = () => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: async (): Promise<Participant[]> => {
      console.log('Fetching all participants from', `${API_URL}/participants`);
      const response = await axios.get(`${API_URL}/participants`);
      return response.data;
    }
  });
};

// Hook to fetch a single participant - GET http://localhost:8080/api/participants/:id
export const useParticipant = (participantId: number | null) => {
  return useQuery({
    queryKey: ['participants', participantId],
    queryFn: async (): Promise<Participant> => {
      if (!participantId) throw new Error('No participant ID provided');
      console.log('Fetching participant by ID from', `${API_URL}/participants/${participantId}`);
      const response = await axios.get(`${API_URL}/participants/${participantId}`);
      return response.data;
    },
    enabled: !!participantId
  });
};

// Hook to fetch participant trainings - GET http://localhost:8080/api/participants/:participantId/trainings
export const useParticipantTrainings = (participantId: number | null) => {
  console.log('Fetching participant trainings from', `${API_URL}/participants/${participantId}/trainings`);

  return useQuery({
    queryKey: ['participants', participantId, 'trainings'],
    queryFn: async (): Promise<Training[]> => {

      if (!participantId) throw new Error('No participant ID provided');
      const response = await axios.get(`${API_URL}/participants/${participantId}/trainings`);
       console.log("user fetched trainings: " , response.data);
      return response.data;
    },
    enabled: !!participantId
  });
};

// Hook for CRUD operations on participants
export const useParticipantActions = () => {
  const queryClient = useQueryClient();
  
  // Create a new participant - POST http://localhost:8080/api/participants
  const createParticipant = useMutation({
    mutationFn: async (participantData: ParticipantFormData) => {
      console.log('Creating new participant with data', participantData);
      console.log('POST request to', `${API_URL}/participants`);
      const response = await axios.post(`${API_URL}/participants`, participantData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    }
  });
  
  // Update an existing participant - PUT http://localhost:8080/api/participants/:id
  const updateParticipant = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ParticipantFormData }) => {
      console.log('Updating participant', id, 'with data', data);
      console.log('PUT request to', `${API_URL}/participants/${id}`);
      const response = await axios.put(`${API_URL}/participants/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    }
  });
  
  // Delete a participant - DELETE http://localhost:8080/api/participants/:id
  const deleteParticipant = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting participant', id);
      console.log('DELETE request to', `${API_URL}/participants/${id}`);
      await axios.delete(`${API_URL}/participants/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    }
  });
  
  return {
    createParticipant,
    updateParticipant,
    deleteParticipant
  };
};

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
export const useAddParticipantToTraining = () => {
  return useMutation({
    mutationFn: async ({
      trainingId,
      participantId 
    }: {
      trainingId: any;
      participantId: any;
    }) => {
      console.log(`${API_URL}/trainings/${trainingId}/participants/${participantId}`)

      const response = await axios.post(
        `${API_URL}/trainings/${trainingId}/participants/${participantId}`
      );
      return response.data;
    },
    // Optional: Add onSuccess and onError handlers
    onSuccess: () => {
      console.log('Participant added successfully');
    },
    onError: (error) => {

      console.error('Error adding participant:', error);
    }
  });
};
// Hook to fetch all structures
export const useStructures = () => {
  return useQuery({
    queryKey: ['structures'],
    queryFn: async (): Promise<Structure[]> => {
      console.log('Fetching all structures from', `${API_URL}/structures`);
      const response = await axios.get(`${API_URL}/structures`);
      return response.data;
    }
  });
};
