export const CACHE_EXPIRATION_SECONDS = 60 * 60; // 1 hour

export enum UserRole {
    ADMIN = "admin",
    VIEWER = "viewer",
}

export const ERROR_MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    INVALID_ROLE: "Invalid role in token",
    FORBIDDEN: "Forbidden",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
};

// Can be extended to support more languages
export const SUPPORTED_LANGUAGES = ["hi", "bn"];
