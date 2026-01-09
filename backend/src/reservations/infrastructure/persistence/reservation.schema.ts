import { EntitySchema } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
} from '../../domain/entities/reservation.entity';

export const ReservationSchema = new EntitySchema<Reservation>({
  name: 'Reservation',
  tableName: 'reservations',
  target: Reservation,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    serviceId: {
      name: 'service_id',
      type: Number,
    },
    scheduleId: {
      name: 'schedule_id',
      type: Number,
    },
    customerId: {
      name: 'customer_id',
      type: Number,
    },
    status: {
      type: 'enum',
      enum: ReservationStatus,
      default: ReservationStatus.PENDING,
    },
    notes: {
      type: 'text',
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
    service: {
      type: 'many-to-one',
      target: 'Service',
      joinColumn: {
        name: 'service_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    schedule: {
      type: 'many-to-one',
      target: 'Schedule',
      joinColumn: {
        name: 'schedule_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    customer: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'customer_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_RESERVATION_SERVICE_ID',
      columns: ['serviceId'],
    },
    {
      name: 'IDX_RESERVATION_SCHEDULE_ID',
      columns: ['scheduleId'],
    },
    {
      name: 'IDX_RESERVATION_CUSTOMER_ID',
      columns: ['customerId'],
    },
  ],
});
