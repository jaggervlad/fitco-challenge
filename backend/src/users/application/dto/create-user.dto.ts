import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { UserRole } from 'src/users/domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'CLIENT',
    enum: [UserRole.CLIENT, UserRole.PROVIDER],
    description: 'User role (only CLIENT or PROVIDER allowed)',
  })
  @IsIn([UserRole.CLIENT, UserRole.PROVIDER], {
    message: 'role must be either CLIENT or PROVIDER',
  })
  role: UserRole;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;
}
