import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import config from '../config';

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

  return jwt.sign(payload, config.jwt.secret, options);
};
