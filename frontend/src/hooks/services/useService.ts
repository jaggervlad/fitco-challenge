import useSWR from "swr";
import { Service } from "@/types";
import { servicesService } from "@/services";

interface UseServiceOptions {
  providerId: number;
  serviceId: number;
}

export function useService({ providerId, serviceId }: UseServiceOptions) {
  const {
    data: service,
    error,
    isLoading,
    mutate,
  } = useSWR<Service>(`/providers/${providerId}/services/${serviceId}`, () =>
    servicesService.getById(providerId, serviceId)
  );

  return {
    service,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
