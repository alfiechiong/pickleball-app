import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';

async function checkGamesTable() {
  try {
    // Get column info
    const columns = await sequelize.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'games'
       ORDER BY ordinal_position`,
      { type: QueryTypes.SELECT }
    );

    console.log('Games table structure:');
    console.log(columns);
  } catch (error) {
    console.error('Error checking games table:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
checkGamesTable();
