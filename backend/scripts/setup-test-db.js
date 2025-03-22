const { exec } = require('child_process');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Database configuration from environment
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

console.log('Setting up test database...');

// Create test database if it doesn't exist
const createDbCommand = `PGPASSWORD=${dbPassword} psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "CREATE DATABASE ${dbName} WITH OWNER = ${dbUser} ENCODING = 'UTF8' CONNECTION LIMIT = -1;" postgres`;

exec(createDbCommand, (error, stdout, stderr) => {
  if (error) {
    // Ignore error if database already exists
    if (!stderr.includes('already exists')) {
      console.error(`Error creating database: ${stderr}`);
      process.exit(1);
    } else {
      console.log('Database already exists, continuing...');
    }
  } else {
    console.log('Test database created successfully.');
  }

  // Run migrations on test database
  console.log('Running migrations on test database...');
  const migrateCommand = 'NODE_ENV=test npx sequelize-cli db:migrate';

  exec(migrateCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running migrations: ${stderr}`);
      process.exit(1);
    }

    console.log('Migrations completed successfully.');
    console.log('Test database setup complete!');
  });
});
