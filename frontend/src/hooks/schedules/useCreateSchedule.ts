import { useState } from "react";
import { schedulesService } from "@/services/schedules.service";
import { CreateScheduleDto } from "@/types/schedule.types";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface CreateScheduleParams {
  serviceId: number;
  data: CreateScheduleDto;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCreateSchedule() {
  const [isCreating, setIsCreating] = useState(false);

  const createSchedule = async ({
    serviceId,
    data,
    onSuccess,
    onError,
  }: CreateScheduleParams): Promise<void> => {
    try {
      setIsCreating(true);

      await schedulesService.create(serviceId, data);

      mutate(`/services/${serviceId}/schedules`);

      toast.success("Horario creado exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al crear el horario", onError);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createSchedule,
    isCreating,
  };
}
