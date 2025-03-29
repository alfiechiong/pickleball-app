import { Sequelize } from 'sequelize';
import config from '../config';

const db = new Sequelize({
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { db as sequelize };
export default db;
