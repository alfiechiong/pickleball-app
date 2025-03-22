import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import config from '../config';
import { models, User } from '../models';
import logger from '../utils/logger';

// Configure local strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await models.User.findOne({ where: { email } });

        // If user not found or password does not match
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Return user if authentication is successful
        return done(null, user);
      } catch (error) {
        logger.error('LocalStrategy error:', error);
        return done(error);
      }
    }
  )
);

// Configure JWT strategy for token authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (jwtPayload, done) => {
      try {
        // Find user by ID from JWT payload
        const user = await models.User.findByPk(jwtPayload.id);

        // If user not found or token expired
        if (!user) {
          return done(null, false, { message: 'User not found or token expired' });
        }

        // Return user if token is valid
        return done(null, user);
      } catch (error) {
        logger.error('JwtStrategy error:', error);
        return done(error);
      }
    }
  )
);

// Define interface for additional Express Request properties
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      skillLevel?: string;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// Middleware for requiring authentication with error handling
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: User | false, info: { message: string } | undefined) => {
      if (err) {
        logger.error('Authentication error:', err);
        return next(createError(500, 'Authentication server error'));
      }

      if (!user) {
        return next(createError(401, info?.message || 'Unauthorized - Authentication required'));
      }

      // Make user available in request object
      req.user = user;
      next();
    }
  )(req, res, next);
};

// Middleware to check if user is admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as any).role !== 'admin') {
    return next(createError(403, 'Forbidden - Admin access required'));
  }
  next();
};

export default passport;
