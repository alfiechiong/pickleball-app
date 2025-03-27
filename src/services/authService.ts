import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, getHeaders, handleApiError } from '../config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  profile_picture?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const headers = await getHeaders();
    await axios.post(`${API_URL}/auth/logout`, {}, { headers });
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/auth/me`, { headers });
    return response.data.data.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
    await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
