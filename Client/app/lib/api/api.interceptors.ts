import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { ExtendedAxiosRequestConfig } from '~/lib/api/api.client';
import { getAccessToken } from '~/utils/token';
import { refreshToken } from '~/lib/api/api.auth';
import { ApiError, AuthenticationError, NetworkError, TimeoutError } from './api.errors';

export function attachInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.metadata = { startTime: new Date() };
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ExtendedAxiosRequestConfig;
      if (config.metadata?.startTime) {
        const duration = new Date().getTime() - config.metadata.startTime.getTime();
        console.debug(`[API] ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`);
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      // Token refresh logic
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } catch (err) {
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          throw err;
        }
      }

      // Error transformation
      if (!error.response) {
        if (error.code === 'ECONNABORTED') throw new TimeoutError();
        throw new NetworkError();
      }

      const { status, data } = error.response;
      const message = (data as any)?.message || `HTTP ${status}`;
      throw new ApiError(message, status);
    }
  );
}
