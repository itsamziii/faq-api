import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import env from "../env.js";
import { ERROR_MESSAGES, UserRole } from "../constants.js";

declare module "express" {
    interface Request {
        user?: JwtPayload;
    }
}

if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

function isValidUserRole(role: unknown): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
}

export function auth(allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
                return;
            }

            const decoded = jwt.verify(token, env.JWT_SECRET);
            if (typeof decoded === "string") {
                res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
                return;
            }

            if (!isValidUserRole(decoded.role)) {
                res.status(403).json({ error: ERROR_MESSAGES.INVALID_ROLE });
                return;
            }

            if (
                allowedRoles.length > 0 &&
                !allowedRoles.includes(decoded.role)
            ) {
                res.status(403).json({ error: ERROR_MESSAGES.FORBIDDEN });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
                return;
            } else if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: ERROR_MESSAGES.TOKEN_EXPIRED });
                return;
            }

            next(error);
        }
    };
}
