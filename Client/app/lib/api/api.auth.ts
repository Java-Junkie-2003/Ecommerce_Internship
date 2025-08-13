
import axios from 'axios';
import { ENDPOINTS } from '@/utils/api.endpoints';
import { getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from '@/utils/token';
import { AuthenticationError } from '@/lib/api/api.errors';

interface RefreshTokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export async function refreshToken(): Promise<string> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new AuthenticationError("No refresh token");

    const baseURL = process.env.VITE_PUBLIC_API_URL;

    const response = await axios.post<RefreshTokenResponse>(
      `${baseURL}${ENDPOINTS.AUTH.REFRESH}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token, refresh_token } = response.data.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return access_token;
  } catch (err) {
    clearTokens();
    throw new AuthenticationError("Token refresh failed");
  }
}
