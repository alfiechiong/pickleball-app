import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { User, LoginCredentials, RegisterData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
        const user = await authService.getCurrentUser();
        setUser(user);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      await AsyncStorage.setItem('accessToken', response.data.token);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.data.user);
      setToken(response.data.token);
      await AsyncStorage.setItem('accessToken', response.data.token);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      await AsyncStorage.removeItem('accessToken');
      setUser(null);
      setToken(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during logout');
      // Still clear local state even if API call fails
      await AsyncStorage.removeItem('accessToken');
      setUser(null);
      setToken(null);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
