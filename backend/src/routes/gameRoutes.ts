import { Router } from 'express';
import { createGame } from '../controllers/gameController';
import passport from 'passport';

const router = Router();

// Create a new game (requires authentication)
router.post('/', passport.authenticate('jwt', { session: false }), createGame);

export default router;
