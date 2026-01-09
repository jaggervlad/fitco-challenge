import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../../domain/entities/schedule.entity';

export class UpdateScheduleStatusDto {
  @ApiProperty({
    enum: ScheduleStatus,
    example: ScheduleStatus.INACTIVE,
  })
  @IsEnum(ScheduleStatus)
  @IsNotEmpty()
  status: ScheduleStatus;
}
