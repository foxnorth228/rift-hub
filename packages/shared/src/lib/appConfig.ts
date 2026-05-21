import { envSchema } from "./env.js";

export const appConfig = envSchema.parse(process.env);
