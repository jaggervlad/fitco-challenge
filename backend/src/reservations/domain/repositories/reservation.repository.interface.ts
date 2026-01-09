import { Reservation } from '../entities/reservation.entity';

export interface IReservationRepository {
  findAll(): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
  findByUserId(userId: number): Promise<Reservation[]>;
  findByProviderId(providerId: number): Promise<Reservation[]>;
  findByScheduleId(scheduleId: number): Promise<Reservation[]>;
  create(reservation: Partial<Reservation>): Promise<Reservation>;
  update(id: number, reservation: Partial<Reservation>): Promise<Reservation>;
  delete(id: number): Promise<void>;
}

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');
