import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ScheduleStatus } from 'src/schedules/domain/entities/schedule.entity';

export class UpdateScheduleDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({
    example: '10:00:00',
    description: 'Hora de inicio (formato HH:MM:SS)',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: '11:00:00',
    description: 'Hora de fin (formato HH:MM:SS)',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Capacidad máxima de reservas',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Estado del horario',
    enum: ScheduleStatus,
  })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}
