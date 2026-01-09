import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from 'src/services/domain/entities/service.entity';
import {
  type IServiceRepository,
  SERVICE_REPOSITORY,
} from 'src/services/domain/repositories/service.repository.interface';
import { UserRole } from 'src/users/domain/entities/user.entity';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/users/domain/repositories/user.repository.interface';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: number,
    providerId: number,
    dto: UpdateServiceDto,
  ): Promise<Service> {
    const user = await this.userRepository.findById(providerId);

    if (!user) {
      throw new NotFoundException(`User with ID ${providerId} not found`);
    }

    if (user.id !== providerId) {
      throw new NotFoundException(
        `Service with ID ${id} does not belong to provider with ID ${providerId}`,
      );
    }

    if (user.role !== UserRole.PROVIDER) {
      throw new NotFoundException(
        `User with ID ${providerId} is not a provider`,
      );
    }

    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const updateService = service.clone(dto);

    await this.serviceRepository.update(id, updateService);

    return updateService;
  }
}
