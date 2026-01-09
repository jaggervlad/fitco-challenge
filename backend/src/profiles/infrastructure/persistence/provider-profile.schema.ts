import { EntitySchema } from 'typeorm';
import { ProviderProfile } from '../../domain/entities/provider-profile.entity';

export const ProviderProfileSchema = new EntitySchema<ProviderProfile>({
  name: 'ProviderProfile',
  tableName: 'provider_profiles',
  target: ProviderProfile,
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
    bio: {
      type: 'text',
      nullable: true,
    },
    companyName: {
      name: 'company_name',
      type: String,
      length: 255,
      nullable: true,
    },
    photoUrl: {
      name: 'photo_url',
      type: String,
      length: 500,
      nullable: true,
    },
    location: {
      type: String,
      length: 255,
      nullable: true,
    },
    experienceYears: {
      name: 'experience_years',
      type: Number,
      nullable: true,
    },
    verified: {
      type: Boolean,
      default: false,
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
      name: 'IDX_PROVIDER_PROFILE_USER_ID',
      columns: ['userId'],
      unique: true,
    },
  ],
});
