import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  type IReservationRepository,
  RESERVATION_REPOSITORY,
} from '../../domain/repositories/reservation.repository.interface';
import {
  Reservation,
  ReservationStatus,
} from '../../domain/entities/reservation.entity';

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(id: number, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Validar transiciones de estado permitidas
    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException(
        'No se puede modificar una reserva cancelada',
      );
    }

    if (reservation.status === ReservationStatus.ATTENDED) {
      throw new BadRequestException(
        'No se puede modificar una reserva ya atendida',
      );
    }

    const updated = await this.reservationRepository.update(id, { status });
    return updated;
  }
}
