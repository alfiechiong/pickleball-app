import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import config from '../config';
import logger from './logger';

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    skill_level: user.skill_level,
  };

  const options: SignOptions = {
    expiresIn: parseInt(config.jwt.expiresIn) || '1h',
  };

  logger.info(`Generating token for user: ${user.id} (${user.email})`);
  logger.debug(`Token payload: ${JSON.stringify(payload)}`);

  try {
    const token = jwt.sign(payload, config.jwt.secret, options);
    logger.info(`Token generated successfully: ${token.substring(0, 15)}...`);
    return token;
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};
