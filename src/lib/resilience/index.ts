/**
 * Sistema de Resiliencia
 * Circuit Breaker, Retry, Timeout y Rate Limiting
 */

import { logger } from '../logger'
import { AppError, ErrorCode, handleError } from '../errors'

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryCondition?: (error: Error) => boolean
}

export interface CircuitBreakerConfig {
  failureThreshold: number
  recoveryTimeout: number
  monitoringPeriod: number
}

export interface TimeoutConfig {
  timeout: number
  abortSignal?: AbortSignal
}

export class RetryManager {
  private static instance: RetryManager
  private defaultConfig: RetryConfig

  private constructor() {
    this.defaultConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryCondition: (error: Error) => {
        // No reintentar errores de validación o autorización
        return !error.message.includes('401') && 
               !error.message.includes('403') && 
               !error.message.includes('400')
      }
    }
  }

  public static getInstance(): RetryManager {
    if (!RetryManager.instance) {
      RetryManager.instance = new RetryManager()
    }
    return RetryManager.instance
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    context: string = 'unknown'
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config }
    let lastError: Error

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        logger.debug(`Attempt ${attempt}/${finalConfig.maxAttempts} for ${context}`)
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === finalConfig.maxAttempts) {
          logger.error(`All retry attempts failed for ${context}`, lastError, { attempts: attempt })
          throw handleError(lastError, { operation: context, attempts: attempt })
        }

        if (finalConfig.retryCondition && !finalConfig.retryCondition(lastError)) {
          logger.warn(`Retry condition not met for ${context}`, { error: lastError.message })
          throw handleError(lastError, { operation: context, attempt })
        }

        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attempt - 1),
          finalConfig.maxDelay
        )

        logger.warn(`Retry attempt ${attempt} failed for ${context}, retrying in ${delay}ms`, {
          error: lastError.message,
          delay
        })

        await this.delay(delay)
      }
    }

    throw handleError(lastError!, { operation: context })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class CircuitBreaker {
  private static instances: Map<string, CircuitBreaker> = new Map()
  
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private failureCount: number = 0
  private lastFailureTime: number = 0
  private successCount: number = 0

  private constructor(
    private name: string,
    private config: CircuitBreakerConfig
  ) {}

  public static getInstance(name: string, config: CircuitBreakerConfig): CircuitBreaker {
    if (!CircuitBreaker.instances.has(name)) {
      CircuitBreaker.instances.set(name, new CircuitBreaker(name, config))
    }
    return CircuitBreaker.instances.get(name)!
  }

  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
        logger.info(`Circuit breaker ${this.name} transitioning to HALF_OPEN`)
      } else {
        throw new AppError(
          ErrorCode.API_SERVER_ERROR,
          `Circuit breaker ${this.name} is OPEN`,
          { circuitBreaker: this.name, state: this.state }
        )
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++
      if (this.successCount >= this.config.failureThreshold) {
        this.state = 'CLOSED'
        logger.info(`Circuit breaker ${this.name} transitioning to CLOSED`)
      }
    }
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN'
      logger.error(`Circuit breaker ${this.name} transitioning to OPEN`, undefined, {
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold
      })
    }
  }

  public getState(): string {
    return this.state
  }

  public getStats(): Record<string, any> {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime
    }
  }
}

export class TimeoutManager {
  public static async executeWithTimeout<T>(
    operation: () => Promise<T>,
    config: TimeoutConfig,
    context: string = 'unknown'
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new AppError(
          ErrorCode.API_TIMEOUT,
          `Operation ${context} timed out after ${config.timeout}ms`,
          { operation: context, timeout: config.timeout }
        ))
      }, config.timeout)

      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => {
          clearTimeout(timeoutId)
          reject(new AppError(
            ErrorCode.API_TIMEOUT,
            `Operation ${context} was aborted`,
            { operation: context }
          ))
        })
      }
    })

    try {
      return await Promise.race([operation(), timeoutPromise])
    } catch (error) {
      logger.error(`Timeout error for ${context}`, error as Error, { timeout: config.timeout })
      throw error
    }
  }
}

// Factory para crear servicios resilientes
export class ResilientServiceFactory {
  public static createResilientOperation<T>(
    name: string,
    operation: () => Promise<T>,
    options: {
      retry?: Partial<RetryConfig>
      circuitBreaker?: CircuitBreakerConfig
      timeout?: number
    } = {}
  ): () => Promise<T> {
    const retryManager = RetryManager.getInstance()
    const circuitBreaker = options.circuitBreaker 
      ? CircuitBreaker.getInstance(name, options.circuitBreaker)
      : null

    return async (): Promise<T> => {
      const resilientOperation = async (): Promise<T> => {
        if (circuitBreaker) {
          return await circuitBreaker.execute(operation)
        }
        return await operation()
      }

      if (options.timeout) {
        return await TimeoutManager.executeWithTimeout(
          resilientOperation,
          { timeout: options.timeout },
          name
        )
      }

      if (options.retry) {
        return await retryManager.executeWithRetry(
          resilientOperation,
          options.retry,
          name
        )
      }

      return await resilientOperation()
    }
  }
}

export const retryManager = RetryManager.getInstance()
export default { retryManager, CircuitBreaker, TimeoutManager, ResilientServiceFactory }




