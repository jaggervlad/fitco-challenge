import { useState } from "react";
import { schedulesService } from "@/services/schedules.service";
import { UpdateScheduleDto } from "@/types/schedule.types";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface UpdateScheduleParams {
  serviceId: number;
  scheduleId: number;
  data: UpdateScheduleDto;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useUpdateSchedule() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSchedule = async ({
    serviceId,
    scheduleId,
    data,
    onSuccess,
    onError,
  }: UpdateScheduleParams): Promise<void> => {
    try {
      setIsUpdating(true);

      await schedulesService.update(serviceId, scheduleId, data);

      // Revalidar el caché
      mutate(`/services/${serviceId}/schedules`);
      mutate(`/services/${serviceId}/schedules/${scheduleId}`);

      toast.success("Horario actualizado exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al actualizar el horario", onError);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateSchedule,
    isUpdating,
  };
}
