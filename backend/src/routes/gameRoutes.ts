import { Router } from 'express';
import {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController';
import {
  joinGame,
  updateParticipantStatus,
  getGameParticipants,
  getUserGames,
} from '../controllers/gameParticipantController';
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

// Join a game (requires authentication)
router.post('/:gameId/join', passport.authenticate('jwt', { session: false }), joinGame);

// Get all participants for a game
router.get('/:gameId/participants', getGameParticipants);

// Update participant status (approve/reject) - requires authentication
router.put(
  '/:gameId/participants/:participantId',
  passport.authenticate('jwt', { session: false }),
  updateParticipantStatus
);

// Get all games a user has joined
router.get('/user/:userId?', passport.authenticate('jwt', { session: false }), getUserGames);

export default router;
