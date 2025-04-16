
import axios from 'axios';
import { Profile, ProfileFormData } from '@/types/profile';

const BASE_URL = 'http://localhost:8080/api/profiles';

export const getAllProfiles = async (): Promise<Profile[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getProfileById = async (id: number): Promise<Profile> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createProfile = async (data: ProfileFormData): Promise<Profile> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateProfile = async (id: number, data: ProfileFormData): Promise<Profile> => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteProfile = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getProfileParticipants = async (profileId: number) => {
  const response = await axios.get(`${BASE_URL}/${profileId}/participants`);
  return response.data;
};
