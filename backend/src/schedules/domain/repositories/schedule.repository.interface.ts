import { Schedule } from '../entities/schedule.entity';

export interface IScheduleRepository {
  findAll(): Promise<Schedule[]>;
  findById(id: number): Promise<Schedule | null>;
  findByServiceId(serviceId: number): Promise<Schedule[]>;
  findByServiceIdAndTime(
    serviceId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ): Promise<Schedule | null>;
  create(schedule: Partial<Schedule>): Promise<Schedule>;
  createBulk(schedules: Partial<Schedule>[]): Promise<Schedule[]>;
  update(id: number, schedule: Partial<Schedule>): Promise<void>;
  incrementReservationsCount(id: number): Promise<void>;
  decrementReservationsCount(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SCHEDULE_REPOSITORY = Symbol('SCHEDULE_REPOSITORY');
