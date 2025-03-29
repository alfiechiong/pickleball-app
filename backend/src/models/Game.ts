import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';
import { User } from './User';

// These are all the attributes in the Game model
interface GameAttributes {
  id: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  location: string;
  max_players: number;
  skill_level: string;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  host_id: string;
  creator_id: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

// Some attributes are optional in `Game.build` and `Game.create` calls
interface GameCreationAttributes extends Optional<GameAttributes, 'id'> {}

class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: string;
  public date!: Date;
  public start_time!: Date;
  public end_time!: Date;
  public location!: string;
  public max_players!: number;
  public skill_level!: string;
  public status!: 'open' | 'full' | 'cancelled' | 'completed';
  public host_id!: string;
  public creator_id!: string;
  public notes?: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at?: Date;

  // You can also add custom instance methods here

  // Associations
  public readonly host?: User;
  public readonly creator?: User;
  public readonly participants?: any[]; // Will be populated with GameParticipant instances
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
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
    location: {
      type: DataTypes.STRING,
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
    host_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
  }
);

// Define associations
Game.belongsTo(User, {
  foreignKey: 'host_id',
  as: 'host',
});

Game.belongsTo(User, {
  foreignKey: 'creator_id',
  as: 'creator',
});

// Will be populated after GameParticipant model is loaded
// This is imported by the GameParticipant model to avoid circular dependencies
// GameParticipant.belongsTo(Game) handles the reverse relation

export { Game, GameAttributes, GameCreationAttributes };
export default Game;
