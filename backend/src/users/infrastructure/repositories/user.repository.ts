import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { CreateUserDto } from 'src/users/domain/dto/create-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.repository.find({
      where: { status: UserStatus.ACTIVE },
    });

    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ?? null;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const users = await this.repository.find({ where: { status } });
    return users;
  }

  async create(params: CreateUserDto): Promise<User> {
    const user = this.repository.create({
      email: params.email,
      password: params.password,
      name: params.name,
      phone: params.phone,
      role: params.role,
      status: UserStatus.ACTIVE,
    });
    const saved = await this.repository.save(user);
    return saved;
  }

  async update(user: Partial<User>): Promise<User> {
    const updated = await this.repository.save(user);
    return updated;
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.update(id, { status: UserStatus.DELETED });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
