import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ example: 'Clase de Yoga', description: 'Nombre del servicio' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Clase de yoga para principiantes',
    description: 'Descripción del servicio',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 60, description: 'Duración en minutos' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: 25.5, description: 'Precio del servicio' })
  @IsNumber()
  @IsPositive()
  price: number;
}
