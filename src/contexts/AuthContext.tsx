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
      console.log(
        'Checking auth status, token:',
        storedToken ? `${storedToken.substring(0, 15)}...` : 'No token'
      );

      if (storedToken) {
        setToken(storedToken);
        try {
          const user = await authService.getCurrentUser();
          console.log('User retrieved successfully:', user);
          setUser(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          // If getting user fails, clear the token
          await AsyncStorage.removeItem('accessToken');
          setToken(null);
        }
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
      console.log('Logging in with:', credentials.email);
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setToken(response.data.token);

      console.log(
        'Login successful, saving token:',
        response.data.token ? `${response.data.token.substring(0, 15)}...` : 'No token'
      );
      await AsyncStorage.setItem('accessToken', response.data.token);

      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      console.log('Registering with:', data.email);
      const response = await authService.register(data);
      setUser(response.data.user);
      setToken(response.data.token);

      console.log(
        'Registration successful, saving token:',
        response.data.token ? `${response.data.token.substring(0, 15)}...` : 'No token'
      );
      await AsyncStorage.setItem('accessToken', response.data.token);

      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      console.log('Logging out, removing tokens');
      await authService.logout();

      // Clear tokens
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');

      // Clear state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during logout');

      // Still clear local state even if API call fails
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
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
