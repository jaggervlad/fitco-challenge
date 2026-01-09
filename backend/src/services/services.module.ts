import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from './infrastructure/persistence/service.schema';
import { ServiceRepository } from './infrastructure/persistence/service.repository';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository.interface';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { GetServicesByProviderUseCase } from './application/use-cases/get-services-by-provider.use-case';
import { ServicesController } from './infrastructure/controllers/services.controller';
import { UsersModule } from '../users/users.module';
import { GetServiceDetailsUseCase } from './application/use-cases/get-service-details.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchema]), UsersModule],
  controllers: [ServicesController],
  providers: [
    // Repositories
    {
      provide: SERVICE_REPOSITORY,
      useClass: ServiceRepository,
    },

    // Use Cases
    CreateServiceUseCase,
    GetServicesByProviderUseCase,
    GetServiceDetailsUseCase,
    UpdateServiceUseCase,
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {}
