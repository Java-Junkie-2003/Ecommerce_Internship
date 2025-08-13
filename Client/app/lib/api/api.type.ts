import type { InternalAxiosRequestConfig } from "axios";

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  metadata?: {
    startTime: Date;
  };
}