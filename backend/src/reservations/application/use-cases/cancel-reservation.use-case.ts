import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { RESERVATION_REPOSITORY } from '../../domain/repositories/reservation.repository.interface';
import {
  Reservation,
  ReservationStatus,
} from '../../domain/entities/reservation.entity';

@Injectable()
export class CancelReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(id: number): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await this.reservationRepository.findById(id);
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }

      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('Reservation is already cancelled');
      }

      if (
        reservation.status === ReservationStatus.ATTENDED ||
        reservation.status === ReservationStatus.NO_SHOW
      ) {
        throw new BadRequestException(
          'Attended or no-show reservations cannot be cancelled',
        );
      }

      // Cancelar la reserva
      await queryRunner.manager.update('reservations', id, {
        status: ReservationStatus.CANCELLED,
      });

      // Decrementar el contador de reservas
      await queryRunner.manager.decrement(
        'schedules',
        { id: reservation.scheduleId },
        'reservationCounts',
        1,
      );

      await queryRunner.commitTransaction();

      return this.reservationRepository.findById(id) as Promise<Reservation>;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
