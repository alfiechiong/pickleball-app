import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

interface GameAttributes {
  id: string;
  location: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  max_players: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  status: 'open' | 'full' | 'cancelled' | 'completed';
  creator_id: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface GameCreationAttributes
  extends Optional<GameAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'notes'> {}

export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: string;
  public location!: string;
  public date!: Date;
  public start_time!: Date;
  public end_time!: Date;
  public max_players!: number;
  public skill_level!: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  public status!: 'open' | 'full' | 'cancelled' | 'completed';
  public creator_id!: string;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;

  // Associations
  public readonly creator?: User;
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'pro'),
      allowNull: false,
      defaultValue: 'intermediate',
    },
    status: {
      type: DataTypes.ENUM('open', 'full', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'open',
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// Define associations
Game.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator',
});

export default Game;
