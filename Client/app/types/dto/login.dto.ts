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