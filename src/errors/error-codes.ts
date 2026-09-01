export const ErrorName = {
  // 4xx
  BadRequest: "BadRequest",
  Unauthorized: "Unauthorized",
  Forbidden: "Forbidden",
  NotFound: "NotFound",
  Conflict: "Conflict",
  UnprocessableEntity: "UnprocessableEntity",
  TooManyRequests: "TooManyRequests",

  // 5xx
  InternalServerError: "InternalServerError",
  BadGateway: "BadGateway",
  ServiceUnavailable: "ServiceUnavailable",
  GatewayTimeout: "GatewayTimeout",

  // App Error
  ValidationError: "ValidationError",
} as const;

export const ErrorCode = {
  INVALID_CARD_NUMBER: "INVALID_CARD_NUMBER",

  // Resources
  NOT_FOUND: "NOT_FOUND",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Permissions
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Rate limiting
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  INVALID_REFERENCE: "INVALID_REFERENCE",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorNameType = (typeof ErrorName)[keyof typeof ErrorName];
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
