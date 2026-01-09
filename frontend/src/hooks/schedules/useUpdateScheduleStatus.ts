import { useState } from "react";
import { mutate } from "swr";
import { schedulesService } from "@/services/schedules.service";
import { toast } from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface UpdateScheduleStatusParams {
  serviceId: number;
  scheduleId: number;
  status: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateScheduleStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async ({
    serviceId,
    scheduleId,
    status,
    onSuccess,
    onError,
  }: UpdateScheduleStatusParams) => {
    setIsUpdating(true);
    try {
      await schedulesService.updateStatus(serviceId, scheduleId, status);

      // Revalidate schedules for this service
      mutate(`/services/${serviceId}/schedules`);

      toast.success("Estado del horario actualizado exitosamente");
      onSuccess?.();
    } catch (error) {
      handleMutationError(
        error,
        "Error actualizando el estado del horario",
        onError
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus,
    isUpdating,
  };
}
