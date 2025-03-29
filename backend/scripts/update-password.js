require('dotenv').config();
const { Sequelize } = require('sequelize');
const dbConfig = require('../src/config/database');
const bcrypt = require('bcryptjs');

// Get the current environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Create a connection to the database
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: true, // Enable logging to see the SQL query
});

async function updatePassword() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // First, verify the user exists
    const [users] = await sequelize.query(
      'SELECT id, email, name FROM users WHERE email = :email',
      {
        replacements: { email: 'ALFIE@GMAL.COM' },
      }
    );

    if (users.length === 0) {
      console.log('User not found with email ALFIE@GMAL.COM');
      return;
    }

    console.log(`User found: Email: ${users[0].email}, Name: ${users[0].name}`);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Wala123!', salt);

    // Update the user's password
    const result = await sequelize.query(
      'UPDATE users SET password = :password WHERE email = :email',
      {
        replacements: { password: hashedPassword, email: 'ALFIE@GMAL.COM' },
      }
    );

    console.log('Update result:', result);
    console.log('Password updated successfully for ALFIE@GMAL.COM');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await sequelize.close();
  }
}

updatePassword();
