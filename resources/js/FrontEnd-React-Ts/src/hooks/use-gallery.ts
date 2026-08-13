import { useQuery } from "@tanstack/react-query";
import { getGalleries, Gallery } from "@/lib/api/gallery";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

function parseErrorMessage(error: AxiosError<ApiErrorResponse> | null): string {
  if (!error) return "";
  if (error.response) {
    return (
      error.response.data?.message || "Terjadi kesalahan saat mengambil data gallery dari server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

export function useGallery() {
  const query = useQuery<Gallery[], AxiosError<ApiErrorResponse>>({
    queryKey: ["gallery"],
    queryFn: getGalleries,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 5,
  });

  return {
    ...query,
    galleries: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}
