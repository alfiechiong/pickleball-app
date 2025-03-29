import { Router } from 'express';
import {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController';
import { validateRequest } from '../middlewares/validation';
import { createGameSchema } from '../validators/gameValidator';
import passport from '../middlewares/auth';

const router = Router();

// Create a new game (requires authentication)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateRequest(createGameSchema),
  createGame
);

// Get all games
router.get('/', getGames);

// Get a specific game by ID
router.get('/:id', getGame);

// Update a game (requires authentication)
router.put('/:id', passport.authenticate('jwt', { session: false }), updateGame);

// Delete a game (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteGame);

export default router;
