import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { Schedule } from '../../domain/entities/schedule.entity';

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly repository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Schedule | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByServiceId(serviceId: number): Promise<Schedule[]> {
    const schedules = await this.repository.find({
      where: { serviceId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });

    return schedules;
  }

  async findByServiceIdAndTime(
    serviceId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ): Promise<Schedule | null> {
    return this.repository.findOne({
      where: {
        serviceId,
        dayOfWeek,
        startTime,
        endTime,
      },
    });
  }

  async create(schedule: Partial<Schedule>): Promise<Schedule> {
    const schema = this.repository.create(schedule);
    return this.repository.save(schema);
  }
  async createBulk(schedules: Partial<Schedule>[]): Promise<Schedule[]> {
    const schemas = this.repository.create(schedules);
    return this.repository.save(schemas);
  }
  async update(id: number, schedule: Partial<Schedule>): Promise<void> {
    await this.repository.update(id, schedule);
  }

  async incrementReservationsCount(id: number): Promise<void> {
    await this.repository.increment({ id }, 'reservationsCount', 1);
  }

  async decrementReservationsCount(id: number): Promise<void> {
    await this.repository.decrement({ id }, 'reservationsCount', 1);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
