import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import passport from './middlewares/auth';
import config from './config';
import logger from './utils/logger';
import app from './app';

const PORT = config.port || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/v1/auth', authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
