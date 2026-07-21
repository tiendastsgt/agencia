/**
 * Unified Video Generation Service
 * Servicio unificado que integra RunwayML, Pika Labs y Luma AI
 * para MarketPro GT
 */

import { RunwayMLService, RunwayVideoResult } from './runway-api'
import { PikaLabsService, PikaVideoResult } from './pika-api'
import { LumaAIService, LumaVideoResult } from './luma-api'

// Tipos unificados
export interface UnifiedVideoRequest {
  prompt: string
  provider: 'runway' | 'pika' | 'luma'
  options: {
    // RunwayML options
    runway_model?: 'gen-4-turbo' | 'gen-4-images'
    runway_style?: 'cinematic' | 'realistic' | 'artistic' | 'documentary'
    runway_motion?: 'subtle' | 'moderate' | 'dynamic'
    
    // Pika Labs options
    pika_model?: 'pika-1.0' | 'pika-1.5' | 'pika-2.0'
    pika_style?: 'realistic' | 'anime' | 'cinematic' | 'artistic'
    pika_motion?: 'subtle' | 'moderate' | 'dynamic'
    pika_scene_ingredients?: boolean
    
    // Luma AI options
    luma_model?: 'luma-ray2' | 'luma-ray1.6'
    luma_style?: 'realistic' | 'cinematic' | 'artistic' | 'documentary'
    luma_motion?: 'subtle' | 'moderate' | 'dynamic'
    luma_camera_control?: string
    
    // Common options
    duration?: number
    resolution?: '720p' | '1080p'
    aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
    seed?: number
  }
}

export interface UnifiedVideoResult {
  video_url: string
  thumbnail_url: string
  provider: string
  model: string
  prompt_used: string
  created_at: number
  completed_at?: number
  metadata: {
    duration: number
    resolution: string
    aspect_ratio: string
    credits_used?: number
    cost_usd?: number
    status: string
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
export class UnifiedVideoService {
  private runwayService: RunwayMLService | null = null
  private pikaService: PikaLabsService | null = null
  private lumaService: LumaAIService | null = null

  constructor(
    runwayService?: RunwayMLService,
    pikaService?: PikaLabsService,
    lumaService?: LumaAIService
  ) {
    this.runwayService = runwayService || null
    this.pikaService = pikaService || null
    this.lumaService = lumaService || null
  }

  /**
   * Genera un video usando el proveedor especificado
   */
  async generateVideo(request: UnifiedVideoRequest): Promise<UnifiedVideoResult> {
    switch (request.provider) {
      case 'runway':
        return await this.generateWithRunway(request)
      case 'pika':
        return await this.generateWithPika(request)
      case 'luma':
        return await this.generateWithLuma(request)
      default:
        throw new Error(`Proveedor no soportado: ${request.provider}`)
    }
  }

  /**
   * Genera múltiples variaciones usando el proveedor especificado
   */
  async generateVariations(
    prompt: string,
    provider: 'runway' | 'pika' | 'luma',
    count: number = 4,
    options: any = {}
  ): Promise<UnifiedVideoResult[]> {
    const variations: UnifiedVideoResult[] = []
    
    for (let i = 0; i < count; i++) {
      const request: UnifiedVideoRequest = {
        prompt: `${prompt} (variation ${i + 1})`,
        provider,
        options: {
          ...options,
          seed: options.seed ? options.seed + i : Math.floor(Math.random() * 1000000)
        }
      }
      
      const result = await this.generateVideo(request)
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Genera videos con múltiples proveedores para comparación
   */
  async generateComparison(
    prompt: string,
    providers: ('runway' | 'pika' | 'luma')[],
    options: any = {}
  ): Promise<UnifiedVideoResult[]> {
    const results: UnifiedVideoResult[] = []
    
    for (const provider of providers) {
      try {
        const request: UnifiedVideoRequest = {
          prompt,
          provider,
          options
        }
        
        const result = await this.generateVideo(request)
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
    
    // RunwayML
    if (this.runwayService) {
      try {
        const isValid = await this.runwayService.validateCredentials()
        const accountInfo = isValid ? await this.runwayService.getAccountInfo() : null
        statuses.push({
          provider: 'runway',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'runway',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'runway',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    // Pika Labs
    if (this.pikaService) {
      try {
        const isValid = await this.pikaService.validateCredentials()
        const accountInfo = isValid ? await this.pikaService.getAccountInfo() : null
        statuses.push({
          provider: 'pika',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'pika',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'pika',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    // Luma AI
    if (this.lumaService) {
      try {
        const isValid = await this.lumaService.validateCredentials()
        const accountInfo = isValid ? await this.lumaService.getAccountInfo() : null
        statuses.push({
          provider: 'luma',
          available: isValid,
          account_info: accountInfo
        })
      } catch (error: any) {
        statuses.push({
          provider: 'luma',
          available: false,
          error: error.message
        })
      }
    } else {
      statuses.push({
        provider: 'luma',
        available: false,
        error: 'Servicio no configurado'
      })
    }

    return statuses
  }

  /**
   * Genera con RunwayML
   */
  private async generateWithRunway(request: UnifiedVideoRequest): Promise<UnifiedVideoResult> {
    if (!this.runwayService) {
      throw new Error('Servicio RunwayML no disponible')
    }

    const runwayRequest = {
      prompt: request.prompt,
      model: request.options.runway_model,
      duration: request.options.duration,
      resolution: request.options.resolution,
      aspect_ratio: request.options.aspect_ratio,
      seed: request.options.seed,
      style: request.options.runway_style,
      motion: request.options.runway_motion
    }

    const result: RunwayVideoResult = await this.runwayService.generateVideo(runwayRequest)

    return {
      video_url: result.video_url,
      thumbnail_url: result.thumbnail_url,
      provider: 'runway',
      model: result.model,
      prompt_used: result.prompt_used,
      created_at: result.created_at,
      completed_at: result.completed_at,
      metadata: {
        duration: result.duration,
        resolution: result.resolution,
        aspect_ratio: result.aspect_ratio,
        credits_used: result.credits_used,
        status: result.status,
        seed: request.options.seed
      }
    }
  }

  /**
   * Genera con Pika Labs
   */
  private async generateWithPika(request: UnifiedVideoRequest): Promise<UnifiedVideoResult> {
    if (!this.pikaService) {
      throw new Error('Servicio Pika Labs no disponible')
    }

    const pikaRequest = {
      prompt: request.prompt,
      model: request.options.pika_model,
      duration: request.options.duration,
      aspect_ratio: request.options.aspect_ratio,
      seed: request.options.seed,
      style: request.options.pika_style,
      motion: request.options.pika_motion,
      scene_ingredients: request.options.pika_scene_ingredients
    }

    const result: PikaVideoResult = await this.pikaService.generateVideo(pikaRequest)

    return {
      video_url: result.video_url,
      thumbnail_url: result.thumbnail_url,
      provider: 'pika',
      model: result.model,
      prompt_used: result.prompt_used,
      created_at: result.created_at,
      completed_at: result.completed_at,
      metadata: {
        duration: result.duration,
        resolution: result.resolution,
        aspect_ratio: result.aspect_ratio,
        cost_usd: result.cost_usd,
        status: result.status,
        seed: request.options.seed
      }
    }
  }

  /**
   * Genera con Luma AI
   */
  private async generateWithLuma(request: UnifiedVideoRequest): Promise<UnifiedVideoResult> {
    if (!this.lumaService) {
      throw new Error('Servicio Luma AI no disponible')
    }

    const lumaRequest = {
      prompt: request.prompt,
      model: request.options.luma_model,
      duration: request.options.duration,
      resolution: request.options.resolution,
      aspect_ratio: request.options.aspect_ratio,
      seed: request.options.seed,
      style: request.options.luma_style,
      motion: request.options.luma_motion,
      camera_control: request.options.luma_camera_control
    }

    const result: LumaVideoResult = await this.lumaService.generateVideo(lumaRequest)

    return {
      video_url: result.video_url,
      thumbnail_url: result.thumbnail_url,
      provider: 'luma',
      model: result.model,
      prompt_used: result.prompt_used,
      created_at: result.created_at,
      completed_at: result.completed_at,
      metadata: {
        duration: result.duration,
        resolution: result.resolution,
        aspect_ratio: result.aspect_ratio,
        credits_used: result.credits_used,
        status: result.status,
        seed: request.options.seed
      }
    }
  }

  /**
   * Optimiza un prompt para un proveedor específico
   */
  async optimizePrompt(prompt: string, provider: 'runway' | 'pika' | 'luma'): Promise<string> {
    // Cada proveedor tiene sus propias optimizaciones de prompts
    switch (provider) {
      case 'runway':
        // RunwayML prefiere prompts cinematográficos
        return prompt
          .replace(/\b(low quality|blurry|pixelated)\b/gi, '')
          .replace(/\b(high quality|cinematic|professional)\b/gi, 'cinematic, professional quality')
          .trim()
      
      case 'pika':
        // Pika Labs prefiere prompts descriptivos
        return prompt
          .replace(/\b(static|still|motionless)\b/gi, '')
          .replace(/\b(dynamic|moving|animated)\b/gi, 'dynamic movement, smooth animation')
          .trim()
      
      case 'luma':
        // Luma AI prefiere prompts realistas
        return prompt
          .replace(/\b(artistic|stylized|abstract)\b/gi, '')
          .replace(/\b(realistic|natural|photorealistic)\b/gi, 'photorealistic, natural lighting')
          .trim()
      
      default:
        return prompt
    }
  }
}

// Función para crear una instancia del servicio unificado
export async function createUnifiedVideoService(clientId?: string): Promise<UnifiedVideoService> {
  const [runwayService, pikaService, lumaService] = await Promise.all([
    import('./runway-api').then(m => m.createRunwayService(clientId)),
    import('./pika-api').then(m => m.createPikaService(clientId)),
    import('./luma-api').then(m => m.createLumaService(clientId))
  ])

  return new UnifiedVideoService(
    runwayService,
    pikaService,
    lumaService
  )
}
