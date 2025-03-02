// hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (credential: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('finance_auth_user');
        const savedToken = localStorage.getItem('finance_auth_token');
        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser({ ...parsedUser, token: savedToken });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('finance_auth_user');
        localStorage.removeItem('finance_auth_token');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid credentials');
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`,
        token: data.token,
      };
      localStorage.setItem('finance_auth_user', JSON.stringify(userData));
      localStorage.setItem('finance_auth_token', data.token);
      setUser(userData);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please check your credentials and try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`,
        token: data.token,
      };
      localStorage.setItem('finance_auth_user', JSON.stringify(userData));
      localStorage.setItem('finance_auth_token', data.token);
      setUser(userData);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google login failed');
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${data.email}`,
        token: data.token,
      };
      localStorage.setItem('finance_auth_user', JSON.stringify(userData));
      localStorage.setItem('finance_auth_token', data.token);
      setUser(userData);
      toast.success('Logged in with Google successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('finance_auth_user');
    localStorage.removeItem('finance_auth_token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};