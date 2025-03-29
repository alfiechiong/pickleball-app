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
  status: string;
  message?: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  skillLevel: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Registering with data:', data);
    // Transform data to match backend expectations
    const backendData = {
      name: data.name,
      email: data.email,
      password: data.password,
      skill_level: data.skillLevel, // Transform to snake_case for backend
    };

    const response = await axios.post(`${API_URL}/auth/register`, backendData);
    console.log('Registration response:', response.data);

    if (response.data.data.token) {
      await AsyncStorage.setItem('accessToken', response.data.data.token);
    }

    if (response.data.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    handleApiError(error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Logging in with credentials:', { email: credentials.email });
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log('Login response:', response.data);

    if (response.data.data.token) {
      await AsyncStorage.setItem('accessToken', response.data.data.token);
    }

    if (response.data.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
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

    if (response.data.data.token) {
      await AsyncStorage.setItem('accessToken', response.data.data.token);
    }

    if (response.data.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
