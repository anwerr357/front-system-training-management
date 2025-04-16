
export interface Employer {
  id: number;
  employerName: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployerFormData {
  employerName: string;
  userId?: number | undefined;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  employerId?: number;
  firstName?: string;
  lastName?: string;
  type?: string;
  phone?: string;
  userId?: number;
  specialty?: string;
  availability?: string;
  specialization?: string;
}
