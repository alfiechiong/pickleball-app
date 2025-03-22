# Backend Testing Documentation

This directory contains tests for the Pickleball App backend API, organized into unit tests, integration tests, and utility files for testing.

## Test Structure

- `unit/`: Contains unit tests for individual components (services, utilities, etc.)
- `integration/`: Contains integration tests for API endpoints
- `utils/`: Utility functions for testing
- `seeds/`: Test data for database seeding
- `setup.ts`: Global setup for Jest tests

## Running Tests

You can run tests using the following npm scripts:

```bash
# Set up the test database first
npm run test:setup

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Complete test process (setup and run)
npm run test:full
```

## Test Database

Tests use a separate PostgreSQL database (`pickleball_test`) to avoid interfering with development or production data. The test database is configured in `.env.test`.

## Test Environment

Tests run in a controlled environment with:

- Mock authentication
- Database synchronization (tables are recreated for each test run)
- Custom matchers for JWT token validation

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions and components in isolation. For example, see `unit/services/authService.test.ts`.

Example unit test:

```typescript
describe('SomeService', () => {
  it('should perform a specific action', () => {
    // Arrange
    const input = {
      /* ... */
    };

    // Act
    const result = someService.someMethod(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Integration Tests

Integration tests validate that API endpoints work correctly with all components integrated. For example, see `integration/auth.test.ts`.

Example integration test:

```typescript
describe('POST /api/resource', () => {
  it('should create a new resource', async () => {
    const res = await request(app)
      .post('/api/resource')
      .send(validData)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

## Best Practices

1. Keep tests isolated and independent
2. Clean up after tests (close connections, clear data)
3. Use descriptive test and assertion names
4. Mock external dependencies
5. Test both happy paths and error scenarios
6. Maintain a separate test database
