import { useState } from "react";
import { servicesService } from "@/services";
import { CreateServiceDto } from "@/types";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { handleMutationError } from "@/utils";

interface CreateServiceParams {
  providerId: number;
  data: CreateServiceDto;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCreateService() {
  const [isCreating, setIsCreating] = useState(false);

  const createService = async ({
    providerId,
    data,
    onSuccess,
    onError,
  }: CreateServiceParams): Promise<void> => {
    try {
      setIsCreating(true);

      await servicesService.create(providerId, data);

      mutate(`/providers/${providerId}/services`);

      toast.success("Servicio creado exitosamente");
      onSuccess?.();
    } catch (err: any) {
      handleMutationError(err, "Error al crear el servicio", onError);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createService,
    isCreating,
  };
}
