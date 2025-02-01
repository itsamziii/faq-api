import express, { type Express } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import faqRouter from "./routes/faqs.js";
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

app.use("/api/faqs", faqRouter);

app.use((_, res) => {
    res.status(404).end();
});

app.use(errorMiddleware);

export default app;
