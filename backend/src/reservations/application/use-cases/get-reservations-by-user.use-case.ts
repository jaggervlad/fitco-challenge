import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { RESERVATION_REPOSITORY } from '../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class GetReservationsByUserUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(userId: number): Promise<Reservation[]> {
    try {
      return await this.reservationRepository.findByUserId(userId);
    } catch (error) {
      console.error('Error fetching reservations by user ID:', error);
      throw new ConflictException('Could not get reservations for the user');
    }
  }
}
