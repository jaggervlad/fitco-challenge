import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Reservation | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return await this.repository.find({
      where: { customerId: userId },
      relations: ['service', 'service.provider', 'schedule'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProviderId(providerId: number): Promise<Reservation[]> {
    return await this.repository.find({
      where: { service: { providerId } },
      relations: ['service', 'service.provider', 'schedule', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByScheduleId(scheduleId: number): Promise<Reservation[]> {
    return await this.repository.find({
      where: { serviceId: scheduleId },
    });
  }

  async create(reservation: Partial<Reservation>): Promise<Reservation> {
    const schema = this.repository.create(reservation);
    return await this.repository.save(schema);
  }

  async update(
    id: number,
    reservation: Partial<Reservation>,
  ): Promise<Reservation> {
    await this.repository.update(id, reservation);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Reservation not found after update');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
