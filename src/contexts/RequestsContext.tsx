
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Request {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  type: 'training' | 'certificate' | 'support' | 'enrollment' | 'other';
  status: RequestStatus;
  createdAt: string;
  updatedAt: string | null;
  reviewedBy: string | null;
  trainingId?: string;
  trainingName?: string;
}

interface RequestsContextType {
  requests: Request[];
  userRequests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviewedBy'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, reviewerName: string) => void;
  getRequestById: (id: string) => Request | undefined;
}

const RequestsContext = createContext<RequestsContextType>({
  requests: [],
  userRequests: [],
  addRequest: () => {},
  updateRequestStatus: () => {},
  getRequestById: () => undefined,
});

// Demo requests for testing
const demoRequests: Request[] = [
  {
    id: '1',
    userId: '4',
    userName: 'Emily Davis',
    userEmail: 'emily.d@example.com',
    title: 'Advanced React Training Request',
    description: 'I would like to register for the advanced React training course scheduled for next month.',
    type: 'training',
    status: 'pending',
    createdAt: '2025-04-08T10:30:00Z',
    updatedAt: null,
    reviewedBy: null,
  },
  {
    id: '2',
    userId: '4',
    userName: 'Emily Davis',
    userEmail: 'emily.d@example.com',
    title: 'Certificate Request',
    description: 'I completed the Python Fundamentals course and would like to request my certificate.',
    type: 'certificate',
    status: 'approved',
    createdAt: '2025-04-05T14:20:00Z',
    updatedAt: '2025-04-07T09:15:00Z',
    reviewedBy: 'Alex Johnson',
  },
  {
    id: '3',
    userId: '8',
    userName: 'Jessica Lee',
    userEmail: 'jlee@example.com',
    title: 'Technical Support Request',
    description: 'I am unable to access the course materials for Data Science Basics. Please assist.',
    type: 'support',
    status: 'rejected',
    createdAt: '2025-04-06T16:45:00Z',
    updatedAt: '2025-04-07T11:30:00Z',
    reviewedBy: 'Alex Johnson',
  },
  {
    id: '4',
    userId: '8',
    userName: 'Jessica Lee',
    userEmail: 'jlee@example.com',
    title: 'Request for New Training Materials',
    description: 'I would like to suggest adding more content on machine learning algorithms to the Data Science course.',
    type: 'other',
    status: 'pending',
    createdAt: '2025-04-10T08:15:00Z',
    updatedAt: null,
    reviewedBy: null,
  },
  {
    id: '5',
    userId: '4',
    userName: 'Emily Davis',
    userEmail: 'emily.d@example.com',
    title: 'Enrollment: Data Science Basics',
    description: 'I would like to enroll in the Data Science Basics course to improve my analytical skills.',
    type: 'enrollment',
    status: 'pending',
    createdAt: '2025-04-12T09:30:00Z',
    updatedAt: null,
    reviewedBy: null,
    trainingId: 'DS101',
    trainingName: 'Data Science Basics'
  },
  {
    id: '6',
    userId: '8',
    userName: 'Jessica Lee',
    userEmail: 'jlee@example.com',
    title: 'Enrollment: Advanced JavaScript',
    description: 'I would like to join the Advanced JavaScript course to enhance my front-end development skills.',
    type: 'enrollment',
    status: 'approved',
    createdAt: '2025-04-11T14:45:00Z',
    updatedAt: '2025-04-12T10:15:00Z',
    reviewedBy: 'Alex Johnson',
    trainingId: 'JS201',
    trainingName: 'Advanced JavaScript'
  },
];

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>(demoRequests);
  const { user } = useAuth();
  
  // Filter requests for the current user
  const userRequests = requests.filter(
    request => user && request.userId === user.id
  );
  
  // Add a new request
  const addRequest = (requestData: Omit<Request, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviewedBy'>) => {
    const newRequest: Request = {
      ...requestData,
      id: (requests.length + 1).toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      reviewedBy: null,
    };
    
    setRequests(prevRequests => [...prevRequests, newRequest]);
  };
  
  // Update the status of a request
  const updateRequestStatus = (id: string, status: RequestStatus, reviewerName: string) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? {
              ...request,
              status,
              updatedAt: new Date().toISOString(),
              reviewedBy: reviewerName,
            }
          : request
      )
    );
  };
  
  // Get a request by ID
  const getRequestById = (id: string) => {
    return requests.find(request => request.id === id);
  };
  
  return (
    <RequestsContext.Provider
      value={{
        requests,
        userRequests,
        addRequest,
        updateRequestStatus,
        getRequestById,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

// Custom hook to use the requests context
export const useRequests = () => useContext(RequestsContext);
