import axios, { type AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'lises.laravel.cloud') {
      return import.meta.env.VITE_API_BASE_URL_PRD;
    }
    if (host === 'lises-dev.laravel.cloud') {
      return import.meta.env.VITE_API_BASE_URL_DEV;
    }
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:8000/api';
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosRetry(apiClient, {
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED' ||
      (error.response?.status ? error.response.status >= 500 : false)
    );
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const data = error.response.data as { message?: string; msg?: string };
      const serverMessage = data.message || data.msg;
      if (serverMessage) {
        error.message = serverMessage;
      }
    }

    const classified = error as AxiosError & { _classified?: string };
    const status = error.response?.status;

    if (!error.response && error.message === 'Network Error') {
      classified._classified = 'network';
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      classified._classified = 'timeout';
    } else if (status && status >= 500) {
      classified._classified = 'server_error';
    }

    return Promise.reject(classified);
  }
);

export default apiClient;