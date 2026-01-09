import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { GetServicesByProviderUseCase } from '../../application/use-cases/get-services-by-provider.use-case';
import { CreateServiceDto } from '../../application/dto/create-service.dto';
import { ServiceResponseDto } from '../../application/dto/service-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetServiceDetailsUseCase } from 'src/services/application/use-cases/get-service-details.use-case';
import { UpdateServiceDto } from 'src/services/application/dto/update-service.dto';
import { UpdateServiceUseCase } from 'src/services/application/use-cases/update-service.use-case';

@ApiTags('Services')
@Controller('providers/:providerId/services')
@UseInterceptors(ClassSerializerInterceptor)
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServicesByProviderUseCase: GetServicesByProviderUseCase,
    private readonly getServiceDetailsUseCase: GetServiceDetailsUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio para un proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Servicio creado',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async create(
    @Param('providerId', ParseIntPipe) providerId: number,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(
      providerId,
      createServiceDto,
    );
    return plainToInstance(ServiceResponseDto, service);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los servicios de un proveedor' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    type: [ServiceResponseDto],
  })
  async findAll(
    @Param('providerId', ParseIntPipe) providerId: number,
  ): Promise<ServiceResponseDto[]> {
    const services =
      await this.getServicesByProviderUseCase.execute(providerId);
    return plainToInstance(ServiceResponseDto, services);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio encontrado',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async findOne(
    @Param('providerId', ParseIntPipe) providerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponseDto> {
    const service = await this.getServiceDetailsUseCase.execute({
      id,
      providerId,
    });
    return plainToInstance(ServiceResponseDto, service);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un servicio por ID' })
  @ApiParam({ name: 'providerId', description: 'ID del proveedor' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio actualizado',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async update(
    @Param('providerId', ParseIntPipe) providerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const updatedService = await this.updateServiceUseCase.execute(
      id,
      providerId,
      updateServiceDto,
    );
    return plainToInstance(ServiceResponseDto, updatedService);
  }
}
