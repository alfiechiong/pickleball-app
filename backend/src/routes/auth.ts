import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { validateRequest } from '../middlewares/validation';

const router = Router();

// Register new user
router.post('/register', validateRequest(registerSchema), register);

// Login user
router.post('/login', validateRequest(loginSchema), login);

// Logout user
router.post('/logout', logout);

export default router;
