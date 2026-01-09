import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../domain/entities/reservation.entity';

export class UpdateReservationStatusDto {
  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;
}
