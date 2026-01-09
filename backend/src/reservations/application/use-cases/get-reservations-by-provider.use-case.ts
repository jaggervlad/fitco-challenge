import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  type IReservationRepository,
  RESERVATION_REPOSITORY,
} from '../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class GetReservationsByProviderUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(providerId: number): Promise<Reservation[]> {
    try {
      return await this.reservationRepository.findByProviderId(providerId);
    } catch (error) {
      throw new ConflictException(
        `Error al obtener las reservas del provider: ${error.message}`,
      );
    }
  }
}
