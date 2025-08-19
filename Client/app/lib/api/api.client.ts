
import axios, { type AxiosInstance, type AxiosError } from "axios";
import { attachInterceptors } from './api.interceptors';

const API_CONFIG = { TIMEOUT: 30000 } as const;

class ApiClient {
  private static instance: AxiosInstance | null = null;

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
      if (!baseURL) {
        throw new Error('API base URL is not set');
      }

      const instance = axios.create({
        baseURL,
        timeout: API_CONFIG.TIMEOUT,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });

      // Attach interceptors for token management
      attachInterceptors(instance);

      ApiClient.instance = instance;
      console.log('API Client initialized with interceptors');
    }

    return ApiClient.instance!;
  }

  // Method to clear the instance (useful for logout)
  public static clearInstance(): void {
    ApiClient.instance = null;
  }
}

export default ApiClient;
