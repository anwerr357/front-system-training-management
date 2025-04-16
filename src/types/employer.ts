
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
  specialization?: string;
  employerId?: number;
  firstName?: string;
  lastName?: string;
  type?: string;
  specialty?: string;
  phone?: string;
  availability?: string;
}
