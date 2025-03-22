import jwt from 'jsonwebtoken';
import * as authService from '@/services/authService';
import { User } from '@/models';
import config from '@/config';

// Mock the User model and jwt methods
jest.mock('@/models', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock data
const mockUser = {
  id: 'test-uuid',
  email: 'test@example.com',
  refreshToken: 'old-refresh-token',
  update: jest.fn().mockResolvedValue(true),
};

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate an access token', () => {
      // Mock the jwt.sign function
      (jwt.sign as jest.Mock).mockReturnValue('mocked-access-token');

      const token = authService.generateToken(mockUser as unknown as User);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      expect(token).toBe('mocked-access-token');
    });

    it('should generate a refresh token', () => {
      // Mock the jwt.sign function
      (jwt.sign as jest.Mock).mockReturnValue('mocked-refresh-token');

      const token = authService.generateToken(mockUser as unknown as User, 'refresh');

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );
      expect(token).toBe('mocked-refresh-token');
    });
  });

  describe('generateAuthTokens', () => {
    it('should generate both tokens and update the user', async () => {
      // Mock the jwt.sign function
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('mocked-access-token')
        .mockReturnValueOnce('mocked-refresh-token');

      const tokens = await authService.generateAuthTokens(mockUser as unknown as User);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: 'mocked-refresh-token' });
      expect(tokens).toEqual({
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
        expiresIn: config.jwt.expiresIn,
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify an access token', () => {
      // Mock the jwt.verify function
      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.id, email: mockUser.email });

      const decodedToken = authService.verifyToken('valid-token', 'access');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwt.secret);
      expect(decodedToken).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should verify a refresh token', () => {
      // Mock the jwt.verify function
      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.id, email: mockUser.email });

      const decodedToken = authService.verifyToken('valid-token', 'refresh');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwt.refreshSecret);
      expect(decodedToken).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should throw an error for invalid token', () => {
      // Mock the jwt.verify function to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => {
        authService.verifyToken('invalid-token', 'access');
      }).toThrow();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new tokens if refresh token is valid', async () => {
      // Mock verifyToken to return a valid decoded token
      jest.spyOn(authService, 'verifyToken').mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
      });

      // Mock the User.findByPk to return our test user
      (User.findByPk as jest.Mock).mockResolvedValue({
        ...mockUser,
        refreshToken: 'valid-refresh-token',
      });

      // Mock generateAuthTokens
      jest.spyOn(authService, 'generateAuthTokens').mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: config.jwt.expiresIn,
      });

      const result = await authService.refreshAccessToken('valid-refresh-token');

      expect(authService.verifyToken).toHaveBeenCalledWith('valid-refresh-token', 'refresh');
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
      expect(authService.generateAuthTokens).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: config.jwt.expiresIn,
      });
    });

    it('should return null if user not found', async () => {
      // Mock verifyToken to return a valid decoded token
      jest.spyOn(authService, 'verifyToken').mockReturnValue({
        id: 'non-existent-id',
        email: 'nonexistent@example.com',
      });

      // Mock the User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await authService.refreshAccessToken('valid-refresh-token');

      expect(result).toBeNull();
    });

    it('should return null if tokens do not match', async () => {
      // Mock verifyToken to return a valid decoded token
      jest.spyOn(authService, 'verifyToken').mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
      });

      // Mock the User.findByPk to return a user with a different refresh token
      (User.findByPk as jest.Mock).mockResolvedValue({
        ...mockUser,
        refreshToken: 'different-refresh-token',
      });

      const result = await authService.refreshAccessToken('valid-refresh-token');

      expect(result).toBeNull();
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should update user with empty refresh token', async () => {
      // Mock the User.findByPk to return our test user
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await authService.invalidateRefreshToken(mockUser.id);

      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
      expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: '' });
    });

    it('should do nothing if user not found', async () => {
      // Mock the User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await authService.invalidateRefreshToken('non-existent-id');

      expect(User.findByPk).toHaveBeenCalled();
      expect(mockUser.update).not.toHaveBeenCalled();
    });
  });
});
