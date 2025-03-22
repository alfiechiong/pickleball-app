import { Model, DataTypes, Sequelize, ForeignKey } from 'sequelize';

// Player attributes interface
export interface PlayerAttributes {
  id: string;
  userId: string;
  gameId: string;
  team: 'A' | 'B';
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Player model
export class Player extends Model<PlayerAttributes> implements PlayerAttributes {
  public id!: string;
  public userId!: ForeignKey<string>;
  public gameId!: ForeignKey<string>;
  public team!: 'A' | 'B';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Player {
  Player.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      gameId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      team: {
        type: DataTypes.ENUM('A', 'B'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Player',
      tableName: 'players',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'gameId'],
        },
      ],
    }
  );

  return Player;
}
