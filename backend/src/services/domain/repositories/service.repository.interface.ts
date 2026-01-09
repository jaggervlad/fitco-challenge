import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  findById(id: number): Promise<Service | null>;
  findByProviderId(providerId: number): Promise<Service[]>;
  create(service: Partial<Service>): Promise<Service>;
  update(id: number, service: Partial<Service>): Promise<void>;
  delete(id: number): Promise<void>;
}

export const SERVICE_REPOSITORY = Symbol('SERVICE_REPOSITORY');
