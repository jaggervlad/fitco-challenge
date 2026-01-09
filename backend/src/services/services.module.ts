import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from './infrastructure/persistence/service.schema';
import { ServiceRepository } from './infrastructure/persistence/service.repository';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository.interface';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { GetServicesByProviderUseCase } from './application/use-cases/get-services-by-provider.use-case';
import { GetAllServicesUseCase } from './application/use-cases/get-all-services.use-case';
import { ServicesController } from './infrastructure/controllers/services.controller';
import { PublicServicesController } from './infrastructure/controllers/public-services.controller';
import { UsersModule } from '../users/users.module';
import { GetServiceDetailsUseCase } from './application/use-cases/get-service-details.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchema]), UsersModule],
  controllers: [ServicesController, PublicServicesController],
  providers: [
    // Repositories
    {
      provide: SERVICE_REPOSITORY,
      useClass: ServiceRepository,
    },

    // Use Cases
    CreateServiceUseCase,
    GetServicesByProviderUseCase,
    GetAllServicesUseCase,
    GetServiceDetailsUseCase,
    UpdateServiceUseCase,
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {}
