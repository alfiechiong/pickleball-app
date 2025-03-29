import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';
import { User } from './User';
import { Game } from './game';

// These are all the attributes in the GameParticipant model
interface GameParticipantAttributes {
  id: string;
  game_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

// Some attributes are optional in `GameParticipant.build` and `GameParticipant.create` calls
interface GameParticipantCreationAttributes extends Optional<GameParticipantAttributes, 'id'> {}

class GameParticipant
  extends Model<GameParticipantAttributes, GameParticipantCreationAttributes>
  implements GameParticipantAttributes
{
  public id!: string;
  public game_id!: string;
  public user_id!: string;
  public status!: 'pending' | 'approved' | 'rejected';

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at?: Date;

  // Associations
  public readonly game?: Game;
  public readonly user?: User;
}

GameParticipant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'GameParticipant',
    tableName: 'game_participants',
    paranoid: true,
    underscored: true,
  }
);

// Define associations
GameParticipant.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'game',
});

GameParticipant.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

export { GameParticipant, GameParticipantAttributes, GameParticipantCreationAttributes };
export default GameParticipant;
