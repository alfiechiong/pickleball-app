import axios from 'axios';
import { API_URL, getHeaders, handleApiError } from '../config/api';
import { User } from './authService';

export interface Game {
  id: number;
  date: string;
  time: string;
  location: string;
  max_players: number;
  current_players: number;
  skill_level: string;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  host: User;
  players: User[];
  created_at: string;
  updated_at: string;
}

export interface CreateGameData {
  date: string;
  time: string;
  location: string;
  max_players: number;
  skill_level: string;
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

export const createGame = async (data: CreateGameData): Promise<Game> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/games`, data, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
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
