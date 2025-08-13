
import axios, { type AxiosInstance, type AxiosError } from "axios";
// import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from '@/utils/token'; 

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

      ApiClient.instance = instance;
    }

    return ApiClient.instance!;
  }
}

export default ApiClient;
