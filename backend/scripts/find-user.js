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
  logging: false, // Disable logging
});

async function findUser() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Search for users with name or email containing 'alfie'
    const [users] = await sequelize.query(
      'SELECT id, email, name, skill_level FROM users WHERE LOWER(name) LIKE :searchTerm OR LOWER(email) LIKE :searchTerm',
      {
        replacements: { searchTerm: '%alfie%' },
      }
    );

    if (users.length === 0) {
      console.log('No users found with name or email containing "alfie"');
      return;
    }

    console.log('Found users:');
    users.forEach(user => {
      console.log(
        `ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Skill Level: ${user.skill_level || 'N/A'}`
      );
    });
  } catch (error) {
    console.error('Error finding users:', error);
  } finally {
    await sequelize.close();
  }
}

findUser();
