import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Service | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByProviderId(providerId: number): Promise<Service[]> {
    return await this.repository.find({ where: { providerId } });
  }

  async create(service: Partial<Service>): Promise<Service> {
    const schema = this.repository.create(service);
    return await this.repository.save(schema);
  }

  async update(id: number, service: Partial<Service>): Promise<void> {
    await this.repository.update(id, service);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
