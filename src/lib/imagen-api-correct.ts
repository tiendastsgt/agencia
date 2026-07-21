/**
 * Google Imagen API Service - Implementación Correcta
 * Basado en: Technical Guide: Programmatic Generation of Visually Consistent Infographics with the Google Imagen API
 * 
 * El documento explica claramente que:
 * - Gemini models son para conversaciones multimodales
 * - Imagen models son para generación de imágenes de alta calidad
 * - Se debe usar Imagen 4 Model con google-genai SDK
 */

import { supabase } from './supabase'

// Tipos para la API de Imagen según el documento
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
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta'

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
   * Genera una imagen usando Imagen 4 Model según el documento
   */
  async generateImage(request: ImagenGenerationRequest): Promise<ImagenResult> {
    const prompt = this.buildImagePrompt(request.prompt, request.style, request.aspect_ratio)
    
    // Usar estructura de Gemini 2.5 Flash Image
    const imagenRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }

    try {
        model: 'gemini-2.5-flash-image-preview',
        prompt: prompt.substring(0, 100) + '...',
        hasApiKey: !!this.apiKey
      })

      const response = await this.makeRequest('/models/gemini-2.5-flash-image-preview:generateContent', imagenRequest)
      
        hasCandidates: !!response.candidates,
        candidatesCount: response.candidates?.length || 0
      })

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No se pudo generar la imagen - respuesta vacía')
      }

      const candidate = response.candidates[0]
      const imagePart = candidate.content.parts.find((part: any) => part.inlineData)
      
      if (!imagePart || !imagePart.inlineData) {
        throw new Error('No se encontró imagen en la respuesta')
      }
      
      // Convertir a data URL
      const imageBase64 = imagePart.inlineData.data;
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imageBase64}`
      
      // Obtener dimensiones
      const dimensions = this.getImageDimensions(request.aspect_ratio || '16:9')

        mimeType: 'image/png',
        dataLength: imageBase64.length,
        dimensions: dimensions
      })

      return {
        image_url: imageUrl,
        image_base64: imageBase64,
        mime_type: 'image/png',
        width: dimensions.width,
        height: dimensions.height,
        prompt_used: prompt,
        style: request.style || 'photographic',
        model: 'gemini-2.5-flash-image-preview',
        revised_prompt: prompt,
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error generando imagen con Imagen API:', error)
      throw error
    }
  }

  /**
   * Construye un prompt optimizado según el documento
   * El documento menciona "Base Style Prompt" architecture
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

    // Según el documento: "Base Style Prompt" + "Course-Specific Subject Prompt"
    return `${prompt}, ${stylePrompt}${aspectPrompt ? `, ${aspectPrompt}` : ''}, high resolution, detailed, professional quality, no text, no watermarks`
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
   * Según el documento, usar el endpoint correcto de Imagen API
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}`
    
      model: data.model,
      promptLength: data.prompt.length,
      config: data.config
    })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error en la petición a Imagen API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Imagen API Error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return result
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
      const testRequest = {
        contents: [
          {
            parts: [
              {
                text: "a small red square"
              }
            ]
          }
        ]
      }
      
      await this.makeRequest('/models/gemini-2.5-flash-image-preview:generateContent', testRequest)
      return true
    } catch (error) {
      console.error('Error validando credenciales de Imagen API:', error)
      return false
    }
  }
}

export const imagenAPIService = ImagenAPIService.getInstance()
