/**
 * Factory Pattern para Servicios de AI
 * Mejores prácticas para creación de servicios
 */

import { logger } from '../logger'
import { AppError, ErrorCode, handleError } from '../errors'
import { ResilientServiceFactory } from '../resilience'
import { configManager } from '../config'
import { imagenAPIService } from '../imagen-api-correct'

export interface AIService {
  generateImage(prompt: string, options?: any): Promise<any>
  isAvailable(): Promise<boolean>
  getProvider(): string
}

export interface AIServiceConfig {
  apiKey: string
  baseUrl?: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

export abstract class BaseAIService implements AIService {
  protected config: AIServiceConfig
  protected provider: string

  constructor(provider: string, config: AIServiceConfig) {
    this.provider = provider
    this.config = config
    this.validateConfig()
  }

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new AppError(
        ErrorCode.API_KEY_MISSING,
        `API key is required for ${this.provider}`,
        { provider: this.provider }
      )
    }
  }

  public abstract generateImage(prompt: string, options?: any): Promise<any>

  public async isAvailable(): Promise<boolean> {
    try {
      // Implementar verificación de disponibilidad específica del proveedor
      return true
    } catch (error) {
      logger.warn(`Service ${this.provider} is not available`, { error: (error as Error).message })
      return false
    }
  }

  public getProvider(): string {
    return this.provider
  }

  protected createResilientOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): () => Promise<T> {
    return ResilientServiceFactory.createResilientOperation(
      `${this.provider}_${operationName}`,
      operation,
      {
        retry: {
          maxAttempts: this.config.retryAttempts,
          baseDelay: this.config.retryDelay,
          retryCondition: (error: Error) => {
            // No reintentar errores de autenticación
            return !error.message.includes('401') && !error.message.includes('403')
          }
        },
        timeout: this.config.timeout
      }
    )
  }
}

export class GeminiService extends BaseAIService {
  constructor(config: AIServiceConfig) {
    super('gemini', config)
  }

  public async generateImage(prompt: string, options: any = {}): Promise<any> {
    const operation = this.createResilientOperation(
      async () => {
        logger.info('Generating image with Gemini', { prompt: prompt.substring(0, 100) })
        
        // Implementar llamada real a Gemini API
        // Por ahora, simular respuesta
        return {
          image_url: `https://generated-image-${Date.now()}.png`,
          provider: 'gemini',
          model: 'gemini-2.5-flash-image',
          prompt_used: prompt
        }
      },
      'generateImage'
    )

    return await operation()
  }
}

export class Dalle3Service extends BaseAIService {
  constructor(config: AIServiceConfig) {
    super('dalle3', config)
  }

  public async generateImage(prompt: string, options: any = {}): Promise<any> {
    const operation = this.createResilientOperation(
      async () => {
        logger.info('Generating image with DALL-E 3', { prompt: prompt.substring(0, 100) })
        
        // Implementar llamada real a DALL-E 3 API
        return {
          image_url: `https://dalle-generated-${Date.now()}.png`,
          provider: 'dalle3',
          model: 'dall-e-3',
          prompt_used: prompt
        }
      },
      'generateImage'
    )

    return await operation()
  }
}

export class StabilityService extends BaseAIService {
  constructor(config: AIServiceConfig) {
    super('stability', config)
  }

  public async generateImage(prompt: string, options: any = {}): Promise<any> {
    const operation = this.createResilientOperation(
      async () => {
        logger.info('Generating image with Stability AI', { prompt: prompt.substring(0, 100) })
        
        // Implementar llamada real a Stability AI API
        return {
          image_url: `https://stability-generated-${Date.now()}.png`,
          provider: 'stability',
          model: 'stable-image-ultra',
          prompt_used: prompt
        }
      },
      'generateImage'
    )

    return await operation()
  }
}

export class AIServiceFactory {
  private static services: Map<string, AIService> = new Map()

  public static createService(provider: 'gemini' | 'dalle3' | 'stability' | 'imagen'): AIService {
    if (AIServiceFactory.services.has(provider)) {
      return AIServiceFactory.services.get(provider)!
    }

    const config = configManager.getAIConfig(provider)
    
    if (!config.apiKey) {
      throw new AppError(
        ErrorCode.API_KEY_MISSING,
        `API key not configured for ${provider}`,
        { provider }
      )
    }

    let service: AIService

    switch (provider) {
      case 'gemini':
        service = new GeminiService(config)
        break
      case 'dalle3':
        service = new Dalle3Service(config)
        break
      case 'stability':
        service = new StabilityService(config)
        break
      case 'imagen':
        // Usar el servicio de Imagen API según el documento técnico
        return imagenAPIService as any
      default:
        throw new AppError(
          ErrorCode.INVALID_CONFIG,
          `Unsupported AI provider: ${provider}`,
          { provider }
        )
    }

    AIServiceFactory.services.set(provider, service)
    logger.info(`Created AI service for ${provider}`)
    
    return service
  }

  public static async getAvailableServices(): Promise<AIService[]> {
    const providers: ('gemini' | 'dalle3' | 'stability')[] = ['gemini', 'dalle3', 'stability']
    const availableServices: AIService[] = []

    for (const provider of providers) {
      try {
        const service = AIServiceFactory.createService(provider)
        if (await service.isAvailable()) {
          availableServices.push(service)
        }
      } catch (error) {
        logger.warn(`Service ${provider} is not available`, { error: (error as Error).message })
      }
    }

    return availableServices
  }

  public static getService(provider: string): AIService | null {
    return AIServiceFactory.services.get(provider) || null
  }

  public static clearServices(): void {
    AIServiceFactory.services.clear()
    logger.info('Cleared all AI services')
  }
}

export default AIServiceFactory
