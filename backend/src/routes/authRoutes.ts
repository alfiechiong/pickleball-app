import { Router } from 'express';
import { login, register, logout } from '../controllers/authController';
import passport from 'passport';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);

export default router;
