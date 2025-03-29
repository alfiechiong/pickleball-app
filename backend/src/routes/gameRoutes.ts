import { Router } from 'express';
import { createGame } from '../controllers/gameController';
import { validateRequest } from '../middlewares/validation';
import { createGameSchema } from '../validators/gameValidator';
import passport from '../middlewares/auth';

const router = Router();

// Create a new game (requires authentication)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateRequest(createGameSchema),
  createGame as any
);

export default router;
