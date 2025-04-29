
export interface Employer {
  id: number;
  employerName: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployerFormData {
  id?: number;
  employerName?: string;
  email?: string;
  password?: string;
  role?: string;
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
