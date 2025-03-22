import { Model, DataTypes, Optional, Sequelize, Association } from 'sequelize';
import { User } from './User';
import { Game } from './Game';

// Tournament status enum
export enum TournamentStatus {
  UPCOMING = 'upcoming',
  REGISTRATION_OPEN = 'registrationOpen',
  REGISTRATION_CLOSED = 'registrationClosed',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Tournament attributes interface
export interface TournamentAttributes {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxParticipants: number;
  status: TournamentStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// Interface for Tournament creation attributes
export interface TournamentCreationAttributes
  extends Optional<
    TournamentAttributes,
    'id' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

// Define the Tournament model
export class Tournament
  extends Model<TournamentAttributes, TournamentCreationAttributes>
  implements TournamentAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public startDate!: Date;
  public endDate!: Date;
  public location!: string;
  public maxParticipants!: number;
  public status!: TournamentStatus;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Associations
  public readonly participants?: User[];
  public readonly games?: Game[];

  // Define association methods
  public static associations: {
    participants: Association<Tournament, User>;
    games: Association<Tournament, Game>;
  };
}

export default function (sequelize: Sequelize): typeof Tournament {
  Tournament.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 16,
      },
      status: {
        type: DataTypes.ENUM(...(Object.values(TournamentStatus) as string[])),
        allowNull: false,
        defaultValue: TournamentStatus.UPCOMING,
      },
    },
    {
      sequelize,
      modelName: 'Tournament',
      tableName: 'tournaments',
      paranoid: true, // Enable soft deletes
      validate: {
        endDateAfterStartDate() {
          // Cast to any to avoid TypeScript error when accessing properties in validation context
          const self = this as any;
          if (self.endDate < self.startDate) {
            throw new Error('End date cannot be before start date');
          }
        },
      },
    }
  );

  return Tournament;
}
