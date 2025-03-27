import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../models/User';
import {
  generateAuthTokens,
  refreshAccessToken,
  invalidateRefreshToken,
} from '../services/authService';
import logger from '../utils/logger';

// Type for authenticated request
type AuthenticatedRequest = Request & { user?: Express.User };

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, skillLevel: skill_level } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'Email already registered');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      skill_level,
    });

    // Generate tokens
    const tokens = await generateAuthTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          skill_level: user.skill_level,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createError(401, 'Invalid email or password');
    }

    // Generate tokens
    const tokens = await generateAuthTokens(user);

    res.json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          skill_level: user.skill_level,
        },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    const tokens = await refreshAccessToken(refreshToken);
    if (!tokens) {
      throw createError(401, 'Invalid refresh token');
    }

    res.json({
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    next(error);
  }
};

/**
 * Logout user
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, 'Not authenticated');
    }

    await invalidateRefreshToken(userId);

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};
