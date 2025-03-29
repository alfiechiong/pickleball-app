import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, getHeaders, handleApiError } from '../config/api';

// Track login attempts to prevent duplicate requests
let isLoginInProgress = false;
let lastLoginAttempt = 0;
const LOGIN_COOLDOWN_MS = 2000; // Minimum time between login attempts

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
    // Check if a login is already in progress
    if (isLoginInProgress) {
      console.log('Login already in progress, please wait...');
      throw new Error('Login already in progress, please wait');
    }

    // Check if we're hitting login too frequently
    const now = Date.now();
    if (now - lastLoginAttempt < LOGIN_COOLDOWN_MS) {
      console.log('Please wait before trying to login again');
      throw new Error('Please wait before trying to login again');
    }

    lastLoginAttempt = now;
    isLoginInProgress = true;

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

    // Check for rate limiting error (429)
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) : 30;
      console.log(`Rate limited, please try again in ${waitTime} seconds`);
      throw new Error(`Too many login attempts. Please try again in ${waitTime} seconds.`);
    }

    handleApiError(error);
    throw error;
  } finally {
    // Reset the login in progress flag
    isLoginInProgress = false;
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
