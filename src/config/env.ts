import { z } from "zod";
import { parseEnv } from "./env-parser.js";

// Full application env schema, everything the running server needs.

const appEnvSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "staging", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.url(),
  API_VERSION: z.string().default("v1"),

  // Logging
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).optional(),
});

export const appEnv = parseEnv(appEnvSchema, "application");

// Convenience booleans
export const isDev = appEnv.NODE_ENV === "development";
export const isStaging = appEnv.NODE_ENV === "staging";
export const isProd = appEnv.NODE_ENV === "production";
export const isTest = appEnv.NODE_ENV === "test";
