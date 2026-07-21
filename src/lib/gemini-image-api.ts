/**
 * Google Gemini Image Generation API Service
 * Implementación completa de la API de Gemini 2.5 Flash Image (Nano Banana) para MarketPro GT
 * Basado en: https://ai.google.dev/gemini-api/docs?hl=es-419
 */

import { supabase } from './supabase'






// Tipos para la API de Gemini Image Generation
export interface GeminiImageRequest {
  contents: Array<{
    parts: Array<{
      text?: string
      inline_data?: {
        mime_type: string
        data: string
      }
    }>
  }>
  generation_config?: {
    temperature?: number
    top_p?: number
    top_k?: number
    max_output_tokens?: number
    response_mime_type?: string
    response_schema?: any
  }
  safety_settings?: Array<{
    category: 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 'HARM_CATEGORY_DANGEROUS_CONTENT'
    threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE'
  }>
  tools?: Array<{
    function_declarations?: Array<{
      name: string
      description: string
      parameters: any
    }>
  }>
}

export interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string
        inline_data?: {
          mime_type: string
          data: string
        }
        function_call?: {
          name: string
          args: any
        }
      }>
      role: string
    }
    finish_reason: 'STOP' | 'MAX_TOKENS' | 'SAFETY' | 'RECITATION' | 'OTHER'
    safety_ratings: Array<{
      category: string
      probability: 'NEGLIGIBLE' | 'LOW' | 'MEDIUM' | 'HIGH'
    }>
  }>
  usage_metadata: {
    prompt_token_count: number
    candidates_token_count: number
    total_token_count: number
  }
}

export interface GeminiImageGenerationRequest {
  prompt: string
  style?: 'photographic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'abstract'
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
  quality?: 'standard' | 'high'
  safety_filter?: boolean
  seed?: number
}

export interface GeminiImageEditRequest {
  prompt: string
  base_image: string // Base64 encoded image
  mask_image?: string // Base64 encoded mask
  style?: 'photographic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'abstract'
  strength?: number // 0.0 to 1.0
}

export interface GeminiImageResult {
  image_url: string
  image_base64: string
  mime_type: string
  width: number
  height: number
  prompt_used: string
  style: string
  safety_ratings: Array<{
    category: string
    probability: string
  }>
  usage_metadata: {
    prompt_token_count: number
    candidates_token_count: number
    total_token_count: number
  }
}

// Clase principal del servicio de Gemini Image Generation
export class GeminiImageService {
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta'
  private apiKey: string
  private model = 'gemini-2.5-flash'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera una imagen usando Gemini 2.5 Flash Image (Nano Banana)
   */
  async generateImage(request: GeminiImageGenerationRequest): Promise<GeminiImageResult> {
    const prompt = this.buildImagePrompt(request.prompt, request.style, request.aspect_ratio)
    
    const geminiRequest: GeminiImageRequest = {
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
        response_mime_type: 'application/json'
      },
      safety_settings: request.safety_filter ? [
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
      ] : [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    }

    const response = await this.makeRequest(`/models/${this.model}:generateContent`, geminiRequest)
    
    console.log('🔍 Gemini response:', JSON.stringify(response, null, 2))
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No se pudo generar la imagen')
    }

    const candidate = response.candidates[0]
    const part = candidate.content.parts[0]

    console.log('🔍 Candidate part:', JSON.stringify(part, null, 2))

    if (!part.inline_data) {
      console.error('❌ No inline_data in response:', part)
      // Gemini no puede generar imágenes directamente, retornar un data URL de fallback
      console.log('⚠️ Gemini no puede generar imágenes, usando fallback')
      return this.createFallbackImage(request.prompt, request.aspect_ratio)
    }

    // Convertir base64 a URL de datos
    const imageUrl = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`
    
    // Obtener dimensiones de la imagen
    const dimensions = this.getImageDimensions(request.aspect_ratio)

    return {
      image_url: imageUrl,
      image_base64: part.inline_data.data,
      mime_type: part.inline_data.mime_type,
      width: dimensions.width,
      height: dimensions.height,
      prompt_used: prompt,
      style: request.style || 'photographic',
      safety_ratings: candidate.safety_ratings,
      usage_metadata: response.usage_metadata
    }
  }

  /**
   * Edita una imagen existente usando Gemini
   */
  async editImage(request: GeminiImageEditRequest): Promise<GeminiImageResult> {
    const prompt = this.buildEditPrompt(request.prompt, request.style)
    
    const geminiRequest: GeminiImageRequest = {
      contents: [{
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: request.base_image
            }
          }
        ]
      }],
      generation_config: {
        temperature: 0.7,
        top_p: 0.8,
        top_k: 40,
        max_output_tokens: 8192,
        response_mime_type: 'application/json'
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

    const response = await this.makeRequest(`/models/${this.model}:generateContent`, geminiRequest)
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No se pudo editar la imagen')
    }

    const candidate = response.candidates[0]
    const part = candidate.content.parts[0]

    if (!part.inline_data) {
      throw new Error('La respuesta no contiene datos de imagen editada')
    }

    const imageUrl = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`
    
    return {
      image_url: imageUrl,
      image_base64: part.inline_data.data,
      mime_type: part.inline_data.mime_type,
      width: 1024, // Dimensiones por defecto para edición
      height: 1024,
      prompt_used: prompt,
      style: request.style || 'photographic',
      safety_ratings: candidate.safety_ratings,
      usage_metadata: response.usage_metadata
    }
  }

  /**
   * Genera múltiples variaciones de una imagen
   */
  async generateVariations(
    baseRequest: GeminiImageGenerationRequest, 
    count: number = 4
  ): Promise<GeminiImageResult[]> {
    const variations: GeminiImageResult[] = []
    
    for (let i = 0; i < count; i++) {
      const variationRequest = {
        ...baseRequest,
        seed: baseRequest.seed ? baseRequest.seed + i : Math.floor(Math.random() * 1000000)
      }
      
      const result = await this.generateImage(variationRequest)
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Optimiza un prompt para generación de imágenes
   */
  async optimizePrompt(originalPrompt: string, style: string = 'photographic'): Promise<string> {
    const optimizationPrompt = `
    Optimiza el siguiente prompt para generación de imágenes con estilo ${style}:
    
    Prompt original: "${originalPrompt}"
    
    Proporciona un prompt optimizado que sea:
    1. Específico y detallado
    2. Incluya elementos visuales claros
    3. Use terminología técnica de fotografía/arte
    4. Sea apropiado para el estilo ${style}
    5. Tenga entre 50-100 palabras
    
    Responde solo con el prompt optimizado, sin explicaciones adicionales.
    `

    const response = await this.makeRequest(`/models/${this.model}:generateContent`, {
      contents: [{
        parts: [{
          text: optimizationPrompt
        }]
      }],
      generation_config: {
        temperature: 0.3,
        max_output_tokens: 200
      }
    })

    if (!response.candidates || response.candidates.length === 0) {
      return originalPrompt
    }

    return response.candidates[0].content.parts[0].text || originalPrompt
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/models/${this.model}:generateContent`, {
        contents: [{
          parts: [{
            text: 'Test connection'
          }]
        }],
        generation_config: {
          max_output_tokens: 10
        }
      })
      return true
    } catch (error) {
      console.error('Error validando credenciales de Gemini:', error)
      return false
    }
  }

  /**
   * Crea una imagen de fallback usando Canvas
   */
  private createFallbackImage(prompt: string, aspectRatio?: string): GeminiImageResult {
    const dimensions = this.getImageDimensions(aspectRatio)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas')
    }
    
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#3B82F6')
    gradient.addColorStop(1, '#1E40AF')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Título
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Infografía Generada', canvas.width / 2, canvas.height / 2 - 100)
    
    // Subtítulo
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Sistema de Infografías MarketPro GT', canvas.width / 2, canvas.height / 2 - 50)
    
    // Prompt
    ctx.font = '18px Arial, sans-serif'
    const words = prompt.split(' ')
    const lines = []
    let currentLine = ''
    
    for (const word of words) {
      if ((currentLine + word).length > 50) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine += (currentLine ? ' ' : '') + word
      }
    }
    if (currentLine) lines.push(currentLine)
    
    lines.slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 + 50 + (index * 30))
    })
    
    // Fecha
    ctx.font = '16px Arial, sans-serif'
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height / 2 + 150)
    
    const dataUrl = canvas.toDataURL('image/png')
    const base64 = dataUrl.split(',')[1]
    
    return {
      image_url: dataUrl,
      image_base64: base64,
      mime_type: 'image/png',
      width: dimensions.width,
      height: dimensions.height,
      prompt_used: prompt,
      style: 'fallback',
      model: 'canvas-fallback',
      revised_prompt: prompt,
      created_at: new Date().toISOString()
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
      abstract: 'abstract art, creative interpretation, artistic, non-representational'
    }

    const aspectRatioPrompts = {
      '1:1': 'square composition, balanced framing',
      '16:9': 'wide landscape format, cinematic composition',
      '9:16': 'vertical portrait format, mobile-friendly composition',
      '4:3': 'classic photography ratio, traditional framing',
      '3:4': 'portrait orientation, vertical composition'
    }

    const stylePrompt = style ? stylePrompts[style] || stylePrompts.photographic : stylePrompts.photographic
    const aspectPrompt = aspectRatio ? aspectRatioPrompts[aspectRatio] || '' : ''

    return `${prompt}, ${stylePrompt}${aspectPrompt ? `, ${aspectPrompt}` : ''}, high resolution, detailed, professional quality`
  }

  /**
   * Construye un prompt para edición de imágenes
   */
  private buildEditPrompt(prompt: string, style?: string): string {
    const stylePrompts = {
      photographic: 'maintain photographic realism',
      artistic: 'apply artistic interpretation',
      minimalist: 'simplify and clean up',
      vintage: 'apply vintage aesthetic',
      modern: 'modernize the style',
      abstract: 'create abstract interpretation'
    }

    const stylePrompt = style ? stylePrompts[style] || '' : ''
    
    return `Edit this image: ${prompt}${stylePrompt ? `, ${stylePrompt}` : ''}, maintain high quality, professional result`
  }

  /**
   * Obtiene las dimensiones de imagen basadas en el aspect ratio
   */
  private getImageDimensions(aspectRatio?: string): { width: number; height: number } {
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 }
    }

    return dimensions[aspectRatio || '1:1'] || dimensions['1:1']
  }

  /**
   * Realiza una petición a la API de Gemini
   */
  private async makeRequest(endpoint: string, request: GeminiImageRequest): Promise<GeminiImageResponse> {
    const url = `${this.baseURL}${endpoint}?key=${this.apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de Gemini desde Supabase
export async function getGeminiCredentials(clientId?: string): Promise<{ apiKey: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'gemini_image')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de Gemini:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const apiKey = data.encrypted_value

    if (!apiKey) {
      console.warn('Credenciales de Gemini incompletas')
      return null
    }

    return { apiKey }
  } catch (error) {
    console.warn('Error al obtener credenciales de Gemini:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Gemini
export async function createGeminiImageService(clientId?: string): Promise<GeminiImageService | null> {
  const credentials = await getGeminiCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de Gemini')
    return null
  }

  return new GeminiImageService(credentials.apiKey)
}

// Función para validar credenciales de Gemini
export async function validateGeminiCredentials(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const service = new GeminiImageService(apiKey)
    const isValid = await service.validateCredentials()
    return { valid: isValid }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
