import { sequelize } from '../models';

async function listGames() {
  try {
    const [games] = await sequelize.query("SELECT * FROM games WHERE status = 'open'");
    console.log('Available games:', JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error fetching games:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
listGames();
