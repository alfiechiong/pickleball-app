'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the host_id column already exists
    try {
      await queryInterface.describeTable('games');

      // Check if creator_id exists but host_id doesn't
      try {
        await queryInterface.addColumn('games', 'host_id', {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        });

        console.log('Added host_id column to games table');

        // If there's a creator_id column, copy values to host_id
        try {
          await queryInterface.sequelize.query(`
            UPDATE games 
            SET host_id = creator_id 
            WHERE creator_id IS NOT NULL
          `);
          console.log('Copied creator_id values to host_id');
        } catch (error) {
          console.error('Error copying creator_id values:', error);
        }
      } catch (error) {
        console.error('Error adding host_id column:', error);
      }
    } catch (error) {
      console.error('Error describing games table:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('games', 'host_id');
    } catch (error) {
      console.error('Error removing host_id column:', error);
    }
  },
};
