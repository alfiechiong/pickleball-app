// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Extend Jest with custom matchers
import jwt from 'jsonwebtoken';
import config from '@/config';

// Silence console logs during tests
global.console.log = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Create custom matchers for token validation
expect.extend({
  toBeValidAccessToken(received) {
    try {
      const decoded = jwt.verify(received, config.jwt.secret);
      const isValid = !!decoded && typeof decoded === 'object' && 'id' in decoded;

      return {
        message: () => `expected ${received} ${isValid ? 'not ' : ''}to be a valid access token`,
        pass: isValid,
      };
    } catch (error) {
      return {
        message: () =>
          `expected ${received} to be a valid access token, but verification failed: ${error}`,
        pass: false,
      };
    }
  },

  toBeValidRefreshToken(received) {
    try {
      const decoded = jwt.verify(received, config.jwt.refreshSecret);
      const isValid = !!decoded && typeof decoded === 'object' && 'id' in decoded;

      return {
        message: () => `expected ${received} ${isValid ? 'not ' : ''}to be a valid refresh token`,
        pass: isValid,
      };
    } catch (error) {
      return {
        message: () =>
          `expected ${received} to be a valid refresh token, but verification failed: ${error}`,
        pass: false,
      };
    }
  },
});
