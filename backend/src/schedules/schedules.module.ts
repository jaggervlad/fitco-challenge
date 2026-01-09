import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleSchema } from './infrastructure/persistence/schedule.schema';
import { ScheduleRepository } from './infrastructure/persistence/schedule.repository';
import { SCHEDULE_REPOSITORY } from './domain/repositories/schedule.repository.interface';
import { CreateScheduleUseCase } from './application/use-cases/create-schedule.use-case';
import { GetSchedulesByServiceUseCase } from './application/use-cases/get-schedules-by-service.use-case';
import { GetScheduleByIdUseCase } from './application/use-cases/get-schedule-by-id.use-case';
import { UpdateScheduleUseCase } from './application/use-cases/update-schedule.use-case';
import { UpdateScheduleStatusUseCase } from './application/use-cases/update-schedule-status.use-case';
import { DeleteScheduleUseCase } from './application/use-cases/delete-schedule.use-case';
import { SchedulesController } from './infrastructure/controllers/schedules.controller';
import { ServicesModule } from '../services/services.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleSchema]),
    ServicesModule,
    forwardRef(() => ReservationsModule),
  ],
  controllers: [SchedulesController],
  providers: [
    // Repositories
    {
      provide: SCHEDULE_REPOSITORY,
      useClass: ScheduleRepository,
    },

    // Use Cases
    CreateScheduleUseCase,
    GetSchedulesByServiceUseCase,
    GetScheduleByIdUseCase,
    UpdateScheduleUseCase,
    UpdateScheduleStatusUseCase,
    DeleteScheduleUseCase,
  ],
  exports: [SCHEDULE_REPOSITORY],
})
export class SchedulesModule {}
