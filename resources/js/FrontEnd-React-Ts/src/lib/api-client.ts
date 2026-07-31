import axios, { type AxiosError } from 'axios';

/**
 * Dynamic Base URL Resolver
 */
function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;

    if (host === 'lises-asmarandana.laravel.cloud') {
      return import.meta.env.VITE_API_BASE_URL_PRD;
    }

    if (host === 'lises-asmarandana-dev.laravel.cloud') {
      return import.meta.env.VITE_API_BASE_URL_DEV;
    }

    return `${window.location.origin}/api`;
  }

  // Fallback otomatis localhost
  return 'http://localhost:8000/api';
}

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Axios Instance Public Pure SPA Landing Page
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Response Interceptor
 */
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