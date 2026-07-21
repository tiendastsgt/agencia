/**
 * Stability AI API Service
 * Implementación completa de la API de Stability AI v2beta para MarketPro GT
 * Basado en: mejoras/media/stability_api.json
 */

import { supabase } from './supabase'






// Tipos para la API de Stability AI
export interface StabilityImageRequest {
  prompt: string
  negative_prompt?: string
  aspect_ratio?: '16:9' | '1:1' | '21:9' | '2:3' | '3:2' | '4:5' | '5:4' | '9:16' | '9:21'
  seed?: number
  output_format?: 'jpeg' | 'png' | 'webp'
  style_preset?: '3d-model' | 'analog-film' | 'anime' | 'cinematic' | 'comic-book' | 'digital-art' | 'enhance' | 'fantasy-art' | 'isometric' | 'line-art' | 'low-poly' | 'modeling-compound' | 'neon-punk' | 'origami' | 'photographic' | 'pixel-art' | 'tile-texture'
  model?: 'stable-image-ultra' | 'stable-image-core' | 'sd3.5-large' | 'sd3.5-large-turbo' | 'sd3.5-medium' | 'sd3.5-flash'
}

export interface StabilityImageResponse {
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: 'SUCCESS' | 'CONTENT_FILTERED' | 'ERROR'
  }>
}

export interface StabilityImageResult {
  image_url: string
  image_base64: string
  seed: number
  finish_reason: string
  model: string
  style_preset?: string
  aspect_ratio: string
  output_format: string
  credits_used: number
}

export interface StabilityUpscaleRequest {
  image: string // Base64 encoded image
  output_format?: 'jpeg' | 'png' | 'webp'
  type?: 'fast' | 'conservative' | 'creative'
  prompt?: string // Required for creative upscaler
}

export interface StabilityEditRequest {
  image: string // Base64 encoded image
  prompt: string
  mask?: string // Base64 encoded mask
  negative_prompt?: string
  strength?: number
  seed?: number
  output_format?: 'jpeg' | 'png' | 'webp'
  style_preset?: string
}

// Clase principal del servicio de Stability AI
export class StabilityAIService {
  private baseURL = 'https://api.stability.ai/v2beta'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera una imagen usando Stability AI
   */
  async generateImage(request: StabilityImageRequest): Promise<StabilityImageResult> {
    const stabilityRequest = {
      text_prompts: [
        {
          text: request.prompt,
          weight: 1
        }
      ],
      negative_prompt: request.negative_prompt,
      aspect_ratio: request.aspect_ratio || '1:1',
      seed: request.seed || 0,
      output_format: request.output_format || 'png',
      style_preset: request.style_preset,
      model: request.model || 'stable-image-ultra'
    }

    const response = await this.makeRequest('/stable-image/generate/core', stabilityRequest)
    
    if (!response.artifacts || response.artifacts.length === 0) {
      throw new Error('No se pudo generar la imagen')
    }

    const artifact = response.artifacts[0]
    const imageUrl = `data:image/${request.output_format || 'png'};base64,${artifact.base64}`

    return {
      image_url: imageUrl,
      image_base64: artifact.base64,
      seed: artifact.seed,
      finish_reason: artifact.finishReason,
      model: request.model || 'stable-image-ultra',
      style_preset: request.style_preset,
      aspect_ratio: request.aspect_ratio || '1:1',
      output_format: request.output_format || 'png',
      credits_used: this.getCreditsUsed(request.model || 'stable-image-ultra')
    }
  }

  /**
   * Genera múltiples variaciones de una imagen
   */
  async generateVariations(
    prompt: string, 
    count: number = 4,
    options: {
      model?: 'stable-image-ultra' | 'stable-image-core' | 'sd3.5-large' | 'sd3.5-large-turbo' | 'sd3.5-medium' | 'sd3.5-flash'
      aspect_ratio?: '16:9' | '1:1' | '21:9' | '2:3' | '3:2' | '4:5' | '5:4' | '9:16' | '9:21'
      style_preset?: string
    } = {}
  ): Promise<StabilityImageResult[]> {
    const variations: StabilityImageResult[] = []
    
    for (let i = 0; i < count; i++) {
      const result = await this.generateImage({
        prompt: `${prompt} (variation ${i + 1})`,
        seed: Math.floor(Math.random() * 1000000),
        ...options
      })
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Escala una imagen usando Stability AI
   */
  async upscaleImage(request: StabilityUpscaleRequest): Promise<{
    image_url: string
    image_base64: string
    credits_used: number
  }> {
    const endpoint = request.type === 'creative' ? '/image-to-image/upscale' : '/image-to-image/upscale'
    
    const upscaleRequest = {
      image: request.image,
      output_format: request.output_format || 'png',
      ...(request.type === 'creative' && request.prompt ? { prompt: request.prompt } : {})
    }

    const response = await this.makeRequest(endpoint, upscaleRequest)
    
    if (!response.artifacts || response.artifacts.length === 0) {
      throw new Error('No se pudo escalar la imagen')
    }

    const artifact = response.artifacts[0]
    const imageUrl = `data:image/${request.output_format || 'png'};base64,${artifact.base64}`

    return {
      image_url: imageUrl,
      image_base64: artifact.base64,
      credits_used: this.getUpscaleCreditsUsed(request.type || 'fast')
    }
  }

  /**
   * Edita una imagen usando inpainting
   */
  async editImage(request: StabilityEditRequest): Promise<StabilityImageResult> {
    const editRequest = {
      image: request.image,
      mask: request.mask,
      text_prompts: [
        {
          text: request.prompt,
          weight: 1
        }
      ],
      negative_prompt: request.negative_prompt,
      strength: request.strength || 0.8,
      seed: request.seed || 0,
      output_format: request.output_format || 'png',
      style_preset: request.style_preset
    }

    const response = await this.makeRequest('/image-to-image/inpaint', editRequest)
    
    if (!response.artifacts || response.artifacts.length === 0) {
      throw new Error('No se pudo editar la imagen')
    }

    const artifact = response.artifacts[0]
    const imageUrl = `data:image/${request.output_format || 'png'};base64,${artifact.base64}`

    return {
      image_url: imageUrl,
      image_base64: artifact.base64,
      seed: artifact.seed,
      finish_reason: artifact.finishReason,
      model: 'stable-image-ultra',
      style_preset: request.style_preset,
      aspect_ratio: '1:1',
      output_format: request.output_format || 'png',
      credits_used: 5 // Inpaint costs 5 credits
    }
  }

  /**
   * Elimina el fondo de una imagen
   */
  async removeBackground(image: string): Promise<{
    image_url: string
    image_base64: string
    credits_used: number
  }> {
    const response = await this.makeRequest('/image-to-image/remove-background', {
      image: image,
      output_format: 'png'
    })
    
    if (!response.artifacts || response.artifacts.length === 0) {
      throw new Error('No se pudo eliminar el fondo')
    }

    const artifact = response.artifacts[0]
    const imageUrl = `data:image/png;base64,${artifact.base64}`

    return {
      image_url: imageUrl,
      image_base64: artifact.base64,
      credits_used: 5 // Remove background costs 5 credits
    }
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/user/account', {})
      return !!response
    } catch (error) {
      console.error('Error validando credenciales de Stability AI:', error)
      return false
    }
  }

  /**
   * Obtiene información de la cuenta
   */
  async getAccountInfo(): Promise<{
    credits: number
    usage: any
  }> {
    try {
      const response = await this.makeRequest('/user/account', {})
      return {
        credits: response.credits || 0,
        usage: response
      }
    } catch (error) {
      console.error('Error obteniendo información de cuenta:', error)
      return {
        credits: 0,
        usage: {}
      }
    }
  }

  /**
   * Obtiene el costo en créditos para un modelo
   */
  private getCreditsUsed(model: string): number {
    const creditsMap: Record<string, number> = {
      'stable-image-ultra': 8,
      'stable-image-core': 3,
      'sd3.5-large': 6.5,
      'sd3.5-large-turbo': 4,
      'sd3.5-medium': 3.5,
      'sd3.5-flash': 2.5
    }
    return creditsMap[model] || 8
  }

  /**
   * Obtiene el costo en créditos para upscaling
   */
  private getUpscaleCreditsUsed(type: string): number {
    const creditsMap: Record<string, number> = {
      'fast': 2,
      'conservative': 40,
      'creative': 60
    }
    return creditsMap[type] || 2
  }

  /**
   * Realiza una petición a la API de Stability AI
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
      throw new Error(`Stability AI API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de Stability AI desde Supabase
export async function getStabilityCredentials(clientId?: string): Promise<{ apiKey: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'stability_ai')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de Stability AI:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const apiKey = data.encrypted_value

    if (!apiKey) {
      console.warn('Credenciales de Stability AI incompletas')
      return null
    }

    return { apiKey }
  } catch (error) {
    console.warn('Error al obtener credenciales de Stability AI:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Stability AI
export async function createStabilityService(clientId?: string): Promise<StabilityAIService | null> {
  const credentials = await getStabilityCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de Stability AI')
    return null
  }

  return new StabilityAIService(credentials.apiKey)
}

// Función para validar credenciales de Stability AI
export async function validateStabilityCredentials(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const service = new StabilityAIService(apiKey)
    const isValid = await service.validateCredentials()
    return { valid: isValid }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
