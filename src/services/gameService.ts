import axios from 'axios';
import { API_URL, getHeaders, handleApiError } from '../config/api';
import { User } from './authService';

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
  notes?: string;
  created_at: string;
  updated_at: string;
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

export const createGame = async (gameData: CreateGameData, token: string): Promise<Game> => {
  try {
    console.log('Creating game with data:', {
      url: `${API_URL}/games`,
      data: gameData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await axios.post(`${API_URL}/games`, gameData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Game creation response:', response.data);

    if (response.data.status === 'error') {
      throw new Error(response.data.message);
    }

    return response.data.data.game;
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

export const updateGame = async (gameId: number, data: UpdateGameData): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.put(`${API_URL}/games/${gameId}`, data, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getGame = async (gameId: number): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/games/${gameId}`, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const listGames = async (filters?: GameFilters): Promise<Game[]> => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/games`, {
      headers,
      params: filters,
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const joinGame = async (gameId: number): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/join`, {}, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const leaveGame = async (gameId: number): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/leave`, {}, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const cancelGame = async (gameId: number): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games/${gameId}/cancel`, {}, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
