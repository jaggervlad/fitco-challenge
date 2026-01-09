export enum ScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
}

export type ScheduleData = {
  id: number;
  serviceId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  reservationCounts: number;
  status: ScheduleStatus;
  isFull: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateScheduleData = Omit<
  ScheduleData,
  'id' | 'reservationCounts' | 'isFull' | 'createdAt' | 'updatedAt'
>;

export type UpdateScheduleData = Partial<Omit<CreateScheduleData, 'serviceId'>>;

export class Schedule {
  constructor(
    public readonly id: number,
    public readonly serviceId: number,
    public readonly dayOfWeek: number,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly capacity: number,
    public readonly reservationCounts: number,
    public readonly status: ScheduleStatus,
    public readonly isFull: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method: Crear desde objeto plano
  static from(data: ScheduleData): Schedule {
    return new Schedule(
      data.id,
      data.serviceId,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.capacity,
      data.reservationCounts,
      data.status,
      data.isFull,
      data.createdAt,
      data.updatedAt,
    );
  }

  static create(data: CreateScheduleData): Schedule {
    const now = new Date();
    return new Schedule(
      0,
      data.serviceId,
      data.dayOfWeek,
      data.startTime,
      data.endTime,
      data.capacity,
      0, // reservationCounts inicial
      data.status,
      false, // isFull inicial
      now,
      now,
    );
  }

  static build(partial: Partial<ScheduleData>): Schedule {
    const now = new Date();
    return new Schedule(
      partial.id ?? 0,
      partial.serviceId ?? 0,
      partial.dayOfWeek ?? 0,
      partial.startTime ?? '00:00',
      partial.endTime ?? '00:00',
      partial.capacity ?? 0,
      partial.reservationCounts ?? 0,
      partial.status ?? ScheduleStatus.ACTIVE,
      partial.isFull ?? false,
      partial.createdAt ?? now,
      partial.updatedAt ?? now,
    );
  }

  clone(updates?: UpdateScheduleData): Schedule {
    return new Schedule(
      this.id,
      this.serviceId,
      updates?.dayOfWeek ?? this.dayOfWeek,
      updates?.startTime ?? this.startTime,
      updates?.endTime ?? this.endTime,
      updates?.capacity ?? this.capacity,
      this.reservationCounts,
      updates?.status ?? this.status,
      this.isFull,
      this.createdAt,
      new Date(),
    );
  }

  toJSON(): ScheduleData {
    return {
      id: this.id,
      serviceId: this.serviceId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
      capacity: this.capacity,
      reservationCounts: this.reservationCounts,
      status: this.status,
      isFull: this.isFull,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isAvailable(): boolean {
    return this.status === ScheduleStatus.ACTIVE && !this.isFull;
  }

  isValid(): boolean {
    return (
      this.serviceId > 0 &&
      this.dayOfWeek >= 0 &&
      this.dayOfWeek <= 6 &&
      this.startTime.length > 0 &&
      this.endTime.length > 0 &&
      this.capacity > 0
    );
  }
}
