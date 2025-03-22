# Pickleball App Backend

The backend API for the Pickleball mobile application built with Node.js, Express, PostgreSQL, and TypeScript.

## Features

- User authentication (register, login, logout) with JWT
- User profile management
- Game creation and management
- Tournament organization
- RESTful API design
- PostgreSQL database with Sequelize ORM
- Unit and integration testing

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 14+

## Getting Started

### Environment Setup

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Copy the example environment file: `cp .env.example .env`
5. Edit the `.env` file with your database credentials and other configurations

### Database Setup

1. Create development and test databases:

```bash
createdb pickleball_dev
createdb pickleball_test
```

2. Run database migrations:

```bash
npm run db:migrate
```

3. (Optional) Seed the database with sample data:

```bash
npm run db:seed
```

### Running the Server

Start the development server:

```bash
npm run dev
```

The server will be running at http://localhost:3000 (or another port if specified in the .env file).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Express middlewares
├── models/         # Sequelize models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── tests/          # Test files
├── migrations/     # Database migrations
├── seeders/        # Database seeders
└── index.ts        # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user profile

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Games

- `GET /api/v1/games` - Get all games
- `POST /api/v1/games` - Create a new game
- `GET /api/v1/games/:id` - Get game by ID
- `PUT /api/v1/games/:id` - Update game
- `DELETE /api/v1/games/:id` - Delete game

### Tournaments

- `GET /api/v1/tournaments` - Get all tournaments
- `POST /api/v1/tournaments` - Create a new tournament
- `GET /api/v1/tournaments/:id` - Get tournament by ID
- `PUT /api/v1/tournaments/:id` - Update tournament
- `DELETE /api/v1/tournaments/:id` - Delete tournament
- `POST /api/v1/tournaments/:id/register` - Register for a tournament
- `GET /api/v1/tournaments/:id/players` - Get tournament players

## Testing

This project uses Jest for testing. There are two types of tests:

1. **Unit Tests**: Test individual services and functions in isolation
2. **Integration Tests**: Test API endpoints with mocked database connections

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Generate test coverage report
npm run test:coverage
```

### Test Coverage

The authentication service and endpoints have comprehensive test coverage:

- Unit tests for the authentication service cover all critical functions like token generation, verification, and refresh.
- Integration tests for the authentication endpoints ensure correct behavior for registration, login, token refresh, user profile, and logout.

### Adding New Tests

When adding new tests:

1. For unit tests, place them in the `src/tests/unit` directory
2. For integration tests, place them in the `src/tests/integration` directory
3. Use the naming convention `*.test.ts` for test files
4. Mock external dependencies to ensure isolated testing
5. Use Jest's assertion functions to verify expected behavior

## License

[ISC](LICENSE)
