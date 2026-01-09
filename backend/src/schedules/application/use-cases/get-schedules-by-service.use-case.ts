import { Inject, Injectable } from '@nestjs/common';
import type { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleResponseDto } from '../dto/schedule-response.dto';

@Injectable()
export class GetSchedulesByServiceUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(serviceId: number): Promise<ScheduleResponseDto[]> {
    const schedules = await this.scheduleRepository.findByServiceId(serviceId);

    return schedules.map((schedule) => {
      const dto = {} as ScheduleResponseDto;
      dto.id = schedule.id;
      dto.dayOfWeek = schedule.dayOfWeek;
      dto.serviceId = schedule.serviceId;
      dto.startTime = schedule.startTime;
      dto.endTime = schedule.endTime;
      dto.capacity = schedule.capacity;
      dto.reservationCounts = schedule.reservationCounts;
      dto.status = schedule.status;
      dto.isFull = schedule.isFull;

      dto.availableSlots = schedule.capacity - schedule.reservationCounts;
      dto.hasReservation = schedule.reservationCounts > 0;

      return dto;
    });
  }
}
