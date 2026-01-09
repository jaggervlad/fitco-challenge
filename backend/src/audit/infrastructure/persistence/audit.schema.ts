import { EntitySchema } from 'typeorm';
import { Audit } from '../../domain/entities/audit.entity';

export const AuditSchema = new EntitySchema<Audit>({
  name: 'Audit',
  tableName: 'audit',
  target: Audit,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    userId: {
      name: 'user_id',
      type: Number,
    },
    action: {
      type: String,
      length: 100,
    },
    entity: {
      type: String,
      length: 100,
    },
    entityId: {
      name: 'entity_id',
      type: Number,
    },
    metadata: {
      type: 'json',
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
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
    },
  },
  indices: [
    {
      name: 'IDX_AUDIT_USER_ID',
      columns: ['userId'],
    },
    {
      name: 'IDX_AUDIT_ENTITY',
      columns: ['entity', 'entityId'],
    },
    {
      name: 'IDX_AUDIT_ACTION',
      columns: ['action'],
    },
  ],
});
