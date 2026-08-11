import { useQuery } from "@tanstack/react-query";
import {
  getMembers,
  getBatches,
  getCategorizedMembers,
  Member,
  Batch,
  QueryMemberParams,
} from "@/lib/api/member";
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
      "Terjadi kesalahan saat mengambil data anggota dari server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

export function useMembers(params?: QueryMemberParams) {
  const query = useQuery<Member[], AxiosError<ApiErrorResponse>>({
    queryKey: ["members", params],
    queryFn: () => getMembers(params),
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 5,
  });

  return {
    ...query,
    members: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useBatches() {
  const query = useQuery<Batch[], AxiosError<ApiErrorResponse>>({
    queryKey: ["batches"],
    queryFn: getBatches,
    refetchInterval: 60000,
    retry: 5,
  });

  return {
    ...query,
    batches: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useCategorizedMembers() {
  const query = useQuery<
    { administration: Member[]; demisioner: Member[] },
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["members-categorized"],
    queryFn: getCategorizedMembers,
    refetchInterval: 60000,
    retry: 5,
  });

  return {
    ...query,
    administration: query.data?.administration ?? [],
    demisioner: query.data?.demisioner ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}