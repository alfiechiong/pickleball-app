import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import './config/passport';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';
app.use(
  cors({
    // In development, allow all origins
    origin: isDevelopment
      ? '*'
      : [
          'http://localhost:19006',
          'http://localhost:19000',
          'http://localhost:19001',
          'http://localhost:19002',
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware - moved before the debugging middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add some debugging middleware for auth requests
app.use((req, _res, next) => {
  if (req.path.includes('/api/v1/auth') || req.path.includes('/api/v1/games')) {
    console.log('API Request:', {
      path: req.path,
      method: req.method,
      headers: req.headers,
      body: req.body, // Now body should be parsed
      query: req.query,
    });
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Authentication
app.use(passport.initialize());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
