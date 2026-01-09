import { EntitySchema } from 'typeorm';
import { Service } from '../../domain/entities/service.entity';

export const ServiceSchema = new EntitySchema<Service>({
  name: 'Service',
  tableName: 'services',
  target: Service,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    providerId: {
      name: 'provider_id',
      type: Number,
    },
    name: {
      type: String,
      length: 255,
    },
    description: {
      type: 'text',
    },
    durationMinutes: {
      name: 'duration_minutes',
      type: Number,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
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
    provider: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'provider_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
});
