// frontend/src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('finance_auth_token');
    if (token) {
      // Optionally validate token with backend here
      // For simplicity, assume it's valid and fetch user data if needed
      setUser({ id: '', name: '', email: '', token }); // Placeholder; fetch real user data if available
      console.log('Token found on mount:', token); // Debug log
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('finance_auth_token', data.token);
      console.log('Token stored after login:', data.token); // Debug log
      setUser({ id: data.id, name: data.name, email: data.email, avatar: data.avatar, token: data.token });
      navigate('/dashboard');
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      console.log('Backend response:', data); // Debug log
      if (!response.ok) throw new Error(data.message || 'Google login failed');
      localStorage.setItem('finance_auth_token', data.token);
      console.log('Token stored after Google login:', data.token); // Debug log
      setUser({ id: data.id, name: data.name, email: data.email, avatar: data.avatar, token: data.token });
      navigate('/dashboard');
      toast.success('Logged in with Google successfully');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('finance_auth_token');
    setUser(null);
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const value = { user, login, googleLogin, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};