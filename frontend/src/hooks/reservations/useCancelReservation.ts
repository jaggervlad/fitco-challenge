import { useState } from "react";
import { reservationsService } from "@/services";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface CancelReservationParams {
  reservationId: number;
  customerId: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCancelReservation() {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelReservation = async ({
    reservationId,
    customerId,
    onSuccess,
    onError,
  }: CancelReservationParams): Promise<void> => {
    try {
      setIsCancelling(true);

      await reservationsService.cancel(reservationId.toString());

      mutate(`/users/${customerId}/reservations`);

      toast.success("Reserva cancelada exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al cancelar la reserva", onError);
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    cancelReservation,
    isCancelling,
  };
}
