import { ITokenInfo, RefreshTokenResponse } from "@/types/dto/login.dto";
import { ApiService } from "./api.service";
import {
  setAccessToken,
  setRefreshToken,
  setUserId,
  clearTokens,
  getRefreshToken,
} from "@/utils/token";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  metadata: {
    user: {
      _id: string; // MongoDB ObjectId
      userId?: string; // Alternative user ID field
      username: string;
      roles: string[];
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

interface LogoutResponse {
  message: string;
}

/**
 * Login function that handles authentication and token storage
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse["metadata"]> => {
  try {
    // Clear any existing tokens first
    clearTokens();

    const response = await ApiService.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    const { user, tokens } = response.metadata;

    // Store tokens and user ID in cookies
    // Use _id (MongoDB ObjectId) if available, otherwise fall back to userId
    const userIdToStore = user._id || user.userId;
    if (!userIdToStore) {
      throw new Error("No valid user ID received from server");
    }

    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUserId(userIdToStore);

    // call introspect token to check access token is expired or not
    const tokenInfo: ITokenInfo = await ApiService.get(
      "/auth/introspect-token"
    );
    if (!tokenInfo.metadata?.is_valid || tokenInfo.code === 401) {
        // Call refresh token api
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const newTokens: RefreshTokenResponse = await ApiService.post("/auth/refreshtoken", 
          {}, // Empty body since server expects headers
          {
            headers: {
              "refresh-token": refreshToken,
              "x-client-id": userIdToStore
            }
          }
        );

        if (newTokens.metadata?.tokens.accessToken && newTokens.metadata?.tokens.refreshToken) {
          setAccessToken(newTokens.metadata.tokens.accessToken);
          setRefreshToken(newTokens.metadata.tokens.refreshToken);
        } else {
          throw new Error("Invalid tokens received from refresh token API");
        }
    }

    return response.metadata;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

/**
 * Logout function that clears tokens and calls logout endpoint
 */
export const logout = async (): Promise<void> => {
  try {
    console.log("Starting logout process...");

    // Call logout endpoint (this will use interceptors to add auth headers)
    await ApiService.get<LogoutResponse>("/auth/logout");
    console.log("Logout API call successful");

    // Only clear tokens if the API call was successful
    clearTokens();
    console.log("Local tokens cleared after successful logout");
  } catch (error: any) {
    // Log the specific error for debugging
    console.error("Logout API call failed:", error);

    // Check if it's a user ID format error
    if (
      error?.message?.includes("24 character hex string") ||
      error?.message?.includes("ObjectId") ||
      error?.status === 500
    ) {
      console.warn(
        "Logout failed due to server error - keeping user logged in locally"
      );
    }

    // Throw the error so the calling component knows the logout failed
    throw error;
  }
};
