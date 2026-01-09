import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(serviceId: number, scheduleId: number): Promise<void> {
    const existingSchedule = await this.scheduleRepository.findById(scheduleId);

    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    if (existingSchedule.serviceId !== serviceId) {
      throw new NotFoundException(
        `Schedule with ID ${scheduleId} not found for service ${serviceId}`,
      );
    }

    if (existingSchedule.reservationCounts > 0) {
      throw new BadRequestException(
        `Cannot delete schedule with active reservations`,
      );
    }

    await this.scheduleRepository.delete(scheduleId);
  }
}
