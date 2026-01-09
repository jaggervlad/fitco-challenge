export interface Schedule {
  id: number;
  serviceId: number;
  dayOfWeek: number;
  dayOfWeekName: string;
  startTime: string;
  endTime: string;
  capacity: number;
  reservationCounts: number;
  status: string;
  isFull: boolean;
  availableSlots: number;
  hasReservation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface CreateScheduleDto {
  schedules: ScheduleItem[];
}

export type UpdateScheduleDto = Partial<ScheduleItem & { status?: string }>;
