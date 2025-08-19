
import axios from 'axios';
import { ENDPOINTS } from '@/utils/api.endpoints';
import { getRefreshToken, setAccessToken, setRefreshToken, clearTokens, getUserId } from '@/utils/token';
import { AuthenticationError } from '@/lib/api/api.errors';

interface RefreshTokenResponse {
  metadata: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export async function refreshToken(): Promise<string> {
  try {
    const refreshTokenValue = getRefreshToken();
    const userId = getUserId();
    
    if (!refreshTokenValue) throw new AuthenticationError("No refresh token");
    if (!userId) throw new AuthenticationError("No user ID");

    const baseURL = import.meta.env.VITE_PUBLIC_API_URL;

    // Your server expects refresh token endpoint to be POST /auth/refreshtoken
    const response = await axios.post<RefreshTokenResponse>(
      `${baseURL}/auth/refreshtoken`, // Match your server endpoint
      {},
      {
        headers: {
          "refresh-token": refreshTokenValue, // Your server expects this header
          "x-client-id": userId, // Use stored user ID
          "Content-Type": "application/json",
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.metadata.tokens;
    setAccessToken(accessToken);
    setRefreshToken(newRefreshToken);
    return accessToken;
  } catch (err) {
    clearTokens();
    throw new AuthenticationError("Token refresh failed");
  }
}
