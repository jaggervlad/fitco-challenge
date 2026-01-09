import { EntitySchema } from 'typeorm';
import {
  Schedule,
  ScheduleStatus,
} from '../../domain/entities/schedule.entity';

export const ScheduleSchema = new EntitySchema<Schedule>({
  name: 'Schedule',
  tableName: 'schedules',
  target: Schedule,
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
    dayOfWeek: {
      name: 'day_of_week',
      type: Number,
      comment: '0=Sunday, 1=Monday, ... 6=Saturday',
    },
    startTime: {
      name: 'start_time',
      type: 'time',
    },
    endTime: {
      name: 'end_time',
      type: 'time',
    },
    capacity: {
      type: Number,
      default: 1,
    },
    reservationCounts: {
      name: 'reservation_counts',
      type: Number,
      default: 0,
    },
    status: {
      type: 'enum',
      enum: ScheduleStatus,
      default: ScheduleStatus.ACTIVE,
    },
    isFull: {
      name: 'is_full',
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
    serviceId: {
      type: 'many-to-one',
      target: 'Service',
      joinColumn: {
        name: 'service_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_SCHEDULE_DAY_OF_WEEK',
      columns: ['dayOfWeek'],
    },
  ],
});
