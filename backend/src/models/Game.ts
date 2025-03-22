import { Model, DataTypes, Optional, Sequelize, Association } from 'sequelize';
import { User } from './User';

// Game status enum
export enum GameStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Game attributes interface
export interface GameAttributes {
  id: string;
  date: Date;
  location: string;
  status: GameStatus;
  teamAScore?: number;
  teamBScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Interface for Game creation attributes
export interface GameCreationAttributes
  extends Optional<
    GameAttributes,
    'id' | 'teamAScore' | 'teamBScore' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

// Define the Game model
export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: string;
  public date!: Date;
  public location!: string;
  public status!: GameStatus;
  public teamAScore?: number;
  public teamBScore?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Associations
  public readonly players?: User[];

  // Define association methods
  public static associations: {
    players: Association<Game, User>;
  };
}

export default function (sequelize: Sequelize): typeof Game {
  Game.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(GameStatus)),
        allowNull: false,
        defaultValue: GameStatus.SCHEDULED,
      },
      teamAScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      teamBScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Game',
      tableName: 'games',
      paranoid: true, // Enable soft deletes
    }
  );

  return Game;
}
