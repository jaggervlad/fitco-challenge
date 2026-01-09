import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleItemDto {
  @ApiProperty({
    example: 1,
    description: 'Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)',
  })
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    example: '10:00:00',
    description: 'Hora de inicio (formato HH:MM:SS)',
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    example: '11:00:00',
    description: 'Hora de fin (formato HH:MM:SS)',
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 10, description: 'Capacidad máxima de reservas' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  capacity: number;
}

export class CreateScheduleDto {
  @ApiProperty({
    type: [ScheduleItemDto],
    description: 'Lista de horarios a crear',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}
