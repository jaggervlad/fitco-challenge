import { Schedule } from 'src/schedules/domain/entities/schedule.entity';
import { Service } from 'src/services/domain/entities/service.entity';
import { User } from 'src/users/domain/entities/user.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
  NO_SHOW = 'no_show',
}

export type ReservationData = {
  id: number;
  serviceId: number;
  scheduleId: number;
  customerId: number;
  status: ReservationStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateReservationData = Omit<
  ReservationData,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateReservationData = Partial<
  Omit<CreateReservationData, 'serviceId' | 'scheduleId' | 'customerId'>
>;

export class Reservation {
  constructor(
    public readonly id: number,
    public readonly serviceId: number,
    public readonly scheduleId: number,
    public readonly customerId: number,
    public readonly status: ReservationStatus,
    public readonly notes: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly service?: Service,
    public readonly schedule?: Schedule,
    public readonly customer?: User,
  ) {}

  // Factory method: Crear desde objeto plano
  static from(data: ReservationData): Reservation {
    return new Reservation(
      data.id,
      data.serviceId,
      data.scheduleId,
      data.customerId,
      data.status,
      data.notes,
      data.createdAt,
      data.updatedAt,
    );
  }

  static create(data: CreateReservationData): Reservation {
    const now = new Date();
    return new Reservation(
      0,
      data.serviceId,
      data.scheduleId,
      data.customerId,
      data.status,
      data.notes,
      now,
      now,
    );
  }

  static build(partial: Partial<ReservationData>): Reservation {
    const now = new Date();
    return new Reservation(
      partial.id ?? 0,
      partial.serviceId ?? 0,
      partial.scheduleId ?? 0,
      partial.customerId ?? 0,
      partial.status ?? ReservationStatus.PENDING,
      partial.notes ?? '',
      partial.createdAt ?? now,
      partial.updatedAt ?? now,
    );
  }

  clone(updates?: UpdateReservationData): Reservation {
    return new Reservation(
      this.id,
      this.serviceId,
      this.scheduleId,
      this.customerId,
      updates?.status ?? this.status,
      updates?.notes ?? this.notes,
      this.createdAt,
      new Date(),
    );
  }

  toJSON(): ReservationData {
    return {
      id: this.id,
      serviceId: this.serviceId,
      scheduleId: this.scheduleId,
      customerId: this.customerId,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isPending(): boolean {
    return this.status === ReservationStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === ReservationStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.status === ReservationStatus.CANCELLED;
  }

  isAttended(): boolean {
    return this.status === ReservationStatus.ATTENDED;
  }

  isNoShow(): boolean {
    return this.status === ReservationStatus.NO_SHOW;
  }

  isValid(): boolean {
    return this.serviceId > 0 && this.scheduleId > 0 && this.customerId > 0;
  }
}
