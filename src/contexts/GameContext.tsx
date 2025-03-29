import React, { createContext, useContext, useState, useCallback } from 'react';
import * as gameService from '../services/gameService';
import { Game, CreateGameData, UpdateGameData, GameFilters } from '../services/gameService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameContextType {
  games: Game[];
  selectedGame: Game | null;
  loading: boolean;
  error: string | null;
  loadGames: (filters?: GameFilters) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  createGame: (data: CreateGameData) => Promise<Game>;
  updateGame: (gameId: string, data: UpdateGameData) => Promise<void>;
  joinGame: (gameId: string) => Promise<void>;
  leaveGame: (gameId: string) => Promise<void>;
  cancelGame: (gameId: string) => Promise<void>;
  clearError: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async (filters?: GameFilters) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGames = await gameService.listGames(filters);
      setGames(fetchedGames);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGame = useCallback(async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      const game = await gameService.getGame(gameId);
      setSelectedGame(game);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGame = async (data: CreateGameData): Promise<Game> => {
    try {
      setLoading(true);
      setError(null);

      // Get the auth token
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Call the game service to create the game
      const newGame = await gameService.createGame(data, token);

      console.log('Game created successfully:', newGame);

      // Update the games list with the new game
      setGames(prevGames => [...prevGames, newGame]);
      setSelectedGame(newGame);

      return newGame;
    } catch (error) {
      console.error('Failed to create game:', error);
      setError(error instanceof Error ? error.message : 'Failed to create game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameId: string, data: UpdateGameData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGame = await gameService.updateGame(gameId, data);
      setGames(prevGames => prevGames.map(game => (game.id === gameId ? updatedGame : game)));
      if (selectedGame?.id === gameId) {
        setSelectedGame(updatedGame);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGame = await gameService.joinGame(gameId);
      setGames(prevGames => prevGames.map(game => (game.id === gameId ? updatedGame : game)));
      if (selectedGame?.id === gameId) {
        setSelectedGame(updatedGame);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const leaveGame = async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGame = await gameService.leaveGame(gameId);
      setGames(prevGames => prevGames.map(game => (game.id === gameId ? updatedGame : game)));
      if (selectedGame?.id === gameId) {
        setSelectedGame(updatedGame);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to leave game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelGame = async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGame = await gameService.cancelGame(gameId);
      setGames(prevGames => prevGames.map(game => (game.id === gameId ? updatedGame : game)));
      if (selectedGame?.id === gameId) {
        setSelectedGame(updatedGame);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    games,
    selectedGame,
    loading,
    error,
    loadGames,
    loadGame,
    createGame,
    updateGame,
    joinGame,
    leaveGame,
    cancelGame,
    clearError,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
