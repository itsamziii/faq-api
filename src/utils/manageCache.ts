import { CACHE_EXPIRATION_SECONDS } from "../constants.js";
import { logger } from "../lib/logger.js";
import redis from "../lib/redis.js";

export async function invalidateFAQCache(): Promise<void> {
    try {
        const keys = await redis.keys("faqs:*");
        if (keys.length) {
            await redis.del(keys);
            logger.info(`Invalidated ${String(keys.length)} FAQ cache entries`);
        }
    } catch (error) {
        logger.error("Failed to invalidate FAQ cache:", error);
    }
}

export async function setCache(
    cacheKey: string,
    data: unknown,
    expirationInSeconds = CACHE_EXPIRATION_SECONDS,
) {
    return redis
        .set(cacheKey, JSON.stringify(data), "EX", expirationInSeconds)
        .catch((err: unknown) => {
            logger.error("Redis cache set failed:", err);
        });
}
