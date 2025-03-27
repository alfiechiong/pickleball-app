# Pickleball App Backend Service

This is the backend service for the Pickleball App, built with Node.js, Express, TypeScript, and PostgreSQL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database](#database)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)

## Prerequisites

- Node.js (v20.x or later)
- PostgreSQL (v14.x or later)
- npm (v9.x or later)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd pickleball-app/backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create environment files for different environments
cp .env.example .env.development
cp .env.example .env.test
cp .env.example .env.production
```

4. Update the environment variables in the respective files with your configuration.

5. Set up the database:

```bash
# Create database and run migrations
npm run db:setup

# For development environment specifically
NODE_ENV=development npm run db:setup
```

6. Start the development server:

```bash
npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database migrations and seeders
│   ├── middlewares/      # Express middlewares
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── .env.example         # Example environment variables
├── .sequelizerc         # Sequelize CLI configuration
└── package.json
```

## Database

### Models

#### User Model

- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `skill_level`: Enum ('beginner', 'intermediate', 'advanced', 'pro')
- `profile_picture`: String (Optional)
- `refresh_token`: Text (Optional)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### Migration Process

1. Create a new migration:

```bash
npm run migration:create -- --name your-migration-name
```

2. Run migrations:

```bash
# Development environment
npm run db:migrate

# Test environment
NODE_ENV=test npm run db:migrate

# Production environment
NODE_ENV=production npm run db:migrate
```

3. Rollback migrations:

```bash
# Last migration
npm run db:rollback

# All migrations
npm run db:rollback:all
```

4. Check migration status:

```bash
npm run db:status
```

## Authentication

The service uses JWT (JSON Web Tokens) for authentication with the following features:

- Access Token and Refresh Token strategy
- Password hashing using bcrypt
- Token-based authentication using Passport-JWT

### Authentication Flow

1. **Registration** (`POST /api/v1/auth/register`):

   - Creates a new user account
   - Returns access token and refresh token

2. **Login** (`POST /api/v1/auth/login`):

   - Authenticates user credentials
   - Returns access token and refresh token

3. **Token Refresh** (`POST /api/v1/auth/refresh-token`):

   - Refreshes expired access token using refresh token
   - Returns new access token

4. **Logout** (`POST /api/v1/auth/logout`):

   - Invalidates refresh token
   - Requires authentication

5. **Get Current User** (`GET /api/v1/auth/me`):
   - Returns authenticated user's information
   - Requires authentication

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "skill_level": "beginner" | "intermediate" | "advanced" | "pro"
}
```

#### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "string"
}
```

#### Logout User

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:19006

# Database Configuration
DB_NAME=pickleball_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
JWT_REFRESH_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:19006

# Logging Configuration
LOG_LEVEL=debug
```

## Scripts

```json
{
  "scripts": {
    "dev": "nodemon -r dotenv/config src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "db:migrate": "sequelize db:migrate",
    "db:rollback": "sequelize db:migrate:undo",
    "db:rollback:all": "sequelize db:migrate:undo:all",
    "db:status": "sequelize db:migrate:status",
    "db:setup": "sequelize db:create && sequelize db:migrate",
    "db:reset": "sequelize db:drop && npm run db:setup"
  }
}
```
