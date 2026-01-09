import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  type IScheduleRepository,
  SCHEDULE_REPOSITORY,
} from '../../domain/repositories/schedule.repository.interface';
import {
  Schedule,
  ScheduleStatus,
} from '../../domain/entities/schedule.entity';
import {
  type IReservationRepository,
  RESERVATION_REPOSITORY,
} from '../../../reservations/domain/repositories/reservation.repository.interface';
import { ReservationStatus } from '../../../reservations/domain/entities/reservation.entity';

@Injectable()
export class UpdateScheduleStatusUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(
    serviceId: number,
    scheduleId: number,
    status: ScheduleStatus,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule || schedule.serviceId !== serviceId) {
      throw new NotFoundException('Horario no encontrado');
    }

    // Validar reservas activas si se intenta cancelar o inactivar
    if (
      status === ScheduleStatus.CANCELLED ||
      status === ScheduleStatus.INACTIVE
    ) {
      const reservations =
        await this.reservationRepository.findByScheduleId(scheduleId);

      const activeReservations = reservations.filter(
        (r) =>
          r.status !== ReservationStatus.CANCELLED &&
          r.status !== ReservationStatus.ATTENDED &&
          r.status !== ReservationStatus.NO_SHOW,
      );

      if (activeReservations.length > 0) {
        throw new BadRequestException(
          `No se puede ${status === ScheduleStatus.CANCELLED ? 'cancelar' : 'desactivar'} un horario con reservas activas. Tiene ${activeReservations.length} reserva(s) pendiente(s) o confirmada(s).`,
        );
      }
    }

    const updatedSchedule = schedule.clone({ status });

    await this.scheduleRepository.update(scheduleId, updatedSchedule);

    return updatedSchedule;
  }
}
