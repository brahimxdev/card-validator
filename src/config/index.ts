import { appEnv, isDev, isProd, isStaging } from "./env.js";

export { isDev, isProd, isStaging };

export const appConfig = {
  port: appEnv.PORT,
  url: appEnv.APP_URL,
  apiVersion: appEnv.API_VERSION,
  nodeEnv: appEnv.NODE_ENV,
} as const;

export const logConfig = {
  level: appEnv.LOG_LEVEL ?? (isDev ? "debug" : "info"),
} as const;
