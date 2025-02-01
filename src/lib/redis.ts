import { Redis } from "ioredis";
import env from "../env.js";
import { logger } from "./logger.js";

if (!env.REDIS_URI) {
    throw new Error("REDIS_URI is not defined");
}

const redis = new Redis(env.REDIS_URI, {
    lazyConnect: true,
    family: 4,
})
    .on("connect", () => {
        logger.info("Connected to Redis");
    })
    .on("error", (error) => {
        logger.error(error);
    });

await redis.flushall();

export default redis;
