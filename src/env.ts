import "dotenv/config";
import { z } from "zod";

const envSchema = z
    .object({
        MONGO_URI: z.coerce.string().min(1),
        REDIS_URI: z.coerce.string().min(1),
        JWT_SECRET: z.coerce.string().min(1),
        PORT: z.coerce.number().int().default(3000),
    })
    .required();

const env = envSchema.parse(process.env);

export default env;
