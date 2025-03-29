import { Request, Response } from 'express';
import { GameParticipant } from '../models/gameParticipant';
import { Game } from '../models/game';
import { User } from '../models/User';
import logger from '../utils/logger';

/**
 * Join a game
 * POST /games/:gameId/join
 */
export const joinGame = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const gameId = req.params.gameId;
    const userId = req.user.id;

    // Check if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Don't allow creator to join their own game
    if (game.creator_id === userId) {
      res.status(400).json({ message: 'You cannot join your own game' });
      return;
    }

    // Check game status
    if (game.status !== 'open') {
      res.status(400).json({ message: `Cannot join game with status: ${game.status}` });
      return;
    }

    // Check if player already requested to join
    const existingParticipant = await GameParticipant.findOne({
      where: {
        game_id: gameId,
        user_id: userId,
      },
    });

    if (existingParticipant) {
      res.status(400).json({
        message: 'You have already requested to join this game',
        status: existingParticipant.status,
      });
      return;
    }

    // Count approved participants
    const approvedParticipants = await GameParticipant.count({
      where: {
        game_id: gameId,
        status: 'approved',
      },
    });

    // Check if game is full
    if (approvedParticipants >= game.max_players - 1) {
      // -1 because the creator is counted separately
      res.status(400).json({ message: 'Game is full' });

      // Update game status if it's not already set to full
      if (game.status === 'open') {
        await game.update({ status: 'full' });
      }

      return;
    }

    // Create participant request
    const participant = await GameParticipant.create({
      game_id: gameId,
      user_id: userId,
      status: 'pending', // Default is pending, requires approval
    });

    logger.info(`User ${userId} requested to join game ${gameId}`);
    res.status(201).json(participant);
  } catch (error) {
    logger.error('Error joining game:', error);
    res.status(500).json({ message: 'Error joining game', error: error.message });
  }
};

/**
 * Approve or reject a join request
 * PUT /games/:gameId/participants/:participantId
 */
export const updateParticipantStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { gameId, participantId } = req.params;
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
      return;
    }

    // Check if game exists and user is the creator
    const game = await Game.findByPk(gameId);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Only creator can approve/reject
    if (game.creator_id !== req.user.id) {
      res
        .status(403)
        .json({ message: 'Only the game creator can approve or reject join requests' });
      return;
    }

    // Find the participant
    const participant = await GameParticipant.findOne({
      where: {
        id: participantId,
        game_id: gameId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'skill_level'],
        },
      ],
    });

    if (!participant) {
      res.status(404).json({ message: 'Participant not found' });
      return;
    }

    // If approving, check if game is full
    if (status === 'approved') {
      // Count approved participants
      const approvedParticipants = await GameParticipant.count({
        where: {
          game_id: gameId,
          status: 'approved',
        },
      });

      // Check if game is full
      if (approvedParticipants >= game.max_players - 1) {
        // -1 because the creator is counted separately
        res.status(400).json({ message: 'Game is full' });

        // Update game status if it's not already set to full
        if (game.status === 'open') {
          await game.update({ status: 'full' });
        }

        return;
      }
    }

    // Update participant status
    await participant.update({ status });

    // If we just approved and the game is now full, update game status
    if (status === 'approved') {
      const approvedParticipants = await GameParticipant.count({
        where: {
          game_id: gameId,
          status: 'approved',
        },
      });

      if (approvedParticipants >= game.max_players - 1) {
        await game.update({ status: 'full' });
      }
    }

    logger.info(`Participant ${participantId} ${status} for game ${gameId}`);
    res.json(participant);
  } catch (error) {
    logger.error('Error updating participant status:', error);
    res.status(500).json({ message: 'Error updating participant status', error: error.message });
  }
};

/**
 * Get all participants for a game
 * GET /games/:gameId/participants
 */
export const getGameParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    // Check if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    // Get participants with user details
    const participants = await GameParticipant.findAll({
      where: {
        game_id: gameId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'skill_level'],
        },
      ],
    });

    res.json(participants);
  } catch (error) {
    logger.error('Error fetching game participants:', error);
    res.status(500).json({ message: 'Error fetching game participants', error: error.message });
  }
};

/**
 * Get all games a user has joined or requested to join
 * GET /games/user/:userId?
 */
export const getUserGames = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.params.userId || req.user.id;

    // Only allow users to see their own joined games
    if (userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden - You can only view your own joined games' });
      return;
    }

    // Get all games the user has joined
    const participations = await GameParticipant.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Game,
          as: 'game',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    res.json(participations);
  } catch (error) {
    logger.error('Error fetching user games:', error);
    res.status(500).json({ message: 'Error fetching user games', error: error.message });
  }
};
