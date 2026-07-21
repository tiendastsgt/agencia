/**
 * Sistema de Manejo de Errores Robusto
 * Mejores prácticas para manejo de errores
 */

import { logger } from '../logger'

export enum ErrorCode {
  // Errores de configuración
  CONFIG_MISSING = 'CONFIG_MISSING',
  INVALID_CONFIG = 'INVALID_CONFIG',
  
  // Errores de API
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_TIMEOUT = 'API_TIMEOUT',
  API_UNAUTHORIZED = 'API_UNAUTHORIZED',
  API_FORBIDDEN = 'API_FORBIDDEN',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  
  // Errores de validación
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Errores de generación
  GENERATION_FAILED = 'GENERATION_FAILED',
  GENERATION_TIMEOUT = 'GENERATION_TIMEOUT',
  
  // Errores de base de datos
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  
  // Errores de red
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  
  // Errores internos
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorContext {
  service?: string
  operation?: string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
}

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly context: ErrorContext
  public readonly timestamp: string
  public readonly isOperational: boolean

  constructor(
    code: ErrorCode,
    message: string,
    context: ErrorContext = {},
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.context = context
    this.timestamp = new Date().toISOString()
    this.isOperational = isOperational

    // Mantener el stack trace
    Error.captureStackTrace(this, this.constructor)
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      isOperational: this.isOperational,
      stack: this.stack
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(ErrorCode.VALIDATION_ERROR, message, context)
    this.name = 'ValidationError'
  }
}

export class APIError extends AppError {
  constructor(
    code: ErrorCode,
    message: string,
    context: ErrorContext = {}
  ) {
    super(code, message, context)
    this.name = 'APIError'
  }
}

export class GenerationError extends AppError {
  constructor(
    message: string,
    context: ErrorContext = {}
  ) {
    super(ErrorCode.GENERATION_FAILED, message, context)
    this.name = 'GenerationError'
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    context: ErrorContext = {}
  ) {
    super(ErrorCode.DATABASE_ERROR, message, context)
    this.name = 'DatabaseError'
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    context: ErrorContext = {}
  ) {
    super(ErrorCode.NETWORK_ERROR, message, context)
    this.name = 'NetworkError'
  }
}

// Función para manejar errores de manera consistente
export function handleError(error: unknown, context: ErrorContext = {}): AppError {
  if (error instanceof AppError) {
    logger.error(`Operational error: ${error.message}`, error, {
      ...context,
      ...error.context
    }, context.service)
    return error
  }

  if (error instanceof Error) {
    const appError = new AppError(
      ErrorCode.UNKNOWN_ERROR,
      error.message,
      context,
      false
    )
    
    logger.error(`Unexpected error: ${error.message}`, error, context, context.service)
    return appError
  }

  const appError = new AppError(
    ErrorCode.UNKNOWN_ERROR,
    'An unknown error occurred',
    context,
    false
  )
  
  logger.error('Unknown error type', undefined, context, context.service)
  return appError
}

// Función para crear errores específicos de API
export function createAPIError(
  statusCode: number,
  message: string,
  context: ErrorContext = {}
): APIError {
  let code: ErrorCode

  switch (statusCode) {
    case 400:
      code = ErrorCode.INVALID_INPUT
      break
    case 401:
      code = ErrorCode.API_UNAUTHORIZED
      break
    case 403:
      code = ErrorCode.API_FORBIDDEN
      break
    case 404:
      code = ErrorCode.API_NOT_FOUND
      break
    case 429:
      code = ErrorCode.API_RATE_LIMIT
      break
    case 500:
    case 502:
    case 503:
    case 504:
      code = ErrorCode.API_SERVER_ERROR
      break
    default:
      code = ErrorCode.API_SERVER_ERROR
  }

  return new APIError(code, message, context)
}

// Función para crear errores de validación
export function createValidationError(
  field: string,
  value: any,
  rule: string,
  context: ErrorContext = {}
): ValidationError {
  const message = `Validation failed for field '${field}': ${rule}. Received: ${JSON.stringify(value)}`
  return new ValidationError(message, { ...context, field, value, rule })
}




