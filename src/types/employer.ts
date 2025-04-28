
// If this file doesn't exist, it will be created

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role?: string;
}

export interface Employer {
  id: number;
  employerName: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployerFormData {
  employerName: string;
  userId?: number;
  email?: string;
  password?: string;
  role?: string;
}
