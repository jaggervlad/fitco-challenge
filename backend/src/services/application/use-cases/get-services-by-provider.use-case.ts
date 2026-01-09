import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServicesByProviderUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(providerId: number): Promise<Service[]> {
    return this.serviceRepository.findByProviderId(providerId);
  }
}
