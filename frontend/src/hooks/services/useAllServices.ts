import useSWR from "swr";
import { Service } from "@/types";
import { servicesService } from "@/services";

export function useAllServices() {
  const {
    data: services,
    error,
    isLoading,
    mutate,
  } = useSWR<Service[]>("/services", () => servicesService.getAllPublic());

  return {
    services,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
