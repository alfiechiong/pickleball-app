import { Router } from 'express';
import { login, register, logout, getMe } from '../controllers/authController';
import passport from 'passport';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);
router.get('/me', passport.authenticate('jwt', { session: false }), getMe);

export default router;
