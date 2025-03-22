import '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidAccessToken(): R;
      toBeValidRefreshToken(): R;
    }
  }
}
