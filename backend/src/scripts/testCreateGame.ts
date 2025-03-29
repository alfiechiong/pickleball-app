import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../models/User';
import { sequelize } from '../models';

/**
 * Script to test creating a game with authentication
 */
async function testCreateGame() {
  try {
    // Get a user from the database
    const user = await User.findOne();
    if (!user) {
      console.error('No user found in the database');
      return;
    }
    console.log(`Found user: ${user.email}`);

    // Create a JWT token for the user
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
      expiresIn: '1h',
    });
    console.log('Created token for testing');

    // Game data for testing
    const gameData = {
      location: 'Test Court',
      date: '2025-04-15',
      start_time: '14:00', // Simple time format
      end_time: '15:00', // Simple time format
      max_players: 4,
      skill_level: 'intermediate',
      notes: 'Test game creation',
    };

    // Make the API request to create a game
    try {
      const response = await axios.post('http://localhost:3000/api/v1/games', gameData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(`API Response: ${response.status}`);
      console.log('Game created successfully:', response.data);
    } catch (error: any) {
      console.error('Error testing game creation:');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Response data:`, error.response?.data);
      console.log(`Request data:`, gameData);
      console.log(`Request headers:`, error.request?._headers);
    }
  } catch (error) {
    console.error('Error in testCreateGame:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testCreateGame();
