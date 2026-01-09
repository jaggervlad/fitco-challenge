import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(dto.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await this.authService.hashPassword(dto.password);

      const user = await this.userRepository.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        phone: dto.phone || null,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ConflictException('Error creating user');
    }
  }
}
