import axios from 'axios';
import { API_URL, getHeaders, handleApiError } from '../config/api';
import { User } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Game {
  id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  status: 'open' | 'full' | 'cancelled' | 'completed';
  creator_id: string;
  host_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  host?: {
    id: string;
    name: string;
    email: string;
    skill_level: string;
  };
  current_players?: number;
}

export interface CreateGameData {
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  notes?: string;
}

export interface UpdateGameData {
  date?: string;
  time?: string;
  location?: string;
  max_players?: number;
  skill_level?: string;
  status?: 'open' | 'full' | 'cancelled' | 'completed';
}

export interface GameFilters {
  date?: string;
  skill_level?: string;
  status?: string;
  location?: string;
}

export const createGame = async (gameData: CreateGameData, token?: string): Promise<Game> => {
  try {
    // Get token if not provided
    let authToken = token;
    if (!authToken) {
      authToken = (await AsyncStorage.getItem('accessToken')) || '';
      console.log(
        'Retrieved token from storage:',
        authToken ? `${authToken.substring(0, 15)}...` : 'No token'
      );
    }

    if (!authToken) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log(
      'Creating game with token:',
      authToken ? `${authToken.substring(0, 15)}...` : 'No token'
    );
    console.log('Game data:', JSON.stringify(gameData, null, 2));
    console.log('API URL:', `${API_URL}/games`);

    const response = await axios.post(`${API_URL}/games`, gameData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log('Game creation response:', response.data);

    // Our backend returns the game object directly
    return response.data;
  } catch (error) {
    console.error('Game creation error:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Detailed error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const updateGame = async (gameId: string, data: UpdateGameData): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.put(`${API_URL}/games/${gameId}`, data, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getGame = async (gameId: string): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/games/${gameId}`, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const listGames = async (filters?: GameFilters): Promise<Game[]> => {
  try {
    console.log('Fetching games with filters:', filters);
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/games`, {
      headers,
      params: filters,
    });

    console.log('Games API response:', response.data);

    // The backend directly returns the games array
    return response.data || [];
  } catch (error) {
    console.error('Error fetching games:', error);
    handleApiError(error);
    throw error;
  }
};

export const joinGame = async (gameId: string): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const leaveGame = async (gameId: string): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/leave`, {}, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const cancelGame = async (gameId: string): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/cancel`, {}, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
