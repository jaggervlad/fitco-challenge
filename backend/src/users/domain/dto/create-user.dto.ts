import { UserRole } from '../entities/user.entity';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string | null;
}
