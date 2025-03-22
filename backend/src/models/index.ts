import { Sequelize } from 'sequelize';
import config from '../config';

import userModel, { User } from './User';
import gameModel, { Game } from './Game';
import playerModel, { Player } from './Player';
import tournamentModel, { Tournament } from './Tournament';
import tournamentParticipantModel, { TournamentParticipant } from './TournamentParticipant';
import tournamentGameModel, { TournamentGame } from './TournamentGame';

// Initialize Sequelize instance
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions:
      config.env === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  }
);

// Initialize models
const models = {
  User: userModel(sequelize),
  Game: gameModel(sequelize),
  Player: playerModel(sequelize),
  Tournament: tournamentModel(sequelize),
  TournamentParticipant: tournamentParticipantModel(sequelize),
  TournamentGame: tournamentGameModel(sequelize),
};

// Establish associations between models

// Game-User association (many-to-many through Player)
models.Game.belongsToMany(models.User, {
  through: models.Player,
  foreignKey: 'gameId',
  otherKey: 'userId',
  as: 'players',
});

models.User.belongsToMany(models.Game, {
  through: models.Player,
  foreignKey: 'userId',
  otherKey: 'gameId',
  as: 'games',
});

// Tournament-User association (many-to-many through TournamentParticipant)
models.Tournament.belongsToMany(models.User, {
  through: models.TournamentParticipant,
  foreignKey: 'tournamentId',
  otherKey: 'userId',
  as: 'participants',
});

models.User.belongsToMany(models.Tournament, {
  through: models.TournamentParticipant,
  foreignKey: 'userId',
  otherKey: 'tournamentId',
  as: 'tournaments',
});

// Tournament-Game association (many-to-many through TournamentGame)
models.Tournament.belongsToMany(models.Game, {
  through: models.TournamentGame,
  foreignKey: 'tournamentId',
  otherKey: 'gameId',
  as: 'games',
});

models.Game.belongsToMany(models.Tournament, {
  through: models.TournamentGame,
  foreignKey: 'gameId',
  otherKey: 'tournamentId',
  as: 'tournaments',
});

export { sequelize, models, User, Game, Player, Tournament, TournamentParticipant, TournamentGame };
