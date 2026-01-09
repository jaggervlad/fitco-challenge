import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { Schedule } from '../../domain/entities/schedule.entity';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';

@Injectable()
export class UpdateScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(
    serviceId: number,
    scheduleId: number,
    dto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const existingSchedule = await this.scheduleRepository.findById(scheduleId);

    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    if (existingSchedule.serviceId !== serviceId) {
      throw new NotFoundException(
        `Schedule with ID ${scheduleId} not found for service ${serviceId}`,
      );
    }

    if (dto.capacity && dto.capacity <= existingSchedule.reservationCounts) {
      throw new Error('Cannot reduce capacity below current reservation count');
    }

    const updateSchedule = existingSchedule.clone(dto);

    await this.scheduleRepository.update(scheduleId, updateSchedule);

    return updateSchedule;
  }
}
