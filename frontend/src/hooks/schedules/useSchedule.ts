import useSWR from "swr";
import { schedulesService } from "@/services/schedules.service";
import { Schedule } from "@/types/schedule.types";

interface UseScheduleParams {
  serviceId: number;
  scheduleId: number;
}

export function useSchedule({ serviceId, scheduleId }: UseScheduleParams) {
  const { data, error, isLoading, mutate } = useSWR<Schedule>(
    serviceId && scheduleId
      ? `/services/${serviceId}/schedules/${scheduleId}`
      : null,
    () => schedulesService.getById(serviceId, scheduleId)
  );

  return {
    schedule: data,
    isLoading,
    isError: error,
    error,
    mutate,
  };
}
