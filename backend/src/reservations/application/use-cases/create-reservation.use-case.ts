import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import {
  Reservation,
  ReservationStatus,
} from '../../domain/entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import {
  Schedule,
  ScheduleStatus,
} from 'src/schedules/domain/entities/schedule.entity';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CreateReservationDto): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findById(dto.customerId);
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.customerId} not found`);
      }

      const existingReservation = await queryRunner.manager
        .createQueryBuilder(Reservation, 'reservation')
        .where('reservation.customerId = :customerId', {
          customerId: dto.customerId,
        })
        .andWhere('reservation.scheduleId = :scheduleId', {
          scheduleId: dto.scheduleId,
        })
        .andWhere('reservation.serviceId = :serviceId', {
          serviceId: dto.serviceId,
        })
        .andWhere('reservation.status != :cancelledStatus', {
          cancelledStatus: ReservationStatus.CANCELLED,
        })
        .getOne();

      if (existingReservation) {
        throw new ConflictException(
          'You already have a reservation for this schedule',
        );
      }

      const schedule = await queryRunner.manager
        .createQueryBuilder(Schedule, 'schedule')
        .where('schedule.id = :id', { id: dto.scheduleId })
        .setLock('pessimistic_write')
        .getOne();

      if (!schedule) {
        throw new NotFoundException(
          `Schedule with ID ${dto.scheduleId} not found`,
        );
      }

      if (schedule.status !== ScheduleStatus.ACTIVE) {
        throw new BadRequestException('Schedule is not active');
      }

      if (schedule.reservationCounts >= schedule.capacity) {
        throw new ConflictException('Schedule is at full capacity');
      }

      const reservationData = Reservation.create({
        customerId: user.id,
        serviceId: dto.serviceId,
        scheduleId: dto.scheduleId,
        notes: dto?.notes || '',
        status: ReservationStatus.PENDING,
      });

      const reservation = await queryRunner.manager.save(
        'Reservation',
        reservationData,
      );

      await queryRunner.manager.increment(
        'schedules',
        { id: dto.scheduleId },
        'reservationCounts',
        1,
      );

      await queryRunner.commitTransaction();

      return reservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
