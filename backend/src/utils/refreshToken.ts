import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import config from '../config';

export const generateRefreshToken = (user: User): string => {
  const payload = {
    id: user.id,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: parseInt(config.jwt.refreshExpiresIn) || '7d',
  };

  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

export const verifyRefreshToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.refreshSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
