import { pino, type Logger, type LoggerOptions } from "pino";


const isProduction = process.env.NODE_ENV === "production";
const level = isProduction ? "info" : "debug";

const logger: Logger = pino({
    name: "Logger",
    level,
    ...(isProduction ? {} : {
        transport: {
            target: "pino-pretty",
        }
    }),
} as LoggerOptions);

export { logger };
