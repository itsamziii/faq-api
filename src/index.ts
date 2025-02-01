import express, { type Express } from "express";
import cors from "cors";
import env from "./env.js";
import { logger } from "./lib/logger.js";
import { connectMongo } from "./utils/connectMongo.js";
import redis from "./lib/redis.js";

// Connect to MongoDB and flush Redis

void connectMongo();
void redis.flushall().catch((error: unknown) => {
    throw error;
});

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.send("Hello, World!");
});

app.listen(env.PORT, () => {
    logger.info(`Server is running on ${String(env.PORT)}`);
});
