import { Model, DataTypes, Sequelize, ForeignKey } from 'sequelize';

// TournamentParticipant attributes interface
export interface TournamentParticipantAttributes {
  id: string;
  userId: string;
  tournamentId: string;
  registrationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the TournamentParticipant model
export class TournamentParticipant
  extends Model<TournamentParticipantAttributes>
  implements TournamentParticipantAttributes
{
  public id!: string;
  public userId!: ForeignKey<string>;
  public tournamentId!: ForeignKey<string>;
  public registrationDate!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TournamentParticipant {
  TournamentParticipant.init(
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
      tournamentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tournaments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'TournamentParticipant',
      tableName: 'tournament_participants',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'tournamentId'],
        },
      ],
    }
  );

  return TournamentParticipant;
}
