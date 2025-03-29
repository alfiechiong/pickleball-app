/**
 * Application constants and environment variables
 */

// We're using try/catch because React Native's environment handling can be inconsistent
let apiUrl;
try {
  // Try to load from @env
  const env = require('@env');
  apiUrl = env.API_URL;
} catch (error) {
  console.warn('Failed to load API_URL from @env, using default', error);
}

// Application constants
export const API_URL = apiUrl || 'http://localhost:3000/api/v1';
