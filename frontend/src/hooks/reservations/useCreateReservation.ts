import { useState } from "react";
import { reservationsService } from "@/services";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface CreateReservationParams {
  serviceId: number;
  scheduleId: number;
  customerId: number;
  notes?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCreateReservation() {
  const [isCreating, setIsCreating] = useState(false);

  const createReservation = async ({
    serviceId,
    scheduleId,
    customerId,
    notes,
    onSuccess,
    onError,
  }: CreateReservationParams): Promise<void> => {
    try {
      setIsCreating(true);

      await reservationsService.create({
        serviceId,
        scheduleId,
        customerId,
        notes,
      });

      mutate(`/users/${customerId}/reservations`);

      toast.success("Reserva creada exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al crear la reserva", onError);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createReservation,
    isCreating,
  };
}
