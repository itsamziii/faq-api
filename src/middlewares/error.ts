import type { Request, Response } from "express";
import { logger } from "../lib/logger.js";

export function errorMiddleware(
    error: unknown,
    _: Request,
    res: Response,
): void {
    logger.error(error);

    res.status(500).json({ error: "Internal server error" });
}
