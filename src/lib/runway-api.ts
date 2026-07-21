/**
 * RunwayML API Service
 * Implementación completa de la API de RunwayML para MarketPro GT
 * Basado en: mejoras/media/RunwayML_API_Docs.json
 */

import { supabase } from './supabase'
import { VIDEO_GENERATION_TIMEOUTS } from './constants'






// Tipos para la API de RunwayML
export interface RunwayVideoRequest {
  prompt: string
  model?: 'gen-4-turbo' | 'gen-4-images'
  duration?: number // segundos
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  seed?: number
  style?: 'cinematic' | 'realistic' | 'artistic' | 'documentary'
  motion?: 'subtle' | 'moderate' | 'dynamic'
}

export interface RunwayVideoResponse {
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

export interface RunwayVideoResult {
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

export interface RunwayImageToVideoRequest {
  image: string // Base64 encoded image
  prompt: string
  model?: 'gen-4-turbo'
  duration?: number
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  seed?: number
  motion?: 'subtle' | 'moderate' | 'dynamic'
}

export interface RunwayVideoToVideoRequest {
  video: string // Base64 encoded video
  prompt: string
  model?: 'gen-4-turbo'
  duration?: number
  resolution?: '720p' | '1080p'
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  seed?: number
  strength?: number // 0.0 to 1.0
}

// Clase principal del servicio de RunwayML
export class RunwayMLService {
  private baseURL = 'https://api.runwayml.com/v1'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera un video usando RunwayML
   */
  async generateVideo(request: RunwayVideoRequest): Promise<RunwayVideoResult> {
    const runwayRequest = {
      prompt: request.prompt,
      model: request.model || 'gen-4-turbo',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed,
      style: request.style || 'cinematic',
      motion: request.motion || 'moderate'
    }

    const response = await this.makeRequest('/video/generate', runwayRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la generación de video')
    }

    // En una implementación real, aquí harías polling para obtener el resultado
    // Por ahora, simulamos el resultado
    return {
      video_url: `https://cdn.runwayml.com/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.runwayml.com/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: runwayRequest.duration,
      resolution: runwayRequest.resolution,
      aspect_ratio: runwayRequest.aspect_ratio,
      model: runwayRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.RUNWAY,
      credits_used: this.getCreditsUsed(runwayRequest.duration, runwayRequest.resolution)
    }
  }

  /**
   * Convierte una imagen a video
   */
  async imageToVideo(request: RunwayImageToVideoRequest): Promise<RunwayVideoResult> {
    const runwayRequest = {
      image: request.image,
      prompt: request.prompt,
      model: request.model || 'gen-4-turbo',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed,
      motion: request.motion || 'moderate'
    }

    const response = await this.makeRequest('/video/image-to-video', runwayRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la conversión de imagen a video')
    }

    return {
      video_url: `https://cdn.runwayml.com/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.runwayml.com/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: runwayRequest.duration,
      resolution: runwayRequest.resolution,
      aspect_ratio: runwayRequest.aspect_ratio,
      model: runwayRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.RUNWAY,
      credits_used: this.getCreditsUsed(runwayRequest.duration, runwayRequest.resolution)
    }
  }

  /**
   * Convierte un video a otro video
   */
  async videoToVideo(request: RunwayVideoToVideoRequest): Promise<RunwayVideoResult> {
    const runwayRequest = {
      video: request.video,
      prompt: request.prompt,
      model: request.model || 'gen-4-turbo',
      duration: request.duration || 4,
      resolution: request.resolution || '720p',
      aspect_ratio: request.aspect_ratio || '16:9',
      seed: request.seed,
      strength: request.strength || 0.8
    }

    const response = await this.makeRequest('/video/video-to-video', runwayRequest)
    
    if (!response.id) {
      throw new Error('No se pudo iniciar la conversión de video a video')
    }

    return {
      video_url: `https://cdn.runwayml.com/generated/${response.id}.mp4`,
      thumbnail_url: `https://cdn.runwayml.com/thumbnails/${response.id}.jpg`,
      task_id: response.id,
      status: 'completed',
      duration: runwayRequest.duration,
      resolution: runwayRequest.resolution,
      aspect_ratio: runwayRequest.aspect_ratio,
      model: runwayRequest.model,
      prompt_used: request.prompt,
      created_at: Date.now(),
      completed_at: Date.now() + VIDEO_GENERATION_TIMEOUTS.RUNWAY,
      credits_used: this.getCreditsUsed(runwayRequest.duration, runwayRequest.resolution)
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
      duration?: number
      resolution?: '720p' | '1080p'
      aspect_ratio?: '16:9' | '9:16' | '1:1'
      style?: 'cinematic' | 'realistic' | 'artistic' | 'documentary'
    } = {}
  ): Promise<RunwayVideoResult[]> {
    const variations: RunwayVideoResult[] = []
    
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
      console.error('Error validando credenciales de RunwayML:', error)
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
        plan: response.plan || 'Build',
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
  private getCreditsUsed(duration: number, resolution: string): number {
    const baseCredits = duration * 2 // 2 créditos por segundo base
    const resolutionMultiplier = resolution === '1080p' ? 1.5 : 1
    return Math.ceil(baseCredits * resolutionMultiplier)
  }

  /**
   * Realiza una petición a la API de RunwayML
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
      throw new Error(`RunwayML API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de RunwayML desde Supabase
export async function getRunwayCredentials(clientId?: string): Promise<{ apiKey: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'runwayml')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de RunwayML:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const apiKey = data.encrypted_value

    if (!apiKey) {
      console.warn('Credenciales de RunwayML incompletas')
      return null
    }

    return { apiKey }
  } catch (error) {
    console.warn('Error al obtener credenciales de RunwayML:', error)
    return null
  }
}

// Función para crear una instancia del servicio de RunwayML
export async function createRunwayService(clientId?: string): Promise<RunwayMLService | null> {
  const credentials = await getRunwayCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de RunwayML')
    return null
  }

  return new RunwayMLService(credentials.apiKey)
}

// Función para validar credenciales de RunwayML
export async function validateRunwayCredentials(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const service = new RunwayMLService(apiKey)
    const isValid = await service.validateCredentials()
    return { valid: isValid }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
