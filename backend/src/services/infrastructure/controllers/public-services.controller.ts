import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetServiceDetailsUseCase } from '../../application/use-cases/get-service-details.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/get-all-services.use-case';
import { ServiceResponseDto } from '../../application/dto/service-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Services - Public')
@Controller('services')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicServicesController {
  constructor(
    private readonly getServiceDetailsUseCase: GetServiceDetailsUseCase,
    private readonly getAllServicesUseCase: GetAllServicesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los servicios (público)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    type: [ServiceResponseDto],
  })
  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.getAllServicesUseCase.execute();
    return plainToInstance(ServiceResponseDto, services);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID (público)' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio encontrado',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponseDto> {
    // Para endpoint público, no validamos el providerId
    const service = await this.getServiceDetailsUseCase.execute({
      id,
      providerId: null, // Permitimos null para búsqueda pública
    });
    return plainToInstance(ServiceResponseDto, service);
  }
}
