import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { comparePasswords, hashPassword } from '../utils/password';
import { generateRefreshToken } from '../utils/refreshToken';
import createError from 'http-errors';

// Define the authenticated request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    skill_level?: string;
    password?: string;
  };
}

/**
 * Get current authenticated user
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }

    // Find the user from the database to get the latest data
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          skill_level: user.skill_level,
        },
      },
    });
  } catch (err: any) {
    console.error('Error in getMe:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Error getting user data',
    });
  }
};

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, skill_level } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      skill_level,
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          skill_level: user.skill_level,
        },
        token,
        refreshToken,
      },
    });
  } catch (err: any) {
    console.error('Error in register:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Error creating user',
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid credentials');
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          skill_level: user.skill_level,
        },
        token,
        refreshToken,
      },
    });
  } catch (err: any) {
    console.error('Error in login:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Error logging in',
    });
  }
};

/**
 * Logout user
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      status: 'success',
      message: 'Successfully logged out',
    });
  } catch (err: any) {
    console.error('Error in logout:', err);
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Error logging out',
    });
  }
};
