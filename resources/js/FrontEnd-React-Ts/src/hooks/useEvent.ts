import { useQuery } from "@tanstack/react-query";
import { getEvents, EventItem } from "@/lib/api/event";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

function parseErrorMessage(error: AxiosError<ApiErrorResponse> | null): string {
  if (!error) return "";
  if (error.response) {
    return (
      error.response.data?.message ||
      "Terjadi kesalahan saat mengambil data event dari server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

export function useEvents() {
  const query = useQuery<EventItem[], AxiosError<ApiErrorResponse>>({
    queryKey: ["events"],
    queryFn: getEvents,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    retry: 4,
  });

  return {
    ...query,
    events: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}