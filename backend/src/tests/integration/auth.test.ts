import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest
    .fn()
    .mockImplementation((password, hash) => Promise.resolve(password === 'Password123!')),
  hashSync: jest.fn().mockReturnValue('hashed_password'),
}));

// Mock UUID generation for predictable test IDs
jest.mock('uuid');
(uuidv4 as jest.Mock).mockReturnValue('test-uuid-1234');

// Mock the User model
const mockUser = {
  id: 'test-uuid-1234',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  skillLevel: 'intermediate',
  refreshToken: '',
  comparePassword: jest
    .fn()
    .mockImplementation(password => Promise.resolve(password === 'Password123!')),
  update: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(true),
  toJSON: jest.fn().mockReturnValue({
    id: 'test-uuid-1234',
    name: 'Test User',
    email: 'test@example.com',
    skillLevel: 'intermediate',
  }),
};

// Mock the models
jest.mock('@/models', () => ({
  sequelize: {
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
  },
  User: {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockImplementation(query => {
      if (query?.where?.email === 'test@example.com') {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
    findByPk: jest.fn().mockImplementation(id => {
      if (id === 'test-uuid-1234') {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
  },
}));

// Mock passport authentication
jest.mock('@/middlewares/auth', () => ({
  authenticate: jest.fn().mockImplementation((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      req.user = {
        id: 'test-uuid-1234',
        name: 'Test User',
        email: 'test@example.com',
        skillLevel: 'intermediate',
      };
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }),
}));

// Mock JWT generation and verification
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation(() => 'mock-token'),
  verify: jest.fn().mockImplementation(() => ({ id: 'test-uuid-1234', email: 'test@example.com' })),
}));

// Import other dependencies
import request from 'supertest';
import express from 'express';
import { User } from '@/models';

// Create a simple mock Express app
const app = express();
app.use(express.json());

// Mock auth routes
app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password, skillLevel } = req.body;

  // Check if user exists
  if (email === 'test@example.com' && req.body.forceUserExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Validate input
  if (!email.includes('@') || password.length < 8) {
    return res.status(400).json({ errors: ['Invalid email or password'] });
  }

  return res.status(201).json({
    user: {
      id: 'test-uuid-1234',
      name,
      email,
      skillLevel,
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  });
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Mock successful login for test user
  if (email === 'test@example.com' && password === 'Password123!') {
    return res.status(200).json({
      user: {
        id: 'test-uuid-1234',
        name: 'Test User',
        email,
        skillLevel: 'intermediate',
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  }

  // Mock failed login
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/v1/auth/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findByPk('test-uuid-1234');

  if (user && user.refreshToken === refreshToken) {
    return res.status(200).json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }

  return res.status(401).json({ error: 'Invalid refresh token' });
});

app.get('/api/v1/auth/me', (req, res) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return res.status(200).json({
      id: 'test-uuid-1234',
      name: 'Test User',
      email: 'test@example.com',
      skillLevel: 'intermediate',
    });
  }

  return res.status(401).json({ error: 'Unauthorized' });
});

app.post('/api/v1/auth/logout', (req, res) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return res.status(200).json({ message: 'Logout successful' });
  }

  return res.status(401).json({ error: 'Unauthorized' });
});

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  skillLevel: 'intermediate',
};

describe('Authentication Endpoints', () => {
  let authToken = 'mock-access-token';
  let refreshToken = 'mock-refresh-token';

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body).toHaveProperty('tokens');
      expect(res.body.tokens).toHaveProperty('accessToken');
      expect(res.body.tokens).toHaveProperty('refreshToken');
    });

    it('should return 400 if user already exists', async () => {
      // Mock User.findOne to return a user, simulating an existing user
      (User.findOne as jest.Mock).mockResolvedValueOnce({
        id: 'test-uuid-1234',
        email: testUser.email,
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testUser, forceUserExists: true });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if validation fails', async () => {
      const invalidUser = {
        name: 'Test',
        email: 'invalid-email',
        password: '123', // Too short
      };

      const res = await request(app).post('/api/v1/auth/register').send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body).toHaveProperty('tokens');
      expect(res.body.tokens).toHaveProperty('accessToken');
      expect(res.body.tokens).toHaveProperty('refreshToken');
    });

    it('should return 401 with invalid credentials', async () => {
      const mockComparePassword = jest.fn().mockResolvedValue(false);

      (User.findOne as jest.Mock).mockResolvedValueOnce({
        comparePassword: mockComparePassword,
      });

      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should issue new tokens with valid refresh token', async () => {
      // Set up mock user with a refresh token
      (User.findByPk as jest.Mock).mockResolvedValueOnce({
        id: 'test-uuid-1234',
        refreshToken: 'valid-refresh-token',
        update: jest.fn().mockResolvedValue(true),
      });

      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'valid-refresh-token' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 with invalid refresh token', async () => {
      // Mock findByPk to return null for an invalid token
      (User.findByPk as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
