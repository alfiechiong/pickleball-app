import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from './index';

// These are all the attributes in the User model
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  skill_level: string;
  profile_picture?: string | null;
  refresh_token?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public skill_level!: string;
  public profile_picture?: string | null;
  public refresh_token?: string | null;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at?: Date;

  // This method will compare the given password with the hashed password in the database
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skill_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'pro'),
      allowNull: false,
      defaultValue: 'intermediate',
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export { User, UserAttributes, UserCreationAttributes };
export default User;
