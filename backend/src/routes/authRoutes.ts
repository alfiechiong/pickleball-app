import { Router, Request, Response } from 'express';
import { login, register, logout, getMe } from '../controllers/authController';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);
router.get('/me', passport.authenticate('jwt', { session: false }), getMe);

// DEV ONLY: Debug route to check token
if (process.env.NODE_ENV === 'development') {
  router.post('/debug-token', (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'No token provided' });
      }

      logger.info(`Debugging token: ${token.substring(0, 15)}...`);
      const decoded = jwt.verify(token, config.jwt.secret);

      return res.json({
        valid: true,
        decoded,
        exp_date: new Date((decoded as any).exp * 1000).toISOString(),
        time_left: ((decoded as any).exp * 1000 - Date.now()) / 1000 / 60 + ' minutes',
      });
    } catch (error) {
      logger.error('Token debugging failed:', error);
      return res.status(401).json({
        valid: false,
        message: 'Invalid token',
        error: error.message,
      });
    }
  });
}

export default router;
