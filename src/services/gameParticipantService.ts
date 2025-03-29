import apiService from './api';

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
  const url = userId ? `/games/user/${userId}` : '/games/user';
  const response = await apiService.get<GameParticipant[]>(url);
  return response.data;
};
