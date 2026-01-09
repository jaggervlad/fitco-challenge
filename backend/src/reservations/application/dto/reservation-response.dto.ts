import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReservationStatus } from '../../domain/entities/reservation.entity';

class ProviderDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;
}

class CustomerDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;
}

class ServiceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  duration: number;

  @ApiProperty({ type: ProviderDto })
  @Expose()
  @Type(() => ProviderDto)
  provider: ProviderDto;
}

class ScheduleDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  dayOfWeek: number;

  @ApiProperty()
  @Expose()
  startTime: string;

  @ApiProperty()
  @Expose()
  endTime: string;

  @ApiProperty()
  @Expose()
  capacity: number;

  @ApiProperty()
  @Expose()
  reservationCounts: number;
}

@Exclude()
export class ReservationResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  serviceId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  scheduleId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  customerId: number;

  @ApiProperty({ enum: ReservationStatus, example: ReservationStatus.PENDING })
  @Expose()
  status: ReservationStatus;

  @ApiProperty({ example: 'Notas adicionales' })
  @Expose()
  notes: string;

  @ApiProperty({ type: ServiceDto })
  @Expose()
  @Type(() => ServiceDto)
  service?: ServiceDto;

  @ApiProperty({ type: ScheduleDto })
  @Expose()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;

  @ApiProperty({ type: CustomerDto })
  @Expose()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
