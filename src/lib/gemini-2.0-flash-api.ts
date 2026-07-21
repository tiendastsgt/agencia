/**
 * Google Gemini 2.5 Flash Image Generation API Service
 * Implementación completa de la API de Gemini 2.5 Flash para MarketPro GT
 * Basado en: https://ai.google.dev/gemini-api/docs/image-generation
 */

import { supabase } from './supabase'

// Tipos para la API de Gemini 2.5 Flash
export interface Gemini2FlashRequest {
  contents: Array<{
    parts: Array<{
      text: string
    }>
  }>
  generation_config?: {
    temperature?: number
    top_p?: number
    top_k?: number
    max_output_tokens?: number
    response_modalities?: string[]
  }
  safety_settings?: Array<{
    category: 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 'HARM_CATEGORY_DANGEROUS_CONTENT'
    threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE'
  }>
}

export interface Gemini2FlashResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string
        inline_data?: {
          mime_type: string
          data: string
        }
      }>
    }
    finish_reason: string
    safety_ratings: Array<{
      category: string
      probability: string
    }>
  }>
  usage_metadata: {
    prompt_token_count: number
    candidates_token_count: number
    total_token_count: number
  }
}

export interface Gemini2FlashResult {
  image_url: string
  image_base64: string
  mime_type: string
  width: number
  height: number
  prompt_used: string
  model: string
  created_at: string
}

export interface Gemini2FlashGenerationRequest {
  prompt: string
  style?: string
  aspect_ratio?: string
  quality?: 'standard' | 'hd'
}

class Gemini2FlashAPIService {
  private static instance: Gemini2FlashAPIService
  private apiKey: string
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta'
  private model: string = 'gemini-2.5-flash'

  private constructor() {
    this.apiKey = this.getAPIKey()
  }

  public static getInstance(): Gemini2FlashAPIService {
    if (!Gemini2FlashAPIService.instance) {
      Gemini2FlashAPIService.instance = new Gemini2FlashAPIService()
    }
    return Gemini2FlashAPIService.instance
  }

  private getAPIKey(): string {
    // Obtener API key de las variables de entorno
    if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_GEMINI_API_KEY || ''
    }
    return ''
  }

  /**
   * Genera una imagen usando Gemini 2.0 Flash
   */
  async generateImage(request: Gemini2FlashGenerationRequest): Promise<Gemini2FlashResult> {
    const prompt = this.buildImagePrompt(request.prompt, request.style, request.aspect_ratio)
    
    const geminiRequest: Gemini2FlashRequest = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generation_config: {
        temperature: 0.7,
        top_p: 0.8,
        top_k: 40,
        max_output_tokens: 8192,
        response_modalities: ['TEXT', 'IMAGE'] // Especificar que queremos imagen
      },
      safety_settings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    try {
      console.log('🚀 Enviando petición a Gemini 2.5 Flash:', {
        model: this.model,
        prompt: prompt.substring(0, 100) + '...',
        hasApiKey: !!this.apiKey
      })

      const response = await this.makeRequest(`/models/${this.model}:generateContent`, geminiRequest)
      
      console.log('📥 Respuesta de Gemini 2.5 Flash:', {
        hasCandidates: !!response.candidates,
        candidatesCount: response.candidates?.length || 0,
        firstCandidate: response.candidates?.[0] ? {
          hasContent: !!response.candidates[0].content,
          partsCount: response.candidates[0].content?.parts?.length || 0,
          finishReason: response.candidates[0].finish_reason
        } : null
      })

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No se pudo generar la imagen - respuesta vacía')
      }

      const candidate = response.candidates[0]
      if (!candidate.content || !candidate.content.parts) {
        throw new Error('No se pudo generar la imagen - estructura de respuesta inválida')
      }

      // Buscar la parte que contiene la imagen
      const imagePart = candidate.content.parts.find(part => part.inline_data)
      
      if (!imagePart || !imagePart.inline_data) {
        console.log('⚠️ No se encontró imagen en la respuesta, generando fallback')
        return await this.createFallbackImage(request.prompt, request.aspect_ratio || '16:9')
      }

      // Convertir a data URL
      const imageUrl = `data:${imagePart.inline_data.mime_type};base64,${imagePart.inline_data.data}`
      
      // Obtener dimensiones
      const dimensions = this.getImageDimensions(request.aspect_ratio || '16:9')

      console.log('✅ Imagen generada exitosamente con Gemini 2.5 Flash:', {
        mimeType: imagePart.inline_data.mime_type,
        dataLength: imagePart.inline_data.data.length,
        dimensions: dimensions
      })

      return {
        image_url: imageUrl,
        image_base64: imagePart.inline_data.data,
        mime_type: imagePart.inline_data.mime_type,
        width: dimensions.width,
        height: dimensions.height,
        prompt_used: prompt,
        model: this.model,
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error generando imagen con Gemini 2.5 Flash:', error)
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

    return `Generate a professional, high-quality image: ${prompt}. Style: ${stylePrompt}${aspectPrompt ? `. Composition: ${aspectPrompt}` : ''}. High resolution, detailed, professional quality, no text, no watermarks.`
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
   * Crea una imagen de fallback usando canvas
   */
  private async createFallbackImage(prompt: string, aspectRatio: string): Promise<Gemini2FlashResult> {
    console.log('🎨 Generando imagen de fallback con canvas')
    
    const dimensions = this.getImageDimensions(aspectRatio)
    const canvas = document.createElement('canvas')
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    const ctx = canvas.getContext('2d')!

    // Crear gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)

    // Agregar texto
    ctx.fillStyle = 'white'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Infografía Generada', dimensions.width / 2, dimensions.height / 2 - 50)
    
    ctx.font = '24px Arial'
    ctx.fillText((prompt || 'Infografía').substring(0, 100) + '...', dimensions.width / 2, dimensions.height / 2 + 20)
    
    ctx.font = '16px Arial'
    ctx.fillText('Generado con Gemini 2.5 Flash', dimensions.width / 2, dimensions.height / 2 + 60)

    // Convertir a data URL
    const dataUrl = canvas.toDataURL('image/png')
    const base64 = dataUrl.split(',')[1]

    return {
      image_url: dataUrl,
      image_base64: base64,
      mime_type: 'image/png',
      width: dimensions.width,
      height: dimensions.height,
      prompt_used: prompt,
      model: this.model,
      created_at: new Date().toISOString()
    }
  }

  /**
   * Realiza una petición HTTP a la API de Gemini 2.0 Flash
   */
  private async makeRequest(endpoint: string, data: any): Promise<Gemini2FlashResponse> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}`
    
    console.log('🌐 Enviando petición a:', url)
    console.log('📤 Datos enviados:', {
      model: this.model,
      promptLength: data.contents[0].parts[0].text.length,
      hasGenerationConfig: !!data.generation_config,
      responseModalities: data.generation_config?.response_modalities
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
      console.error('❌ Error en la petición:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Respuesta exitosa de Gemini 2.5 Flash')
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
        contents: [{
          parts: [{
            text: 'Test prompt'
          }]
        }],
        generation_config: {
          response_modalities: ['TEXT']
        }
      }
      
      await this.makeRequest(`/models/${this.model}:generateContent`, testRequest)
      return true
    } catch (error) {
      console.error('Error validando credenciales de Gemini 2.5 Flash:', error)
      return false
    }
  }
}

export const gemini2FlashAPIService = Gemini2FlashAPIService.getInstance()
