import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserStatus } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByStatus(status: UserStatus): Promise<User[]>;
  create(params: CreateUserDto): Promise<User>;
  update(user: User): Promise<User>;
  softDelete(id: number): Promise<void>;
  delete(id: number): Promise<void>;
}
