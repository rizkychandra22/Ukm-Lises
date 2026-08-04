import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPaymentAccounts,
  generateOrderCode,
  trackOrder,
  submitOrder,
  PayAccount,
} from "@/lib/api/order";
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
      "Terjadi kesalahan pada transaksi order di server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}

export function usePaymentAccounts() {
  const query = useQuery<PayAccount[], AxiosError<ApiErrorResponse>>({
    queryKey: ["payment-accounts"],
    queryFn: getPaymentAccounts,
    retry: 2,
  });

  return {
    ...query,
    paymentAccounts: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useGenerateOrderCode() {
  const query = useQuery<string | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["order-code-generator"],
    queryFn: generateOrderCode,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    ...query,
    orderCode: query.data ?? null,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useTrackOrder(orderCode: string) {
  const query = useQuery<any | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["track-order", orderCode],
    queryFn: () => trackOrder(orderCode),
    enabled: Boolean(orderCode), 
    retry: 3,
  });

  return {
    ...query,
    orderData: query.data ?? null,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useSubmitOrder() {
  const mutation = useMutation<
    { success: boolean; message: string; order?: any },
    AxiosError<ApiErrorResponse>,
    FormData
  >({
    mutationFn: (formData: FormData) => submitOrder(formData),
  });

  return {
    ...mutation,
    submitOrderAsync: mutation.mutateAsync,
    errorMessage: parseErrorMessage(mutation.error),
  };
}