import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationSchema } from './infrastructure/persistence/reservation.schema';
import { ReservationRepository } from './infrastructure/persistence/reservation.repository';
import { RESERVATION_REPOSITORY } from './domain/repositories/reservation.repository.interface';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { CancelReservationUseCase } from './application/use-cases/cancel-reservation.use-case';
import { GetReservationsByUserUseCase } from './application/use-cases/get-reservations-by-user.use-case';
import { GetReservationsByProviderUseCase } from './application/use-cases/get-reservations-by-provider.use-case';
import { UpdateReservationStatusUseCase } from './application/use-cases/update-reservation-status.use-case';
import { ReservationsController } from './infrastructure/controllers/reservations.controller';
import { SchedulesModule } from '../schedules/schedules.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationSchema]),
    forwardRef(() => SchedulesModule),
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [
    // Repositories
    {
      provide: RESERVATION_REPOSITORY,
      useClass: ReservationRepository,
    },

    // Use Cases
    CreateReservationUseCase,
    CancelReservationUseCase,
    GetReservationsByUserUseCase,
    GetReservationsByProviderUseCase,
    UpdateReservationStatusUseCase,
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationsModule {}
