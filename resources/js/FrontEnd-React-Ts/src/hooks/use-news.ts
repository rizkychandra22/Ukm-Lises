import { useQuery } from "@tanstack/react-query";
import { getNews, getNewsDetail, News } from "@/lib/api/news";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

function parseErrorMessage(error: AxiosError<ApiErrorResponse> | null): string {
  if (!error) return "";
  if (error.response) {
    return (
      error.response.data?.message || "Terjadi kesalahan saat mengambil data berita dari server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

export function useNews() {
  const query = useQuery<News[], AxiosError<ApiErrorResponse>>({
    queryKey: ["news"],
    queryFn: getNews,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 5,
  });

  return {
    ...query,
    news: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useNewsDetail(slug: string) {
  const query = useQuery<News | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["news", slug],
    queryFn: () => getNewsDetail(slug),
    enabled: Boolean(slug),
    retry: 5,
  });

  return {
    ...query,
    newsDetail: query.data ?? null,
    errorMessage: parseErrorMessage(query.error),
  };
}
