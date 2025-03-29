import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';

async function createParticipantsTable() {
  try {
    // Check if table exists
    const tables = await sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_name = 'game_participants'`,
      { type: QueryTypes.SELECT }
    );

    if (tables.length > 0) {
      console.log('game_participants table already exists');
      return;
    }

    // Create enum type if it doesn't exist
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_game_participants_status') THEN
          CREATE TYPE enum_game_participants_status AS ENUM ('pending', 'approved', 'rejected');
        END IF;
      END
      $$;
    `);

    // Create table, using gen_random_uuid() instead of uuid_generate_v4()
    await sequelize.query(`
      CREATE TABLE game_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status enum_game_participants_status NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT unique_game_user UNIQUE(game_id, user_id)
      );
    `);

    console.log('Successfully created game_participants table');
  } catch (error) {
    console.error('Error creating game_participants table:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
createParticipantsTable();
