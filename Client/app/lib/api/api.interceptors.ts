"use client"

import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getUserId } from '@/utils/token';
import { refreshToken } from '@/lib/api/api.auth';
import { ApiError, NetworkError, TimeoutError, AuthenticationError } from './api.errors';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  metadata?: {
    startTime: Date;
  };
}

export function attachInterceptors(instance: AxiosInstance): void {
  // Request interceptor to add access token
  instance.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig) => {
      // Add access token and user ID to request headers
      const token = getAccessToken();
      const userId = getUserId();
      
      if (token && config.headers) {
        // Your server expects raw token in 'authorization' header (no Bearer prefix)
        config.headers.authorization = token;
      }
      
      if (userId && config.headers) {
        // Your server expects user ID in 'x-client-id' header
        config.headers['x-client-id'] = userId;
        console.debug(`[API Request] Setting x-client-id: ${userId}`);
      }

      // Add metadata for request timing
      config.metadata = { startTime: new Date() };
      
      console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh and errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ExtendedAxiosRequestConfig;
      
      // Log response timing
      if (config.metadata?.startTime) {
        const duration = new Date().getTime() - config.metadata.startTime.getTime();
        console.debug(`[API Response] ${config.method?.toUpperCase()} ${config.url} - ${response.status} - ${duration}ms`);
      }
      
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      // Handle 401 Unauthorized - Token refresh logic
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          console.debug('[API] Attempting token refresh...');
          const newToken = await refreshToken();
          
          // Update the authorization header with new token (no Bearer prefix)
          if (originalRequest.headers) {
            originalRequest.headers.authorization = newToken;
          }
          
          console.debug('[API] Token refreshed successfully, retrying request...');
          // Retry the original request with new token
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          
          throw new AuthenticationError('Session expired. Please login again.');
        }
      }

      // Handle other HTTP errors
      if (error.response) {
        const { status, data } = error.response;
        console.error(`[API Error] ${status}:`, data);
        
        // Extract error message from response
        const message = (data as any)?.message || 
                       (data as any)?.error || 
                       `HTTP ${status} Error`;
        
        // Handle specific status codes
        switch (status) {
          case 400:
            throw new ApiError(`Bad Request: ${message}`, status);
          case 403:
            throw new ApiError(`Forbidden: ${message}`, status);
          case 404:
            throw new ApiError(`Not Found: ${message}`, status);
          case 409:
            throw new ApiError(`Conflict: ${message}`, status);
          case 422:
            throw new ApiError(`Validation Error: ${message}`, status);
          case 500:
            throw new ApiError(`Server Error: ${message}`, status);
          default:
            throw new ApiError(message, status);
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('[API Network Error]:', error.message);
        
        if (error.code === 'ECONNABORTED') {
          throw new TimeoutError('Request timeout. Please try again.');
        }
        
        if (error.code === 'ERR_NETWORK') {
          throw new NetworkError('Network error. Please check your connection.');
        }
        
        throw new NetworkError('Network error occurred.');
      }

      // Fallback error
      throw new ApiError('An unexpected error occurred.', 500);
    }
  );
}
