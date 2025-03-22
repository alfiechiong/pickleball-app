import {
  User,
  Game,
  Player,
  Tournament,
  TournamentParticipant,
  TournamentGame,
  sequelize,
} from '@/models';
import {
  testUsers,
  testGames,
  testPlayers,
  testTournaments,
  testTournamentParticipants,
  testTournamentGames,
} from '../seeds/testData';

/**
 * Clears all data from test database tables
 */
export const clearDatabase = async (): Promise<void> => {
  try {
    // Use CASCADE to handle foreign key dependencies
    await TournamentGame.destroy({ where: {}, force: true });
    await TournamentParticipant.destroy({ where: {}, force: true });
    await Tournament.destroy({ where: {}, force: true });
    await Player.destroy({ where: {}, force: true });
    await Game.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

/**
 * Seeds the database with test data
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    // Create test users
    await User.bulkCreate(testUsers);

    // Create test games
    await Game.bulkCreate(testGames);

    // Create test players
    await Player.bulkCreate(testPlayers);

    // Create test tournaments
    await Tournament.bulkCreate(testTournaments);

    // Create test tournament participants
    await TournamentParticipant.bulkCreate(testTournamentParticipants);

    // Create test tournament games
    await TournamentGame.bulkCreate(testTournamentGames);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

/**
 * Resets the database by clearing and seeding with fresh test data
 */
export const resetDatabase = async (): Promise<void> => {
  await clearDatabase();
  await seedDatabase();
};

/**
 * Connects to the database and syncs all models
 */
export const setupDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

/**
 * Closes the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};
