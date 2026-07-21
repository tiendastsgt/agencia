/**
 * Google Imagen API Service
 * Implementación completa de la API de Imagen 4.0 para MarketPro GT
 * Basado en: https://ai.google.dev/gemini-api/docs/imagen
 */

import { supabase } from './supabase'

// Tipos para la API de Imagen
export interface ImagenRequest {
  model: string
  prompt: string
  config: ImagenConfig
}

export interface ImagenConfig {
  number_of_images: number
  aspect_ratio: '1:1' | '4:3' | '3:4' | '16:9' | '9:16'
  negative_prompt?: string
  person_generation?: 'dont_allow' | 'allow_adult'
}

export interface ImagenResult {
  image_url: string
  image_base64: string
  mime_type: string
  width: number
  height: number
  prompt_used: string
  style: string
  model: string
  revised_prompt?: string
  created_at: string
}

export interface ImagenGenerationRequest {
  prompt: string
  style?: string
  aspect_ratio?: string
  negative_prompt?: string
  person_generation?: boolean
}

class ImagenAPIService {
  private static instance: ImagenAPIService
  private apiKey: string
  private baseUrl: string = 'https://us-central1-aiplatform.googleapis.com/v1'

  private constructor() {
    this.apiKey = this.getAPIKey()
  }

  public static getInstance(): ImagenAPIService {
    if (!ImagenAPIService.instance) {
      ImagenAPIService.instance = new ImagenAPIService()
    }
    return ImagenAPIService.instance
  }

  private getAPIKey(): string {
    // Obtener API key de las variables de entorno
    if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_GEMINI_API_KEY || ''
    }
    return ''
  }

  /**
   * Genera una imagen usando Imagen 4.0
   */
  async generateImage(request: ImagenGenerationRequest): Promise<ImagenResult> {
    const prompt = this.buildImagePrompt(request.prompt, request.style, request.aspect_ratio)
    
    const imagenRequest: ImagenRequest = {
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        number_of_images: 1,
        aspect_ratio: (request.aspect_ratio as any) || '16:9',
        negative_prompt: request.negative_prompt || 'text, words, letters, watermark, blurry, ugly, deformed, signature, low quality',
        person_generation: request.person_generation ? 'allow_adult' : 'dont_allow'
      }
    }

    try {
      const response = await this.makeRequest('/models/imagen-4.0-generate-001:generateImages', imagenRequest)
      
      if (!response.generated_images || response.generated_images.length === 0) {
        throw new Error('No se pudo generar la imagen')
      }

      const generatedImage = response.generated_images[0]
      
      // Convertir a data URL
      const imageUrl = `data:image/png;base64,${generatedImage.image.data}`
      
      // Obtener dimensiones
      const dimensions = this.getImageDimensions(request.aspect_ratio || '16:9')

      return {
        image_url: imageUrl,
        image_base64: generatedImage.image.data,
        mime_type: 'image/png',
        width: dimensions.width,
        height: dimensions.height,
        prompt_used: prompt,
        style: request.style || 'photographic',
        model: 'imagen-4.0-generate-001',
        revised_prompt: prompt,
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error generando imagen con Imagen API:', error)
      throw error
    }
  }

  /**
   * Construye un prompt optimizado para generación de imágenes
   */
  private buildImagePrompt(prompt: string, style?: string, aspectRatio?: string): string {
    const stylePrompts = {
      photographic: 'high-quality photograph, professional photography, realistic, detailed, sharp focus',
      artistic: 'artistic style, creative composition, expressive, artistic interpretation',
      minimalist: 'minimalist design, clean composition, simple, elegant, uncluttered',
      vintage: 'vintage style, retro aesthetic, classic, timeless, nostalgic',
      modern: 'modern design, contemporary style, sleek, clean, futuristic',
      abstract: 'abstract art, creative interpretation, artistic, non-representational',
      infographic: 'professional infographic style, clean lines, data visualization theme, modern design'
    }

    const aspectRatioPrompts = {
      '1:1': 'square composition, balanced framing',
      '16:9': 'wide landscape format, cinematic composition',
      '9:16': 'vertical portrait format, mobile-friendly composition',
      '4:3': 'classic photography ratio, traditional framing',
      '3:4': 'portrait orientation, vertical composition'
    }

    const stylePrompt = style ? stylePrompts[style] || stylePrompts.infographic : stylePrompts.infographic
    const aspectPrompt = aspectRatio ? aspectRatioPrompts[aspectRatio] || '' : ''

    return `${prompt}, ${stylePrompt}${aspectPrompt ? `, ${aspectPrompt}` : ''}, high resolution, detailed, professional quality`
  }

  /**
   * Obtiene las dimensiones de la imagen basadas en el aspect ratio
   */
  private getImageDimensions(aspectRatio: string): { width: number; height: number } {
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1792, height: 1024 },
      '9:16': { width: 1024, height: 1792 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 }
    }
    return dimensions[aspectRatio] || dimensions['16:9']
  }

  /**
   * Realiza una petición HTTP a la API de Imagen
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    // Para Vertex AI, necesitamos usar un endpoint diferente
    const projectId = 'your-project-id' // Esto debería venir de configuración
    const location = 'us-central1'
    const url = `${this.baseUrl}/projects/${projectId}/locations/${location}/publishers/google/models/imagen-4.0-generate-001:generateImages`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false
      }
      
      // Hacer una petición de prueba
      await this.makeRequest('/models', {})
      return true
    } catch (error) {
      console.error('Error validando credenciales de Imagen API:', error)
      return false
    }
  }
}

export const imagenAPIService = ImagenAPIService.getInstance()
