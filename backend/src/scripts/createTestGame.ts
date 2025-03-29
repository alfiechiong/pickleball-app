import { sequelize } from '../models';
import { format } from 'date-fns';
import { randomUUID } from 'crypto';

// Define a type for the user object
interface UserRecord {
  id: string;
  name: string;
  email: string;
}

async function createTestGame() {
  try {
    // Query to get users
    const [users] = await sequelize.query('SELECT * FROM users LIMIT 1');

    if (!Array.isArray(users) || users.length === 0) {
      console.error('No users found in the database');
      return;
    }

    // Take the first user as the host with type casting
    const hostId = (users[0] as UserRecord).id;

    // Format the times for PostgreSQL
    const now = new Date();
    const formattedDate = '2025-03-29';
    const formattedStartTime = format(now, 'HH:mm:ss');
    const later = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    const formattedEndTime = format(later, 'HH:mm:ss');

    // Generate a UUID for the game
    const gameId = randomUUID();

    // Execute raw SQL query to insert the game
    await sequelize.query(`
      INSERT INTO games 
      (id, date, start_time, end_time, location, max_players, skill_level, status, creator_id, host_id, created_at, updated_at)
      VALUES 
      ('${gameId}', '${formattedDate}', '${formattedStartTime}', '${formattedEndTime}', 'Central Park Courts', 4, 'intermediate', 'open', '${hostId}', '${hostId}', NOW(), NOW())
      RETURNING *;
    `);

    console.log('Test game created successfully!');
  } catch (error) {
    console.error('Error creating game:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the function
createTestGame();
