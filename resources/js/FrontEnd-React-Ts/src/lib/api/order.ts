import apiClient from "../api-client";

export interface PayAccount {
  id: number;
  batch_member_id: number;
  type: string;
  no_account: string;
  name_account: string;
  batch_member?: {
    id: number;
    name: string;
  };
}

export const getPaymentAccounts = async (): Promise<PayAccount[]> => {
  const response = await apiClient.get("/payment-accounts");
  return response.data;
};

export const generateOrderCode = async (): Promise<string | null> => {
  const response = await apiClient.get("/generate-order-code");
  return response.data.order_code;
};

export const submitOrder = async (
  formData: FormData,
): Promise<{ success: boolean; message: string; order?: any }> => {
  const response = await apiClient.post("/orders", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return { success: true, message: response.data.message, order: response.data.order };
};

export const trackOrder = async (orderCode: string): Promise<any | null> => {
  const response = await apiClient.get(`/orders/track/${orderCode}`);
  return response.data;
};
