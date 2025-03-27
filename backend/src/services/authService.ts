import jwt from 'jsonwebtoken';
import { User } from '../models';
import config from '../config';

// Define token payload interface
interface TokenPayload {
  id: string;
  email: string;
}

// Define token types
type TokenType = 'access' | 'refresh';

// Define token response interface
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Generate JWT token for a user
 */
export const generateToken = (user: User, type: TokenType = 'access'): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  };

  // Get the appropriate secret and expiration based on token type
  const secret = type === 'access' ? config.jwt.secret : config.jwt.refreshSecret;
  const expiresIn = type === 'access' ? config.jwt.expiresIn : config.jwt.refreshExpiresIn;

  // Convert expiresIn to a type compatible with the jwt.sign function if needed
  // We're intentionally using type assertion here because we know the config values are valid
  // This handles the TypeScript error with jsonwebtoken's typing
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Generate access and refresh tokens for a user
 */
export const generateAuthTokens = async (user: User): Promise<TokenResponse> => {
  const accessToken = generateToken(user, 'access');
  const refreshToken = generateToken(user, 'refresh');

  // Update user's refresh token in the database
  await user.update({ refresh_token: refreshToken });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
  };
};

/**
 * Verify a token and return the decoded payload
 */
export const verifyToken = (token: string, type: TokenType = 'access'): TokenPayload => {
  const secret = type === 'access' ? config.jwt.secret : config.jwt.refreshSecret;
  return jwt.verify(token, secret) as TokenPayload;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse | null> => {
  try {
    // Verify the refresh token
    const payload = verifyToken(refreshToken, 'refresh');

    // Find the user by ID and check if the refresh token matches
    const user = await User.findByPk(payload.id);

    if (!user || user.refresh_token !== refreshToken) {
      return null;
    }

    // Generate new tokens
    return generateAuthTokens(user);
  } catch (error) {
    return null;
  }
};

/**
 * Invalidate a user's refresh token
 */
export const invalidateRefreshToken = async (userId: string): Promise<void> => {
  const user = await User.findByPk(userId);
  if (user) {
    await user.update({ refresh_token: '' });
  }
};
