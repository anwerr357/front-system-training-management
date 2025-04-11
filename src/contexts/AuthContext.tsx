
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// User types
export type UserRole = 'admin' | 'employer' | 'instructor' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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

// Sample users for demonstration
const demoUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' as UserRole },
  { id: '2', name: 'Employer User', email: 'employer@example.com', password: 'employer123', role: 'employer' as UserRole },
  { id: '3', name: 'Instructor User', email: 'instructor@example.com', password: 'instructor123', role: 'instructor' as UserRole },
  { id: '4', name: 'Participant User', email: 'participant@example.com', password: 'participant123', role: 'participant' as UserRole },
];

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
    // In a real app, we would validate credentials with an API
    const foundUser = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // Remove password before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    // Redirect based on role
    switch (foundUser.role) {
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
