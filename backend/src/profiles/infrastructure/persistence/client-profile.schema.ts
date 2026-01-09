import { EntitySchema } from 'typeorm';
import { ClientProfile } from '../../domain/entities/client-profile.entity';

export const ClientProfileSchema = new EntitySchema<ClientProfile>({
  name: 'ClientProfile',
  tableName: 'client_profiles',
  target: ClientProfile,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    userId: {
      name: 'user_id',
      type: Number,
      unique: true,
    },
    preferredLanguage: {
      name: 'preferred_language',
      type: String,
      length: 10,
      nullable: true,
    },
    birthdate: {
      type: 'date',
      nullable: true,
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
  relations: {
    userId: {
      type: 'one-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_CLIENT_PROFILE_USER_ID',
      columns: ['userId'],
      unique: true,
    },
  ],
});
