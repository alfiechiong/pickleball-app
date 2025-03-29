import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

interface JwtConfig {
  secret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

interface Config {
  env: string;
  port: number;
  apiUrl: string;
  frontendUrl: string;
  database: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
  };
  jwt: JwtConfig;
  cors: {
    origin: string;
  };
  logger: {
    level: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:19006',

  database: {
    name: process.env.DB_NAME || 'pickleball_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:19006',
  },

  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default config;
