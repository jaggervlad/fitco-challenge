import useSWR from "swr";
import { Service } from "@/types";
import { servicesService } from "@/services";
import { mutate as globalMutate } from "swr";
import toast from "react-hot-toast";

interface UseServicesOptions {
  providerId?: number;
}

export function useServices({ providerId }: UseServicesOptions) {
  const {
    data: services,
    error,
    isLoading,
    mutate,
  } = useSWR<Service[]>(
    providerId ? `/providers/${providerId}/services` : null,
    () => servicesService.getAll(providerId!)
  );

  const deleteService = async (serviceId: number) => {
    if (!providerId) return;

    try {
      await servicesService.delete(providerId, serviceId);
      toast.success("Servicio eliminado exitosamente");
      mutate(); // Revalidar la lista
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar el servicio";
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : "Error al eliminar el servicio"
      );
      throw error;
    }
  };

  return {
    services,
    isLoading,
    isError: !!error,
    error,
    mutate,
    deleteService,
  };
}
