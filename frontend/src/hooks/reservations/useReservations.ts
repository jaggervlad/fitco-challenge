import useSWR from "swr";
import { Reservation } from "@/types";
import { reservationsService } from "@/services";

export function useReservations(userId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Reservation[]>(
    userId ? `/users/${userId}/reservations` : null,
    () => reservationsService.getAll({ clientId: userId?.toString() })
  );

  return {
    reservations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
