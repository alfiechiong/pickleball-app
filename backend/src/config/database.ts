import { Sequelize, Dialect } from 'sequelize';
import config from './index';

interface DatabaseConfig {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
    logging: boolean | ((sql: string) => void);
  };
}

const dbConfig: DatabaseConfig = {
  development: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false,
  },
};

const env = process.env.NODE_ENV || 'development';
const db = new Sequelize(dbConfig[env].database, dbConfig[env].username, dbConfig[env].password, {
  host: dbConfig[env].host,
  port: dbConfig[env].port,
  dialect: dbConfig[env].dialect,
  logging: dbConfig[env].logging,
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

export default db;
