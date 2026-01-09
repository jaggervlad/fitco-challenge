import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'ID del servicio' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ example: 1, description: 'ID del horario' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty({ example: 1, description: 'ID del cliente' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({
    example: 'Preferencia por la mañana',
    description: 'Notas adicionales',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
