import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetAllServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(): Promise<Service[]> {
    return await this.serviceRepository.findAll();
  }
}
