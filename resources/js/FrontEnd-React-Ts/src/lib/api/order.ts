import apiClient from '../api-client';

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
  try {
    const response = await apiClient.get('/payment-accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment accounts:', error);
    return [];
  }
};

export const generateOrderCode = async (): Promise<string | null> => {
  try {
    const response = await apiClient.get('/generate-order-code');
    return response.data.order_code;
  } catch (error) {
    console.error('Error generating order code:', error);
    return null;
  }
};

export const submitOrder = async (formData: FormData): Promise<{ success: boolean; message: string; order?: any }> => {
  try {
    const response = await apiClient.post('/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, message: response.data.message, order: response.data.order };
  } catch (error: any) {
    console.error('Error submitting order:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan tiket.' 
    };
  }
};

export const trackOrder = async (orderCode: string): Promise<any | null> => {
  try {
    const response = await apiClient.get(`/orders/track/${orderCode}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking order:', error);
    return null;
  }
};
