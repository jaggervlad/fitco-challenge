import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import type { IServiceRepository } from '../../../services/domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../../services/domain/repositories/service.repository.interface';
import {
  Schedule,
  ScheduleStatus,
} from '../../domain/entities/schedule.entity';
import { CreateScheduleDto } from '../dto/create-schedule.dto';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    serviceId: number,
    dto: CreateScheduleDto,
  ): Promise<Schedule[]> {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Validar duplicados dentro del mismo request
    const scheduleKeys = new Set<string>();
    for (const scheduleItem of dto.schedules) {
      const key = `${scheduleItem.dayOfWeek}-${scheduleItem.startTime}-${scheduleItem.endTime}`;
      if (scheduleKeys.has(key)) {
        throw new ConflictException(
          `Duplicate schedule found in request: Day ${scheduleItem.dayOfWeek} at ${scheduleItem.startTime}-${scheduleItem.endTime}`,
        );
      }
      scheduleKeys.add(key);
    }

    // Validar que no existan en la base de datos
    for (const scheduleItem of dto.schedules) {
      const existingSchedule =
        await this.scheduleRepository.findByServiceIdAndTime(
          serviceId,
          scheduleItem.dayOfWeek,
          scheduleItem.startTime,
          scheduleItem.endTime,
        );

      if (existingSchedule) {
        throw new ConflictException(
          `A schedule already exists for this service on day ${scheduleItem.dayOfWeek} at ${scheduleItem.startTime}-${scheduleItem.endTime}`,
        );
      }
    }

    const schedulesToCreate = dto.schedules.map((scheduleItem) =>
      Schedule.create({
        serviceId,
        dayOfWeek: scheduleItem.dayOfWeek,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,
        capacity: scheduleItem.capacity,
        status: ScheduleStatus.ACTIVE,
      }),
    );

    return this.scheduleRepository.createBulk(schedulesToCreate);
  }
}
