import apiService from './api';

// Track getUserGames API calls to prevent rate limiting
let isGetUserGamesInProgress = false;
let lastGetUserGamesAttempt = 0;
const GET_GAMES_COOLDOWN_MS = 2000; // Minimum time between API calls

export interface GameParticipant {
  id: string;
  game_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    skill_level: string;
  };
  game?: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    max_players: number;
    skill_level: string;
    status: string;
    creator?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

/**
 * Request to join a game
 * @param gameId - ID of the game to join
 */
export const joinGame = async (gameId: string): Promise<GameParticipant> => {
  const response = await apiService.post<GameParticipant>(`/games/${gameId}/join`);
  return response.data;
};

/**
 * Update participant status (approve/reject)
 * @param gameId - ID of the game
 * @param participantId - ID of the participant
 * @param status - New status (approved or rejected)
 */
export const updateParticipantStatus = async (
  gameId: string,
  participantId: string,
  status: 'approved' | 'rejected'
): Promise<GameParticipant> => {
  const response = await apiService.put<GameParticipant>(
    `/games/${gameId}/participants/${participantId}`,
    { status }
  );
  return response.data;
};

/**
 * Get all participants for a game
 * @param gameId - ID of the game
 */
export const getGameParticipants = async (gameId: string): Promise<GameParticipant[]> => {
  const response = await apiService.get<GameParticipant[]>(`/games/${gameId}/participants`);
  return response.data;
};

/**
 * Get all games a user has joined or requested to join
 * @param userId - Optional ID of the user (defaults to current user)
 */
export const getUserGames = async (userId?: string): Promise<GameParticipant[]> => {
  try {
    // Check if a request is already in progress
    if (isGetUserGamesInProgress) {
      console.log('Get user games request already in progress, please wait...');
      throw new Error('Request already in progress, please wait');
    }

    // Check if we're hitting the API too frequently
    const now = Date.now();
    if (now - lastGetUserGamesAttempt < GET_GAMES_COOLDOWN_MS) {
      console.log('Please wait before fetching user games again');
      throw new Error('Please wait a moment before refreshing');
    }

    // Verify authentication token exists
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('accessToken');

    if (!token) {
      console.log('No authentication token found, cannot fetch user games');
      throw new Error('Authentication required');
    }

    console.log('Current token status: Token exists');

    lastGetUserGamesAttempt = now;
    isGetUserGamesInProgress = true;

    // The correct route as defined in the backend
    const url = userId ? `/games/user/${userId}` : '/games/user';
    console.log('Calling API endpoint:', url);

    const response = await apiService.get<GameParticipant[]>(url);
    console.log('API response for user games:', response);

    // Check for successful but empty response
    if (
      response.status === 204 ||
      (response.status === 200 &&
        (!response.data || (Array.isArray(response.data) && response.data.length === 0)))
    ) {
      console.log('No games found for user');
      return [];
    }

    if (response.status !== 200) {
      throw new Error(`API error: ${response.message}`);
    }

    return response.data || [];
  } catch (error: any) {
    console.error('Error fetching user games from API:', error);

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.log('Authentication failed - token may be invalid or expired');
      // Clear the invalid token
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('accessToken');
      throw new Error('Authentication required. Please log in again.');
    }

    // Check for rate limiting error (429)
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) : 30;
      console.log(`Rate limited, please try again in ${waitTime} seconds`);
      throw new Error(`Too many requests. Please try again in ${waitTime} seconds.`);
    }

    // Check for 404 "not found" errors, which might indicate no games available
    if (error.response && error.response.status === 404) {
      console.log('No games found for user (404 response)');
      return []; // Return empty array instead of throwing
    }

    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  } finally {
    // Reset the flag in finally block to ensure it's reset even if there's an error
    isGetUserGamesInProgress = false;
  }
};
