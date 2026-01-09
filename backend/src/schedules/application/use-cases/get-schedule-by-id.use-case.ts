import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { Schedule } from '../../domain/entities/schedule.entity';

@Injectable()
export class GetScheduleByIdUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(serviceId: number, scheduleId: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // Verificar que el schedule pertenece al servicio especificado
    if (schedule.serviceId !== serviceId) {
      throw new NotFoundException(
        `Schedule with ID ${scheduleId} not found for service ${serviceId}`,
      );
    }

    return schedule;
  }
}
