import useSWR from "swr";
import { Reservation } from "@/types";
import { reservationsService } from "@/services/reservations.service";

export function useProviderReservations(providerId?: number) {
  const { data, error, isLoading, mutate } = useSWR<Reservation[]>(
    providerId ? `/providers/${providerId}/reservations` : null,
    () => reservationsService.getByProviderId(providerId!.toString())
  );

  return {
    reservations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
