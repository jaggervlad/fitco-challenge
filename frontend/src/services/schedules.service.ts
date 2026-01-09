import api from "./api";
import {
  Schedule,
  CreateScheduleDto,
  UpdateScheduleDto,
} from "@/types/schedule.types";

export const schedulesService = {
  getAll: async (serviceId: number): Promise<Schedule[]> => {
    const { data } = await api.get(`/services/${serviceId}/schedules`);
    return data;
  },

  getById: async (serviceId: number, scheduleId: number): Promise<Schedule> => {
    const { data } = await api.get(
      `/services/${serviceId}/schedules/${scheduleId}`
    );
    return data;
  },

  create: async (
    serviceId: number,
    scheduleData: CreateScheduleDto
  ): Promise<Schedule> => {
    const { data } = await api.post(
      `/services/${serviceId}/schedules`,
      scheduleData
    );
    return data;
  },

  update: async (
    serviceId: number,
    scheduleId: number,
    scheduleData: UpdateScheduleDto
  ): Promise<Schedule> => {
    const { data } = await api.put(
      `/services/${serviceId}/schedules/${scheduleId}`,
      scheduleData
    );
    return data;
  },

  delete: async (serviceId: number, scheduleId: number): Promise<void> => {
    await api.delete(`/services/${serviceId}/schedules/${scheduleId}`);
  },

  updateStatus: async (
    serviceId: number,
    scheduleId: number,
    status: string
  ): Promise<Schedule> => {
    const { data } = await api.patch(
      `/services/${serviceId}/schedules/${scheduleId}/status`,
      { status }
    );
    return data;
  },
};
