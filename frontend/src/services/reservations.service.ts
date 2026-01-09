import api from "./api";
import { Reservation, CreateReservationData } from "@/types";

export const reservationsService = {
  /**
   * Get all reservations
   */
  async getAll(params?: { clientId?: string }): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>(
      `users/${params?.clientId}/reservations`
    );
    return data;
  },

  /**
   * Get reservation by ID
   */
  async getById(id: string): Promise<Reservation> {
    const { data } = await api.get<Reservation>(`/reservations/${id}`);
    return data;
  },

  /**
   * Create new reservation
   */
  async create(reservationData: CreateReservationData): Promise<Reservation> {
    const { data } = await api.post<Reservation>(
      "/reservations",
      reservationData
    );
    return data;
  },

  /**
   * Cancel reservation
   */
  async cancel(id: string): Promise<Reservation> {
    const { data } = await api.post<Reservation>(`/reservations/${id}/cancel`);
    return data;
  },

  /**
   * Get my reservations (as client)
   */
  async getMyReservations(): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>("/reservations/my");
    return data;
  },

  /**
   * Get reservations by schedule
   */
  async getBySchedule(scheduleId: string): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>(
      `/reservations/schedule/${scheduleId}`
    );
    return data;
  },

  /**
   * Get reservations by provider ID
   */
  async getByProviderId(providerId: string): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>(
      `providers/${providerId}/reservations`
    );
    return data;
  },

  /**
   * Update reservation status
   */
  async updateStatus(id: string, status: string): Promise<Reservation> {
    const { data } = await api.patch<Reservation>(
      `/reservations/${id}/status`,
      { status }
    );
    return data;
  },
};
