import { useState, useEffect } from 'react';
import { getAccessToken, clearTokens } from '@/utils/token';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

/**
 * Authentication hook for SPA mode
 */
export const useAuth = (): AuthState & {
  logout: () => Promise<void>;
  refresh: () => void;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getAccessToken();
        setAuthState({
          isAuthenticated: !!token,
          isLoading: false,
          token,
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      // Try to call the API logout function
      const { logout: apiLogout } = await import('@/lib/api/api.login');
      await apiLogout();
      
      // Only clear local state if API call succeeded
      clearTokens();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed in useAuth hook:', error);
      // Don't clear tokens if logout failed
      throw error;
    }
  };

  const refresh = () => {
    const token = getAccessToken();
    setAuthState({
      isAuthenticated: !!token,
      isLoading: false,
      token,
    });
  };

  return {
    ...authState,
    logout,
    refresh,
  };
};
