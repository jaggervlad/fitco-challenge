export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  ATTENDED = "attended",
  NO_SHOW = "no_show",
}

interface Provider {
  id: number;
  name: string;
  email: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  createdAt: string;
  provider?: Provider;
}

interface Schedule {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  reservationCounts: number;
}

export interface Reservation {
  id: number;
  serviceId: number;
  scheduleId: number;
  customerId: number;
  status: ReservationStatus;
  notes: string;
  service?: Service;
  schedule?: Schedule;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  serviceId: number;
  scheduleId: number;
  customerId: number;
  notes?: string;
}
