
import axios from 'axios';
import { Domain, DomainFormData } from '@/types/domain';

const BASE_URL = 'http://localhost:8080/api/domains';

export const getAllDomains = async (): Promise<Domain[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getDomainById = async (id: number): Promise<Domain> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createDomain = async (data: DomainFormData): Promise<Domain> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateDomain = async (id: number, data: DomainFormData): Promise<Domain> => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteDomain = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getDomainTrainings = async (domainId: number) => {
  const response = await axios.get(`${BASE_URL}/${domainId}/trainings`);
  return response.data;
};
