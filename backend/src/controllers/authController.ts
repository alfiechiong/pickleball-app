import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { models, User } from '../models';
import * as authService from '../services/authService';
import logger from '../utils/logger';
import passport from 'passport';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, skillLevel } = req.body;

    // Check if user already exists
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'Email already in use');
    }

    // Create new user
    const user = await models.User.create({
      name,
      email,
      password, // Will be hashed by model hook
      skillLevel,
    });

    // Generate tokens
    const tokens = await authService.generateAuthTokens(user);

    // Return response
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          skillLevel: user.skillLevel,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error('Register error:', error);
    next(error);
  }
};

/**
 * Login a user
 */
export const login = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: any, user: User | false, info: { message: string }) => {
      try {
        if (err) {
          throw err;
        }

        if (!user) {
          throw createError(401, info.message || 'Invalid credentials');
        }

        // Generate tokens
        const tokens = await authService.generateAuthTokens(user);

        // Return response
        res.json({
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              skillLevel: user.skillLevel,
            },
            ...tokens,
          },
        });
      } catch (error) {
        logger.error('Login error:', error);
        next(error);
      }
    }
  )(req, res, next);
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Refresh the access token
    const tokens = await authService.refreshAccessToken(refreshToken);

    if (!tokens) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    // Return response
    res.json({
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    next(error);
  }
};

/**
 * Logout a user
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) {
      // Invalidate refresh token
      await authService.invalidateRefreshToken(req.user.id);
    }

    // Return response
    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

/**
 * Get the current user profile
 */
export const me = (req: Request, res: Response): void => {
  // User is already attached to request by authentication middleware
  res.json({
    data: {
      user: req.user,
    },
  });
};
