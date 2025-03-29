import { Request, Response } from 'express';
import { Game } from '../models/game';
import { User } from '../models/User';
import logger from '../utils/logger';

// Define the authenticated request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    skill_level: string;
    password: string;
  };
}

export const createGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { date, start_time, end_time, location, max_players, skill_level } = req.body;

    // Convert date string to Date object
    const gameDate = new Date(date);

    // Create Date objects for start and end times
    const [startHours, startMinutes] = start_time.split(':');
    const [endHours, endMinutes] = end_time.split(':');

    const startTimeDate = new Date(gameDate);
    startTimeDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endTimeDate = new Date(gameDate);
    endTimeDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    const game = await Game.create({
      date: gameDate,
      start_time: startTimeDate,
      end_time: endTimeDate,
      location,
      max_players,
      skill_level,
      host_id: req.user.id,
      status: 'open',
    });

    logger.info(`Game created successfully with ID: ${game.id}`);
    res.status(201).json(game);
  } catch (error) {
    logger.error('Error creating game:', error);
    res.status(500).json({ message: 'Error creating game', error: error.message });
  }
};

export const getGames = async (_req: Request, res: Response): Promise<void> => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'email', 'skill_level'],
        },
      ],
      where: {
        status: 'open',
      },
    });

    logger.info(`Found ${games.length} games`);

    // Return the games directly (our frontend expects this format)
    res.json(games);
  } catch (error) {
    logger.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
};

export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'email', 'skill_level'],
        },
      ],
    });
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }
    res.json(game);
  } catch (error) {
    logger.error('Error fetching game:', error);
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
};

export const updateGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const game = await Game.findByPk(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    if (game.host_id !== req.user.id) {
      res.status(403).json({ message: 'Forbidden - You can only update your own games' });
      return;
    }

    const { date, start_time, end_time, location, max_players, skill_level, status } = req.body;

    // Convert date and times if provided
    let updateData: any = { location, max_players, skill_level, status };

    if (date) {
      updateData.date = new Date(date);
    }

    if (start_time) {
      const [startHours, startMinutes] = start_time.split(':');
      const startTimeDate = new Date(game.date);
      startTimeDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);
      updateData.start_time = startTimeDate;
    }

    if (end_time) {
      const [endHours, endMinutes] = end_time.split(':');
      const endTimeDate = new Date(game.date);
      endTimeDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      updateData.end_time = endTimeDate;
    }

    await game.update(updateData);

    logger.info(`Game updated successfully: ${game.id}`);
    res.json(game);
  } catch (error) {
    logger.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game', error: error.message });
  }
};

export const deleteGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const game = await Game.findByPk(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }

    if (game.host_id !== req.user.id) {
      res.status(403).json({ message: 'Forbidden - You can only delete your own games' });
      return;
    }

    await game.destroy();

    logger.info(`Game deleted successfully: ${game.id}`);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    logger.error('Error deleting game:', error);
    res.status(500).json({ message: 'Error deleting game', error: error.message });
  }
};
