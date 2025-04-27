
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8080/api';

// User types
export type UserRole = 'admin' | 'employer' | 'instructor' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Additional fields from API
  roleId: number;
}

// Auth Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Default context value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Fetch all users
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;
      
      // Find user by email and password
      console.log("email: ",email);
      console.log("password: ",password);
      
      const foundUser = users.find(
        (u: any) => u.login === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Fetch role information
      const roleResponse = await axios.get(`${API_URL}/roles/${foundUser.roleId}`);
      const userRole = roleResponse.data;
      

      console.log("found user: ",foundUser);

      // Create user object with role information
      const authenticatedUser = {
        id: foundUser.id.toString(),
        name: foundUser.name,
        email: foundUser.login,
        roleId: foundUser.roleId,
        role: userRole.name.toLowerCase() as UserRole
      };

      // Save user to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));

      // Redirect based on role
      switch (authenticatedUser.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        case 'instructor':
          navigate('/instructor/trainings');
          break;
        case 'participant':
          navigate('/user/trainings');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials or server error');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
