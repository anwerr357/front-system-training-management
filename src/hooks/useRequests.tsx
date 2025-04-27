import axios from 'axios';

const API_URL = "http://localhost:8080/api"; // <-- Replace with your real API URL

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
import { useQuery } from '@tanstack/react-query';

export interface Request {
  id: string;
  userId: string;
  trainingId: string;
  requestDate: string;
  status: RequestStatus;
  description: string;
}

// Function to fetch requests from the API based on the status
const fetchRequests = async (status: RequestStatus) => {
  try {
    const response = await axios.get(`${API_URL}/enrollments/status/${status}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching requests');
  }
};

export const UpdateRequest = async (request: Request,requestStatus:RequestStatus) => {
    try {
      request.status=requestStatus
      console.log(request)
      console.log(request.id)
      const response = await axios.put<Request>(`${API_URL}/enrollments/${request.id}`,request);
      return response.data;
    } catch (error) {
      throw new Error('Error updating requests');
    }
  };
  
  
export const useRequests = (status: RequestStatus) => {
    return useQuery<Request[], Error>({
      queryKey: ['requests', status],  // Add status to the query key to cache the data separately
      queryFn: () => fetchRequests(status),  // Pass the status to the fetch function
    });
  };
