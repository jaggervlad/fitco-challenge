import { useState } from "react";
import { mutate } from "swr";
import { reservationsService } from "@/services/reservations.service";
import { toast } from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface UpdateReservationStatusParams {
  reservationId: number;
  status: string;
  providerId: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateReservationStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async ({
    reservationId,
    status,
    providerId,
    onSuccess,
    onError,
  }: UpdateReservationStatusParams) => {
    setIsUpdating(true);
    try {
      await reservationsService.updateStatus(reservationId.toString(), status);

      // Revalidate provider reservations
      mutate(`/providers/${providerId}/reservations`);

      toast.success("Estado de reserva actualizado exitosamente");
      onSuccess?.();
    } catch (error) {
      handleMutationError(
        error,
        "Error al actualizar el estado de la reserva",
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
