/**
 * Unified Image Generation Service
 * Servicio unificado que integra DALL-E 3, Stability AI, Midjourney y Gemini Image
 * para MarketPro GT
 */

import { Dalle3Service, Dalle3ImageResult } from './dalle3-api'
import { StabilityAIService, StabilityImageResult } from './stability-api'
import { MidjourneyService, MidjourneyImageResult } from './midjourney-api'
import { GeminiImageService, GeminiImageResult } from './gemini-image-api'

// Tipos unificados
export interface UnifiedImageRequest {
  prompt: string
  provider: 'dalle3' | 'stability' | 'midjourney' | 'gemini'
  options: {
    // DALL-E 3 options
    size?: '1024x1024' | '1024x1792' | '1792x1024'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
    
    // Stability AI options
    model?: 'stable-image-ultra' | 'stable-image-core' | 'sd3.5-large' | 'sd3.5-large-turbo' | 'sd3.5-medium' | 'sd3.5-flash'
    aspect_ratio?: '16:9' | '1:1' | '21:9' | '2:3' | '3:2' | '4:5' | '5:4' | '9:16' | '9:21'
    style_preset?: '3d-model' | 'analog-film' | 'anime' | 'cinematic' | 'comic-book' | 'digital-art' | 'enhance' | 'fantasy-art' | 'isometric' | 'line-art' | 'low-poly' | 'modeling-compound' | 'neon-punk' | 'origami' | 'photographic' | 'pixel-art' | 'tile-texture'
    negative_prompt?: string
    seed?: number
    
    // Midjourney options
    mj_style?: 'raw' | 'cute' | 'expressive' | 'original' | 'scenic'
    mj_quality?: '0.25' | '0.5' | '1' | '2'
    chaos?: number
    stylize?: number
    version?: string
    mode?: 'fast' | 'relax'
    
    // Gemini options
    gemini_style?: 'photographic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'abstract'
    gemini_aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
    safety_filter?: boolean
  }
}

export interface UnifiedImageResult {
  image_url: string
  image_base64?: string
  provider: string
  model: string
  prompt_used: string
  revised_prompt?: string
  created_at: number
  metadata: {
    size?: string
    quality?: string
    style?: string
    aspect_ratio?: string
    credits_used?: number
    finish_reason?: string
    seed?: number
  }
}

export interface ProviderStatus {
  provider: string
  available: boolean
  error?: string
  account_info?: any
}

// Clase principal del servicio unificado
export class UnifiedImageService {
  private dalle3Service: Dalle3Service | null = null
  private stabilityService: StabilityAIService | null = null
  private midjourneyService: MidjourneyService | null = null
  private geminiService: GeminiImageService | null = null

  constructor(
    dalle3Service?: Dalle3Service,
    stabilityService?: StabilityAIService,
    midjourneyService?: MidjourneyService,
    geminiService?: GeminiImageService
  ) {
    this.dalle3Service = dalle3Service || null
    this.stabilityService = stabilityService || null
    this.midjourneyService = midjourneyService || null
    this.geminiService = geminiService || null
  }

  /**
   * Genera una imagen usando el proveedor especificado
   */
  async generateImage(request: UnifiedImageRequest): Promise<UnifiedImageResult> {
    switch (request.provider) {
      case 'dalle3':
        return await this.generateWithDalle3(request)
      case 'stability':
        return await this.generateWithStability(request)
      case 'midjourney':
        return await this.generateWithMidjourney(request)
      case 'gemini':
        return await this.generateWithGemini(request)
      default:
        throw new Error(`Proveedor no soportado: ${request.provider}`)
    }
  }

  /**
   * Genera múltiples variaciones usando el proveedor especificado
   */
  async generateVariations(
    prompt: string,
    provider: 'dalle3' | 'stability' | 'midjourney' | 'gemini',
    count: number = 4,
    options: any = {}
  ): Promise<UnifiedImageResult[]> {
    const variations: UnifiedImageResult[] = []
    
    for (let i = 0; i < count; i++) {
      const request: UnifiedImageRequest = {
        prompt: `${prompt} (variation ${i + 1})`,
        provider,
        options: {
          ...options,
          seed: options.seed ? options.seed + i : Math.floor(Math.random() * 1000000)
        }
      }
      
      const result = await this.generateImage(request)
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Genera imágenes con múltiples proveedores para comparación
   */
  async generateComparison(
    prompt: string,
    providers: ('dalle3' | 'stability' | 'midjourney' | 'gemini')[],
    options: any = {}
  ): Promise<UnifiedImageResult[]> {
    const results: UnifiedImageResult[] = []
    
    for (const provider of providers) {
      try {
        const request: UnifiedImageRequest = {
          prompt,
          provider,
          options
        }
        
        const result = await this.generateImage(request)
        results.push(result)
      } catch (error: any) {
        console.error(`Error generando con ${provider}:`, error.message)
        // Continuamos con los otros proveedores
      }
    }
    
    return results
  }

  /**
   * Obtiene el estado de todos los proveedores
   */
  async getProvidersStatus(): Promise<ProviderStatus[]> {
    const statuses: ProviderStatus[] = []
    
    // DALL-E 3
    if (this.dalle3Service) {
      try {
        const isValid = await this.dalle3Service.validateCredentials()
        const accountInfo = isValid ? await this.dalle3Service.getAccountInfo() : null
        statuses.push({
          provider: 'dalle3',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'dalle3',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'dalle3',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    // Stability AI
    if (this.stabilityService) {
      try {
        const isValid = await this.stabilityService.validateCredentials()
        const accountInfo = isValid ? await this.stabilityService.getAccountInfo() : null
        statuses.push({
          provider: 'stability',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'stability',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'stability',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    // Midjourney
    if (this.midjourneyService) {
      try {
        const isValid = await this.midjourneyService.validateCredentials()
        const accountInfo = isValid ? await this.midjourneyService.getAccountInfo() : null
        statuses.push({
          provider: 'midjourney',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'midjourney',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'midjourney',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    // Gemini
    if (this.geminiService) {
      try {
        const isValid = await this.geminiService.validateCredentials()
        statuses.push({
          provider: 'gemini',
          available: isValid
        })
      } catch (error: any) {
        statuses.push({
          provider: 'gemini',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'gemini',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    return statuses
  }

  /**
   * Genera con DALL-E 3
   */
  private async generateWithDalle3(request: UnifiedImageRequest): Promise<UnifiedImageResult> {
    if (!this.dalle3Service) {
      throw new Error('Servicio DALL-E 3 no disponible')
    }

    const dalle3Request = {
      prompt: request.prompt,
      size: request.options.size,
      quality: request.options.quality,
      style: request.options.style
    }

    const result: Dalle3ImageResult = await this.dalle3Service.generateImage(dalle3Request)

    return {
      image_url: result.image_url,
      provider: 'dalle3',
      model: result.model,
      prompt_used: request.prompt,
      revised_prompt: result.revised_prompt,
      created_at: result.created_at,
      metadata: {
        size: result.size,
        quality: result.quality,
        style: result.style
      }
    }
  }

  /**
   * Genera con Stability AI
   */
  private async generateWithStability(request: UnifiedImageRequest): Promise<UnifiedImageResult> {
    if (!this.stabilityService) {
      throw new Error('Servicio Stability AI no disponible')
    }

    const stabilityRequest = {
      prompt: request.prompt,
      model: request.options.model,
      aspect_ratio: request.options.aspect_ratio,
      style_preset: request.options.style_preset,
      negative_prompt: request.options.negative_prompt,
      seed: request.options.seed
    }

    const result: StabilityImageResult = await this.stabilityService.generateImage(stabilityRequest)

    return {
      image_url: result.image_url,
      image_base64: result.image_base64,
      provider: 'stability',
      model: result.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      metadata: {
        style: result.style_preset,
        aspect_ratio: result.aspect_ratio,
        credits_used: result.credits_used,
        finish_reason: result.finish_reason,
        seed: result.seed
      }
    }
  }

  /**
   * Genera con Midjourney
   */
  private async generateWithMidjourney(request: UnifiedImageRequest): Promise<UnifiedImageResult> {
    if (!this.midjourneyService) {
      throw new Error('Servicio Midjourney no disponible')
    }

    const midjourneyRequest = {
      prompt: request.prompt,
      aspect_ratio: request.options.aspect_ratio,
      style: request.options.mj_style,
      quality: request.options.mj_quality,
      chaos: request.options.chaos,
      stylize: request.options.stylize,
      seed: request.options.seed,
      version: request.options.version,
      mode: request.options.mode
    }

    const result: MidjourneyImageResult = await this.midjourneyService.generateImage(midjourneyRequest)

    return {
      image_url: result.image_url,
      provider: 'midjourney',
      model: `midjourney-${result.version}`,
      prompt_used: result.prompt,
      created_at: Date.now(),
      metadata: {
        aspect_ratio: result.aspect_ratio,
        style: result.style,
        quality: result.quality,
        credits_used: result.credits_used,
        seed: request.options.seed
      }
    }
  }

  /**
   * Genera con Gemini
   */
  private async generateWithGemini(request: UnifiedImageRequest): Promise<UnifiedImageResult> {
    if (!this.geminiService) {
      throw new Error('Servicio Gemini no disponible')
    }

    const geminiRequest = {
      prompt: request.prompt,
      style: request.options.gemini_style,
      aspect_ratio: request.options.gemini_aspect_ratio,
      quality: 'high' as const,
      safety_filter: request.options.safety_filter
    }

    const result: GeminiImageResult = await this.geminiService.generateImage(geminiRequest)

    return {
      image_url: result.image_url,
      image_base64: result.image_base64,
      provider: 'gemini',
      model: 'gemini-2.5-flash-image',
      prompt_used: result.prompt_used,
      created_at: Date.now(),
      metadata: {
        style: result.style,
        aspect_ratio: `${result.width}:${result.height}`,
        finish_reason: 'SUCCESS'
      }
    }
  }

  /**
   * Optimiza un prompt para un proveedor específico
   */
  async optimizePrompt(prompt: string, provider: 'dalle3' | 'stability' | 'midjourney' | 'gemini'): Promise<string> {
    switch (provider) {
      case 'dalle3':
        if (this.dalle3Service) {
          return await this.dalle3Service.optimizePrompt(prompt)
        }
        break
      case 'gemini':
        if (this.geminiService) {
          return await this.geminiService.optimizePrompt(prompt, 'photographic')
        }
        break
      case 'stability':
        // Stability AI no tiene optimización de prompts específica
        return prompt
      case 'midjourney':
        // Midjourney tiene su propio sistema de prompts
        return prompt
      default:
        return prompt
    }
    
    return prompt
  }
}

// Función para crear una instancia del servicio unificado
export async function createUnifiedImageService(clientId?: string): Promise<UnifiedImageService> {
  const [dalle3Service, stabilityService, midjourneyService, geminiService] = await Promise.all([
    import('./dalle3-api').then(m => m.createDalle3Service(clientId)),
    import('./stability-api').then(m => m.createStabilityService(clientId)),
    import('./midjourney-api').then(m => m.createMidjourneyService(clientId)),
    import('./gemini-image-api').then(m => m.createGeminiImageService(clientId))
  ])

  return new UnifiedImageService(
    dalle3Service,
    stabilityService,
    midjourneyService,
    geminiService
  )
}
