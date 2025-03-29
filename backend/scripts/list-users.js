require('dotenv').config();
const { Sequelize } = require('sequelize');
const dbConfig = require('../src/config/database');

// Get the current environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Create a connection to the database
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false,
});

async function listUsers() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Query the users table directly
    const [users] = await sequelize.query('SELECT id, email, name, skill_level FROM users');
    console.log('All users:');
    users.forEach(user => {
      console.log(
        `ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Skill Level: ${user.skill_level}`
      );
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await sequelize.close();
  }
}

listUsers();
