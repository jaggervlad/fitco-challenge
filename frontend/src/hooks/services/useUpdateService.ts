import { useState } from "react";
import { servicesService } from "@/services";
import { UpdateServiceDto } from "@/types";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface UpdateServiceParams {
  providerId: number;
  serviceId: number;
  data: UpdateServiceDto;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useUpdateService() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateService = async ({
    providerId,
    serviceId,
    data,
    onSuccess,
    onError,
  }: UpdateServiceParams): Promise<void> => {
    try {
      setIsUpdating(true);

      await servicesService.update(providerId, serviceId, data);

      // Revalidar el caché
      mutate(`/providers/${providerId}/services`);
      mutate(`/providers/${providerId}/services/${serviceId}`);

      toast.success("Servicio actualizado exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al actualizar el servicio", onError);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateService,
    isUpdating,
  };
}
