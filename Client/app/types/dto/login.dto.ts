import { User } from "@/types/model/user";

export interface LoginDTO {
    username: string;
    password: string;
}

export interface LoginResponseDTO {
    message: string;
    statusCode: number;
    metadata: {
        user: User;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

export interface LoginErrorDTO {
    message: string;
    status: string;
    code: number;
    stack?: string;
}

export interface ITokenInfo {
    status?: string;
    code?: number;
    statusCode?: number;
    message?: string;
    stack?: string;
    metadata?: {
        is_valid?: boolean;
    };
}

export interface RefreshTokenResponse {
    message: string;
    statusCode?: number;
    code?: number;
    metadata?: {
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        user: {
            id: string;
            phone: string;
        }
    };
}