import { Model, DataTypes, Sequelize, ForeignKey } from 'sequelize';

// TournamentGame attributes interface
export interface TournamentGameAttributes {
  id: string;
  tournamentId: string;
  gameId: string;
  round: number; // e.g., 1 for first round, 2 for quarter-finals, etc.
  matchNumber: number; // Position in the tournament bracket
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the TournamentGame model
export class TournamentGame
  extends Model<TournamentGameAttributes>
  implements TournamentGameAttributes
{
  public id!: string;
  public tournamentId!: ForeignKey<string>;
  public gameId!: ForeignKey<string>;
  public round!: number;
  public matchNumber!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TournamentGame {
  TournamentGame.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tournamentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tournaments',
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
      round: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      matchNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TournamentGame',
      tableName: 'tournament_games',
      indexes: [
        {
          unique: true,
          fields: ['tournamentId', 'gameId'],
        },
        {
          unique: true,
          fields: ['tournamentId', 'round', 'matchNumber'],
        },
      ],
    }
  );

  return TournamentGame;
}
