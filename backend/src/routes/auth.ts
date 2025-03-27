import { Router, Request, Response, NextFunction } from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import passport from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validationSchemas';

// Type for authenticated request
type AuthenticatedRequest = Request & { user?: Express.User };

const router = Router();

// Register new user
router.post('/register', validateRequest(registerSchema), register);

// Login user
router.post('/login', validateRequest(loginSchema), login);

// Refresh access token
router.post('/refresh-token', validateRequest(refreshTokenSchema), refresh);

// Logout user (requires authentication)
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);

// Get current user (requires authentication)
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          error: {
            message: 'Not authenticated',
          },
        });
        return;
      }

      res.json({
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            skill_level: user.skill_level,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
