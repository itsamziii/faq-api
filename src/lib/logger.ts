import { pino, type Logger, type LoggerOptions } from "pino";

const level = process.env.NODE_ENV === "production" ? "info" : "debug";

const logger: Logger = pino({
    name: "Logger",
    level,
    transport: {
        target: "pino-pretty",
    },
} as LoggerOptions);

export { logger };
