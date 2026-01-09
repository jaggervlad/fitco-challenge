import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { getDayOfWeekName } from '../../domain/constants/days-of-week.constant';

@Exclude()
export class ScheduleResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  dayOfWeek: number;

  @ApiProperty({ example: 'Lunes', description: 'Nombre del día de la semana' })
  @Expose()
  get dayOfWeekName(): string {
    return getDayOfWeekName(this.dayOfWeek);
  }

  @ApiProperty({ example: 1 })
  @Expose()
  serviceId: number;

  @ApiProperty({ example: '2026-01-15T10:00:00Z' })
  @Expose()
  startTime: string;

  @ApiProperty({ example: '2026-01-15T11:00:00Z' })
  @Expose()
  endTime: string;

  @ApiProperty({ example: 5 })
  @Expose()
  availableSlots: number;

  @ApiProperty({ example: false })
  @Expose()
  hasReservation: boolean;

  @ApiProperty({ example: 10 })
  @Expose()
  capacity: number;

  @ApiProperty({ example: 3 })
  @Expose()
  reservationCounts: number;

  @ApiProperty({ example: 'active' })
  @Expose()
  status: string;

  @ApiProperty({ example: false })
  @Expose()
  isFull: boolean;

  @ApiProperty({ example: true, description: 'Indica si hay disponibilidad' })
  @Expose()
  get isAvailable(): boolean {
    return this.status === 'active' && !this.isFull;
  }

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
