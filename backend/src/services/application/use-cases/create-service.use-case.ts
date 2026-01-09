import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository.interface';
import type { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import { Service } from '../../domain/entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UserRole } from '../../../users/domain/entities/user.entity';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(providerId: number, dto: CreateServiceDto): Promise<Service> {
    const user = await this.userRepository.findById(providerId);

    if (!user) {
      throw new NotFoundException(`User with ID ${providerId} not found`);
    }

    if (user.role !== UserRole.PROVIDER) {
      throw new NotFoundException(
        `User with ID ${providerId} is not a provider`,
      );
    }

    const service = Service.create({
      providerId,
      name: dto.name,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
    });

    return this.serviceRepository.create(service);
  }
}
