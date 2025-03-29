import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';

async function addNotesColumn() {
  try {
    // Check if column exists
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'games' AND column_name = 'notes'`,
      { type: QueryTypes.SELECT }
    );

    if (columns.length === 0) {
      // Add the column if it doesn't exist
      await sequelize.query(`ALTER TABLE games ADD COLUMN notes TEXT;`);
      console.log('Successfully added notes column to games table.');
    } else {
      console.log('Notes column already exists in games table.');
    }
  } catch (error) {
    console.error('Error adding notes column:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
addNotesColumn();
