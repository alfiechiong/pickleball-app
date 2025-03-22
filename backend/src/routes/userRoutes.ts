import { Router } from 'express';
import { param, body } from 'express-validator';
import * as userController from '../controllers/userController';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

// User ID validation
const userIdValidation = [param('id').isUUID().withMessage('Invalid user ID format')];

// User update validation
const updateUserValidation = [
  param('id').isUUID().withMessage('Invalid user ID format'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty if provided'),
  body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
  body('skillLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'pro'])
    .withMessage('Skill level must be one of: beginner, intermediate, advanced, pro'),
];

// Routes
router.get('/', requireAuth, userController.getAllUsers);
router.get('/:id', requireAuth, userIdValidation, validate, userController.getUserById);
router.put('/:id', requireAuth, updateUserValidation, validate, userController.updateUser);
router.delete('/:id', requireAuth, userIdValidation, validate, userController.deleteUser);

export default router;
