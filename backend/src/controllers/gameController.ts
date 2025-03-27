import { Request, Response } from 'express';
import { Game } from '../models/game';
import { createGameSchema } from '../validators/gameValidator';
import createError from 'http-errors';

export const createGame = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = createGameSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    // Create game
    const game = await Game.create({
      ...value,
      creator_id: req.user!.id, // User is attached by auth middleware
    });

    // Return created game
    res.status(201).json({
      status: 'success',
      data: {
        game,
      },
    });
  } catch (err) {
    if (err.isJoi) {
      res.status(400).json({
        status: 'error',
        message: err.details[0].message,
      });
    } else {
      res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
      });
    }
  }
};
