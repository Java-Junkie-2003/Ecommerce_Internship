import { clearTokens, getAccessToken } from '@/utils/token';
import ApiClient from '@/lib/api/api.client';

/**
 * Logout utility function that clears tokens and API client instance
 */
export const logout = (): void => {
  // Clear all authentication tokens
  clearTokens();
  
  // Clear the API client instance to remove any cached headers
  ApiClient.clearInstance();
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Check if user is authenticated by verifying token existence
 */
export const isAuthenticated = (): boolean => {
  try {
    return !!getAccessToken();
  } catch {
    return false;
  }
};
