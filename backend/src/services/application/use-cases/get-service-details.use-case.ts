import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServiceDetailsUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(params: { id: number; providerId: number }): Promise<Service> {
    const { id } = params;

    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new Error('Service not found for the given provider');
    }

    return service;
  }
}
