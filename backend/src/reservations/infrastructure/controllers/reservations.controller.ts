import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { CancelReservationUseCase } from '../../application/use-cases/cancel-reservation.use-case';
import { GetReservationsByUserUseCase } from '../../application/use-cases/get-reservations-by-user.use-case';
import { GetReservationsByProviderUseCase } from '../../application/use-cases/get-reservations-by-provider.use-case';
import { UpdateReservationStatusUseCase } from '../../application/use-cases/update-reservation-status.use-case';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';
import { UpdateReservationStatusDto } from '../../application/dto/update-reservation-status.dto';
import { ReservationResponseDto } from '../../application/dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Reservations')
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly getReservationsByUserUseCase: GetReservationsByUserUseCase,
    private readonly getReservationsByProviderUseCase: GetReservationsByProviderUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Post('reservations')
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario o horario no encontrado' })
  @ApiResponse({ status: 409, description: 'Horario sin disponibilidad' })
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const reservation =
      await this.createReservationUseCase.execute(createReservationDto);
    return plainToInstance(ReservationResponseDto, reservation);
  }

  @Post('reservations/:id/cancel')
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @ApiResponse({ status: 400, description: 'Reserva ya cancelada' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.cancelReservationUseCase.execute(id);
    return plainToInstance(ReservationResponseDto, reservation);
  }

  @Patch('reservations/:id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Transición de estado no permitida',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateReservationStatusDto,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.updateReservationStatusUseCase.execute(
      id,
      updateStatusDto.status,
    );
    return plainToInstance(ReservationResponseDto, reservation);
  }

  @Get('users/:userId/reservations')
  @ApiOperation({ summary: 'Obtener todas las reservas de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas',
    type: [ReservationResponseDto],
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ReservationResponseDto[]> {
    const reservations =
      await this.getReservationsByUserUseCase.execute(userId);
    return plainToInstance(ReservationResponseDto, reservations);
  }

  @Get('providers/:providerId/reservations')
  @ApiOperation({
    summary: 'Obtener todas las reservas de los servicios de un provider',
  })
  @ApiParam({ name: 'providerId', description: 'ID del provider' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas del provider',
    type: [ReservationResponseDto],
  })
  async findByProvider(
    @Param('providerId', ParseIntPipe) providerId: number,
  ): Promise<ReservationResponseDto[]> {
    const reservations =
      await this.getReservationsByProviderUseCase.execute(providerId);
    return plainToInstance(ReservationResponseDto, reservations);
  }
}
