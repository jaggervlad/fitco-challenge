import useSWR from "swr";
import { schedulesService } from "@/services/schedules.service";
import { Schedule } from "@/types/schedule.types";
import toast from "react-hot-toast";

interface UseSchedulesParams {
  serviceId: number;
}

export function useSchedules({ serviceId }: UseSchedulesParams) {
  const { data, error, isLoading, mutate } = useSWR<Schedule[]>(
    serviceId ? `/services/${serviceId}/schedules` : null,
    () => schedulesService.getAll(serviceId)
  );

  const deleteSchedule = async (scheduleId: number) => {
    try {
      await schedulesService.delete(serviceId, scheduleId);
      mutate();
      toast.success("Horario eliminado exitosamente");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al eliminar el horario";
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    schedules: data,
    isLoading,
    isError: error,
    error,
    mutate,
    deleteSchedule,
  };
}
