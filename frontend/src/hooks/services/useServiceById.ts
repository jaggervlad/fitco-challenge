import useSWR from "swr";
import { Service } from "@/types";
import { servicesService } from "@/services";

interface UseServiceByIdOptions {
  serviceId: number;
}

export function useServiceById({ serviceId }: UseServiceByIdOptions) {
  const {
    data: service,
    error,
    isLoading,
    mutate,
  } = useSWR<Service>(serviceId ? `/services/${serviceId}` : null, () =>
    servicesService.getByServiceId(serviceId)
  );

  return {
    service,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
