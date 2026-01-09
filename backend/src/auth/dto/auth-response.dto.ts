import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/domain/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
  };
}
