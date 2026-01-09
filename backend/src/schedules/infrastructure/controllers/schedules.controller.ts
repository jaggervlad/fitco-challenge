import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule.use-case';
import { GetSchedulesByServiceUseCase } from '../../application/use-cases/get-schedules-by-service.use-case';
import { GetScheduleByIdUseCase } from '../../application/use-cases/get-schedule-by-id.use-case';
import { UpdateScheduleUseCase } from '../../application/use-cases/update-schedule.use-case';
import { UpdateScheduleStatusUseCase } from '../../application/use-cases/update-schedule-status.use-case';
import { DeleteScheduleUseCase } from '../../application/use-cases/delete-schedule.use-case';
import { CreateScheduleDto } from '../../application/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../../application/dto/update-schedule.dto';
import { UpdateScheduleStatusDto } from '../../application/dto/update-schedule-status.dto';
import { ScheduleResponseDto } from '../../application/dto/schedule-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Schedules')
@Controller('services/:serviceId/schedules')
@UseInterceptors(ClassSerializerInterceptor)
export class SchedulesController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly getSchedulesByServiceUseCase: GetSchedulesByServiceUseCase,
    private readonly getScheduleByIdUseCase: GetScheduleByIdUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly updateScheduleStatusUseCase: UpdateScheduleStatusUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo horario para un servicio' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiResponse({
    status: 201,
    description: 'Horarios creados',
    type: [ScheduleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  async create(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto[]> {
    const schedules = await this.createScheduleUseCase.execute(
      serviceId,
      createScheduleDto,
    );
    return plainToInstance(ScheduleResponseDto, schedules);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios de un servicio' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios',
    type: [ScheduleResponseDto],
  })
  async findAll(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<ScheduleResponseDto[]> {
    const schedules =
      await this.getSchedulesByServiceUseCase.execute(serviceId);
    return plainToInstance(ScheduleResponseDto, schedules);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un horario específico' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario encontrado',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  async findOne(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.getScheduleByIdUseCase.execute(serviceId, id);
    return plainToInstance(ScheduleResponseDto, schedule);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un horario' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario actualizado',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  async update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.updateScheduleUseCase.execute(
      serviceId,
      id,
      updateScheduleDto,
    );
    return plainToInstance(ScheduleResponseDto, schedule);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de un horario' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({ status: 400, description: 'Transición de estado no permitida' })
  async updateStatus(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateScheduleStatusDto,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.updateScheduleStatusUseCase.execute(
      serviceId,
      id,
      updateStatusDto.status,
    );
    return plainToInstance(ScheduleResponseDto, schedule);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({ status: 204, description: 'Horario eliminado' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar horario con reservas activas',
  })
  async remove(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteScheduleUseCase.execute(serviceId, id);
  }
}
