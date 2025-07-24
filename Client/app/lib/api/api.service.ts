import ApiClient from './api.client';

const client = ApiClient.getInstance();

export const ApiService = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const res = await client.get<T>(url, config);
    return res.data;
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await client.post<T>(url, data, config);
    return res.data;
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await client.put<T>(url, data, config);
    return res.data;
  },
  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const res = await client.patch<T>(url, data, config);
    return res.data;
  },
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const res = await client.delete<T>(url, config);
    return res.data;
  },
  uploadFile: async <T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: any
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      },
    });

    return res.data;
  },
};
