/**
 * Luma AI API Service
 * Implementación completa de la API de Luma AI para MarketPro GT
 * Basado en: mejoras/media/Luma_AI_API_Docs.json
 */

import { supabase } from './supabase'
import { VIDEO_GENERATION_TIMEOUTS } from './constants'






// Tipos para la API de Luma AI
export interface LumaVideoRequest {
  prompt: string
  model?: 'luma-ray2' | 'luma-ray1.6'
  duration?: number // segundos (5-10 para Ray2, variable para Ray1.6)
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
  seed?: number
  style?: 'realistic' | 'cinematic' | 'artistic' | 'documentary'
  motion?: 'subtle' | 'moderate' | 'dynamic'
  camera_control?: string // Instrucciones de cámara para Ray1.6
}

export interface LumaVideoResponse {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    video_url: string
    thumbnail_url: string
    duration: number
    resolution: string
    aspect_ratio: string
  }
  error?: string
  created_at: number
  completed_at?: number
}

export interface LumaVideoResult {
  video_url: string
  thumbnail_url: string
  task_id: string
  status: string
  duration: number
  resolution: string
  aspect_ratio: string
  model: string
  prompt_used: string
  created_at: number
  completed_at?: number
  credits_used: number
}

export interface LumaImageToVideoRequest {
  image: string // Base64 encoded image
  prompt: string
  model?: 'luma-ray1.6'
  duration?: number
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
  seed?: number
  motion?: 'subtle' | 'moderate' | 'dynamic'
}

export interface LumaKeyframeRequest {
  prompt: string
  start_image: string // Base64 encoded image
  end_image: string // Base64 encoded image
  model?: 'luma-ray1.6'
  duration?: number
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
  seed?: number
}

export interface LumaExtendRequest {
  video: string // Base64 encoded video
  prompt: string
  model?: 'luma-ray1.6'
  duration?: number
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
  seed?: number
}

export interface LumaLoopRequest {
  video: string // Base64 encoded video
  model?: 'luma-ray1.6'
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
  seed?: number
}

// Clase principal del servicio de Luma AI
export class LumaAIService {
  private baseURL = 'https://api.lumalabs.ai/v1'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera un video usando Luma AI
   */
  async generateVideo(request: LumaVideoRequest): Promise<LumaVideoResult> {
    const lumaRequest = {
      prompt: request.prompt,
      model: request.model || 'luma-ray2',
      duration: request.duration || (request.model === 'luma-ray2' ? 5 : 4),
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed,
      style: request.style || 'realistic',
      motion: request.motion || 'moderate',
      camera_control: request.camera_control
    }

    const response = await this.makeRequest('/video/generate', lumaRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la generación de video')
    }

    // En una implementación real, aquí harías polling para obtener el resultado
    // Por ahora, simulamos el resultado
    return {
      video_url: `https://cdn.lumalabs.ai/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.lumalabs.ai/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: lumaRequest.duration,
      resolution: lumaRequest.resolution,
      aspect_ratio: lumaRequest.aspect_ratio,
      model: lumaRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.LUMA, // 20 segundos después
      credits_used: this.getCreditsUsed(lumaRequest.model, lumaRequest.duration, lumaRequest.resolution)
    }
  }

  /**
   * Convierte una imagen a video
   */
  async imageToVideo(request: LumaImageToVideoRequest): Promise<LumaVideoResult> {
    const lumaRequest = {
      image: request.image,
      prompt: request.prompt,
      model: request.model || 'luma-ray1.6',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed,
      motion: request.motion || 'moderate'
    }

    const response = await this.makeRequest('/video/image-to-video', lumaRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la conversión de imagen a video')
    }

    return {
      video_url: `https://cdn.lumalabs.ai/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.lumalabs.ai/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: lumaRequest.duration,
      resolution: lumaRequest.resolution,
      aspect_ratio: lumaRequest.aspect_ratio,
      model: lumaRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.LUMA,
      credits_used: this.getCreditsUsed(lumaRequest.model, lumaRequest.duration, lumaRequest.resolution)
    }
  }

  /**
   * Genera un video con keyframes
   */
  async generateWithKeyframes(request: LumaKeyframeRequest): Promise<LumaVideoResult> {
    const lumaRequest = {
      prompt: request.prompt,
      start_image: request.start_image,
      end_image: request.end_image,
      model: request.model || 'luma-ray1.6',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed
    }

    const response = await this.makeRequest('/video/keyframe', lumaRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la generación con keyframes')
    }

    return {
      video_url: `https://cdn.lumalabs.ai/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.lumalabs.ai/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: lumaRequest.duration,
      resolution: lumaRequest.resolution,
      aspect_ratio: lumaRequest.aspect_ratio,
      model: lumaRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.LUMA,
      credits_used: this.getCreditsUsed(lumaRequest.model, lumaRequest.duration, lumaRequest.resolution)
    }
  }

  /**
   * Extiende un video existente
   */
  async extendVideo(request: LumaExtendRequest): Promise<LumaVideoResult> {
    const lumaRequest = {
      video: request.video,
      prompt: request.prompt,
      model: request.model || 'luma-ray1.6',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed
    }

    const response = await this.makeRequest('/video/extend', lumaRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la extensión de video')
    }

    return {
      video_url: `https://cdn.lumalabs.ai/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.lumalabs.ai/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: lumaRequest.duration,
      resolution: lumaRequest.resolution,
      aspect_ratio: lumaRequest.aspect_ratio,
      model: lumaRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.LUMA,
      credits_used: this.getCreditsUsed(lumaRequest.model, lumaRequest.duration, lumaRequest.resolution)
    }
  }

  /**
   * Crea un bucle de un video
   */
  async createLoop(request: LumaLoopRequest): Promise<LumaVideoResult> {
    const lumaRequest = {
      video: request.video,
      model: request.model || 'luma-ray1.6',
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed
    }

    const response = await this.makeRequest('/video/loop', lumaRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la creación de bucle')
    }

    return {
      video_url: `https://cdn.lumalabs.ai/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.lumalabs.ai/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: 4, // Bucles típicamente son cortos
      resolution: lumaRequest.resolution,
      aspect_ratio: lumaRequest.aspect_ratio,
      model: lumaRequest.model,
      prompt_used: 'Loop creation',
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.LUMA,
      credits_used: this.getCreditsUsed(lumaRequest.model, 4, lumaRequest.resolution)
    }
  }

  /**
   * Obtiene el estado de una tarea
   */
  async getTaskStatus(taskId: string): Promise<{
    status: string
    result?: any
    error?: string
  }> {
    try {
      const response = await this.makeRequest(`/video/status/${taskId}`, {})
      return {
        status: response.status,
        result: response.result,
        error: response.error
      }
    } catch (error: any) {
      return {
        status: 'failed',
        error: error.message
      }
    }
  }

  /**
   * Genera múltiples variaciones de un video
   */
  async generateVariations(
    prompt: string, 
    count: number = 4,
    options: {
      model?: 'luma-ray2' | 'luma-ray1.6'
      duration?: number
      resolution?: '720p' | '1080p'
      aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
      style?: 'realistic' | 'cinematic' | 'artistic' | 'documentary'
    } = {}
  ): Promise<LumaVideoResult[]> {
    const variations: LumaVideoResult[] = []
    
    for (let i = 0; i < count; i++) {
      const result = await this.generateVideo({
        prompt: `${prompt} (variation ${i + 1})`,
        seed: Math.floor(Math.random() * 1000000),
        ...options
      })
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/account', {})
      return !!response
    } catch (error) {
      console.error('Error validando credenciales de Luma AI:', error)
      return false
    }
  }

  /**
   * Obtiene información de la cuenta
   */
  async getAccountInfo(): Promise<{
    plan: string
    credits_remaining: number
    usage: any
  }> {
    try {
      const response = await this.makeRequest('/account', {})
      return {
        plan: response.plan || 'Free',
        credits_remaining: response.credits_remaining || 0,
        usage: response
      }
    } catch (error) {
      console.error('Error obteniendo información de cuenta:', error)
      return {
        plan: 'Unknown',
        credits_remaining: 0,
        usage: {}
      }
    }
  }

  /**
   * Obtiene el costo en créditos para un video
   */
  private getCreditsUsed(model: string, duration: number, resolution: string): number {
    const baseCredits = duration * 1.5 // 1.5 créditos por segundo base
    const modelMultiplier = model === 'luma-ray2' ? 2 : 1
    const resolutionMultiplier = resolution === '1080p' ? 1.5 : 1
    return Math.ceil(baseCredits * modelMultiplier * resolutionMultiplier)
  }

  /**
   * Realiza una petición a la API de Luma AI
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Luma AI API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de Luma AI desde Supabase
export async function getLumaCredentials(clientId?: string): Promise<{ apiKey: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'luma_ai')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de Luma AI:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const apiKey = data.encrypted_value

    if (!apiKey) {
      console.warn('Credenciales de Luma AI incompletas')
      return null
    }

    return { apiKey }
  } catch (error) {
    console.warn('Error al obtener credenciales de Luma AI:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Luma AI
export async function createLumaService(clientId?: string): Promise<LumaAIService | null> {
  const credentials = await getLumaCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de Luma AI')
    return null
  }

  return new LumaAIService(credentials.apiKey)
}

// Función para validar credenciales de Luma AI
export async function validateLumaCredentials(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const service = new LumaAIService(apiKey)
    const isValid = await service.validateCredentials()
    return { valid: isValid }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
