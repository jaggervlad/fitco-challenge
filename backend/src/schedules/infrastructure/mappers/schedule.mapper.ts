import { Injectable } from '@nestjs/common';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleSchema } from '../persistence/schedule.schema';

@Injectable()
export class ScheduleMapper {
  toDomain(schema: any): Schedule {
    return new Schedule(
      schema.id,
      schema.serviceId,
      schema.dayOfWeek,
      schema.startTime,
      schema.endTime,
      schema.capacity,
      schema.reservationCounts,
      schema.status,
      schema.isFull,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  toPersistence(domain: Partial<Schedule>): any {
    const schema: any = {};

    if (domain.serviceId !== undefined) schema.serviceId = domain.serviceId;
    if (domain.dayOfWeek !== undefined) schema.dayOfWeek = domain.dayOfWeek;
    if (domain.startTime !== undefined) schema.startTime = domain.startTime;
    if (domain.endTime !== undefined) schema.endTime = domain.endTime;
    if (domain.capacity !== undefined) schema.capacity = domain.capacity;
    if (domain.reservationCounts !== undefined)
      schema.reservationCounts = domain.reservationCounts;
    if (domain.status !== undefined) schema.status = domain.status;
    if (domain.isFull !== undefined) schema.isFull = domain.isFull;

    return schema;
  }
}
