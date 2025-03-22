import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { models } from '../models';
import logger from '../utils/logger';

/**
 * Get all users
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await models.User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'profilePicture', 'skillLevel', 'createdAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: {
        users,
        pagination: {
          total: count,
          page,
          limit,
          totalPages,
        },
      },
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'profilePicture', 'skillLevel', 'createdAt'],
    });

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, profilePicture, skillLevel } = req.body;

    // Check if user exists
    const user = await models.User.findByPk(id);
    if (!user) {
      throw createError(404, 'User not found');
    }

    // Check if current user is authorized to update this user
    if (req.user && req.user.id !== id) {
      throw createError(403, 'Not authorized to update this user');
    }

    // Update user
    await user.update({
      name: name || user.name,
      profilePicture: profilePicture || user.profilePicture,
      skillLevel: skillLevel || user.skillLevel,
    });

    res.json({
      message: 'User updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          skillLevel: user.skillLevel,
        },
      },
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await models.User.findByPk(id);
    if (!user) {
      throw createError(404, 'User not found');
    }

    // Check if current user is authorized to delete this user
    if (req.user && req.user.id !== id) {
      throw createError(403, 'Not authorized to delete this user');
    }

    // Delete user
    await user.destroy();

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};
