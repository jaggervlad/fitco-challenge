import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ServiceResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  providerId: number;

  @ApiProperty({ example: 'Clase de Yoga' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Clase de yoga para principiantes' })
  @Expose()
  description: string;

  @ApiProperty({ example: 60 })
  @Expose()
  durationMinutes: number;

  @ApiProperty({ example: 25.5 })
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
