import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { attachInterceptors } from '~/lib/api/api.interceptors';

const API_CONFIG = {
  TIMEOUT: 30000,
} as const;

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  metadata?: {
    startTime: Date;
  };
}

class ApiClient {
  private static instance: AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      if (!baseURL) throw new Error('API base URL is not set');

      this.instance = axios.create({
        baseURL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      attachInterceptors(this.instance);
    }

    return this.instance;
  }
}

export default ApiClient;
