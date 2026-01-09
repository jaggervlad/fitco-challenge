import { EntitySchema } from 'typeorm';
import { User, UserStatus, UserRole } from '../../domain/entities/user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 255,
    },
    email: {
      type: String,
      unique: true,
      length: 255,
    },
    password: {
      type: String,
      length: 255,
    },
    phone: {
      type: String,
      length: 20,
      nullable: true,
    },
    role: {
      type: 'enum',
      enum: UserRole,
      default: UserRole.CLIENT,
    },
    status: {
      type: 'enum',
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'IDX_USER_EMAIL',
      columns: ['email'],
      unique: true,
    },
    {
      name: 'IDX_USER_ROLE',
      columns: ['role'],
    },
    {
      name: 'IDX_USER_STATUS',
      columns: ['status'],
    },
  ],
});
