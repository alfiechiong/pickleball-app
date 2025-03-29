import React, { createContext, useContext, useState, useCallback } from 'react';
import * as gameService from '../services/gameService';
import * as gameParticipantService from '../services/gameParticipantService';
import { Game, CreateGameData, UpdateGameData, GameFilters } from '../services/gameService';
import { GameParticipant } from '../services/gameParticipantService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameContextType {
  games: Game[];
  selectedGame: Game | null;
  gameParticipants: GameParticipant[];
  userGames: GameParticipant[];
  loading: boolean;
  error: string | null;
  loadGames: (filters?: GameFilters) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  createGame: (data: CreateGameData) => Promise<Game>;
  updateGame: (gameId: string, data: UpdateGameData) => Promise<void>;
  joinGame: (gameId: string) => Promise<GameParticipant>;
  leaveGame: (gameId: string) => Promise<void>;
  cancelGame: (gameId: string) => Promise<void>;
  loadGameParticipants: (gameId: string) => Promise<void>;
  loadUserGames: () => Promise<void>;
  updateParticipantStatus: (
    gameId: string,
    participantId: string,
    status: 'approved' | 'rejected'
  ) => Promise<void>;
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
  const [gameParticipants, setGameParticipants] = useState<GameParticipant[]>([]);
  const [userGames, setUserGames] = useState<GameParticipant[]>([]);
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

      // New implementation using the participant service
      const participant = await gameParticipantService.joinGame(gameId);

      // Refresh the game data
      if (selectedGame?.id === gameId) {
        const game = await gameService.getGame(gameId);
        setSelectedGame(game);
      }

      // Return the participant data
      return participant;
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

  const loadGameParticipants = async (gameId: string) => {
    try {
      setLoading(true);
      setError(null);
      // Initialize with empty array before API call
      setGameParticipants([]);
      const participants = await gameParticipantService.getGameParticipants(gameId);
      setGameParticipants(participants);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load game participants');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUserGames = async () => {
    try {
      // Skip if already loading
      if (loading) {
        console.log('Already loading user games, skipping...');
        return;
      }

      setLoading(true);
      setError(null);
      console.log('Fetching user games...');

      try {
        const userGamesList = await gameParticipantService.getUserGames();
        console.log('User games fetched successfully:', userGamesList);

        // Check if the response is valid but empty
        if (Array.isArray(userGamesList) && userGamesList.length === 0) {
          console.log('No games found for user');
          // Setting empty array without error - this is a valid state, not an error
          setUserGames([]);
          // Optional: Set a non-error informational message
          setError('No games found');
        } else {
          setUserGames(userGamesList);
          setError(null);
        }
      } catch (apiError) {
        console.error('API error loading user games:', apiError);

        // Special handling for authentication errors
        if (apiError instanceof Error && apiError.message.includes('Authentication required')) {
          setUserGames([]);
          setError('Authentication required');
          return;
        }

        throw apiError; // Re-throw for the outer catch
      }
    } catch (error) {
      console.error('Failed to load user games:', error);
      setError(error instanceof Error ? error.message : 'Failed to load user games');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (
    gameId: string,
    participantId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      setLoading(true);
      setError(null);
      await gameParticipantService.updateParticipantStatus(gameId, participantId, status);

      // Refresh participants list
      const participants = await gameParticipantService.getGameParticipants(gameId);
      setGameParticipants(participants);

      // Refresh game data if it's the selected game
      if (selectedGame?.id === gameId) {
        const game = await gameService.getGame(gameId);
        setSelectedGame(game);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update participant status');
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
    gameParticipants,
    userGames,
    loading,
    error,
    loadGames,
    loadGame,
    createGame,
    updateGame,
    joinGame,
    leaveGame,
    cancelGame,
    loadGameParticipants,
    loadUserGames,
    updateParticipantStatus,
    clearError,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
