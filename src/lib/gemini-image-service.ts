import { supabase } from './supabase'

// Interfaces para Gemini Imagen
export interface GeminiImageRequest {
  prompt: string
  numberOfImages?: number
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
  sampleImageSize?: '1K' | '2K'
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all'
}

export interface GeminiImageResponse {
  generatedImages: {
    image: {
      imageBytes: string
    }
  }[]
}

export interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  imageBytes: string
  aspectRatio: string
  size: string
  timestamp: string
  campaignId?: string
}

export interface ImageGenerationStats {
  totalImages: number
  totalTokens: number
  averageGenerationTime: number
  successRate: number
}

export class GeminiImageService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ''
  }

  // Generar imágenes usando Gemini Imagen
  async generateImages(request: GeminiImageRequest): Promise<GeneratedImage[]> {
    try {
      if (!this.apiKey) {
        throw new Error('API key de Gemini no configurada')
      }

      const response = await fetch(
        `${this.baseUrl}/models/imagen-4.0-generate-001:predict`,
        {
          method: 'POST',
          headers: {
            'x-goog-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: request.prompt
              }
            ],
            parameters: {
              sampleCount: request.numberOfImages || 4,
              aspectRatio: request.aspectRatio || '1:1',
              sampleImageSize: request.sampleImageSize || '1K',
              personGeneration: request.personGeneration || 'allow_adult'
            }
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error de Gemini API: ${errorData.error?.message || 'Error desconocido'}`)
      }

      const data: GeminiImageResponse = await response.json()
      
      return data.generatedImages.map((img, index) => ({
        id: `gemini_${Date.now()}_${index}`,
        prompt: request.prompt,
        imageUrl: `data:image/png;base64,${img.image.imageBytes}`,
        imageBytes: img.image.imageBytes,
        aspectRatio: request.aspectRatio || '1:1',
        size: request.sampleImageSize || '1K',
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error generando imágenes con Gemini:', error)
      throw error
    }
  }

  // Crear prompt optimizado para Gemini Imagen usando técnicas avanzadas
  createOptimizedPrompt(
    subject: string,
    context: string,
    style: string,
    additionalDetails?: string[],
    targetAudience?: string,
    brandVoice?: string
  ): string {
    // Aplicar técnicas avanzadas de prompt engineering
    
    // 1. Estructura base (Subject + Context + Style)
    const promptParts = [
      // Subject (Asunto) - Lo más importante, con especificidad técnica
      `${subject}, professional product photography`,
      
      // Context (Contexto y fondo) con detalles emocionales
      `in ${context}, appealing to ${targetAudience || 'target audience'}`,
      
      // Style (Estilo) con modificadores de calidad
      `${style}, high quality, detailed, commercial photography`
    ]

    // 2. Agregar detalles técnicos específicos
    const technicalDetails = [
      'sharp focus',
      'perfect lighting',
      'professional composition',
      'clean background',
      'no text',
      'no watermarks',
      'commercial quality'
    ]

    // 3. Agregar contexto de marca si se proporciona
    if (brandVoice) {
      promptParts.push(`brand voice: ${brandVoice}`)
    }

    // 4. Agregar detalles adicionales personalizados
    if (additionalDetails && additionalDetails.length > 0) {
      promptParts.push(additionalDetails.join(', '))
    }

    // 5. Agregar modificadores de calidad finales
    promptParts.push(technicalDetails.join(', '))

    // 6. Aplicar EmotionPrompt technique
    const emotionalEnhancement = 'This image is crucial for brand recognition and customer engagement. The visual impact directly influences purchasing decisions.'

    // Unir todas las partes con estructura optimizada
    const basePrompt = promptParts.join(', ')
    
    return `${basePrompt}. ${emotionalEnhancement}`
  }

  // Generar prompt para marketing de productos usando técnicas avanzadas
  createMarketingPrompt(
    productName: string,
    productType: string,
    targetAudience: string,
    mood: string,
    setting: string,
    brandVoice?: string
  ): string {
    const subject = `${productName} ${productType}`
    const context = `in ${setting}`
    const style = `${mood} marketing photography, professional product shot, commercial style`
    
    // Aplicar técnicas avanzadas de prompt engineering
    return this.createOptimizedPrompt(
      subject, 
      context, 
      style, 
      [
        'clean background',
        'perfect lighting',
        'attractive composition',
        'brand-focused',
        'premium quality',
        'trustworthy appearance'
      ],
      targetAudience,
      brandVoice
    )
  }

  // Generar prompt para contenido social media
  createSocialMediaPrompt(
    content: string,
    platform: string,
    audience: string,
    style: string
  ): string {
    const subject = content
    const context = `for ${platform} social media, targeting ${audience}`
    const socialStyle = `${style} social media content, engaging visual, ${platform}-optimized`
    
    return this.createOptimizedPrompt(subject, context, socialStyle, [
      'eye-catching',
      'trendy',
      'shareable',
      'mobile-friendly'
    ])
  }

  // Generar prompt para branding
  createBrandingPrompt(
    brandName: string,
    industry: string,
    brandPersonality: string,
    colorScheme: string
  ): string {
    const subject = `${brandName} brand identity`
    const context = `in ${industry} industry, ${brandPersonality} personality`
    const style = `modern branding design, ${colorScheme} color palette, professional`
    
    return this.createOptimizedPrompt(subject, context, style, [
      'clean design',
      'memorable',
      'versatile',
      'timeless'
    ])
  }

  // Guardar imagen generada en la base de datos
  async saveGeneratedImage(image: GeneratedImage, campaignId?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('generated_images')
        .insert({
          prompt: image.prompt,
          image_url: image.imageUrl,
          image_bytes: image.imageBytes,
          aspect_ratio: image.aspectRatio,
          size: image.size,
          campaign_id: campaignId,
          created_at: image.timestamp
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error guardando imagen generada:', error)
      throw error
    }
  }

  // Obtener historial de imágenes generadas
  async getImageHistory(campaignId?: string, limit = 50): Promise<GeneratedImage[]> {
    try {
      let query = supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (campaignId) {
        query = query.eq('campaign_id', campaignId)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data?.map(record => ({
        id: record.id,
        prompt: record.prompt,
        imageUrl: record.image_url,
        imageBytes: record.image_bytes,
        aspectRatio: record.aspect_ratio,
        size: record.size,
        timestamp: record.created_at,
        campaignId: record.campaign_id
      })) || []
    } catch (error) {
      console.error('Error obteniendo historial de imágenes:', error)
      return []
    }
  }

  // Obtener estadísticas de generación
  async getGenerationStats(campaignId?: string): Promise<ImageGenerationStats> {
    try {
      let query = supabase
        .from('generated_images')
        .select('*')

      if (campaignId) {
        query = query.eq('campaign_id', campaignId)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      const totalImages = data?.length || 0
      const totalTokens = totalImages * 480 // Estimación basada en límite de tokens de Gemini
      const averageGenerationTime = 3.5 // Segundos promedio por imagen
      const successRate = 0.95 // 95% de éxito estimado

      return {
        totalImages,
        totalTokens,
        averageGenerationTime,
        successRate
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {
        totalImages: 0,
        totalTokens: 0,
        averageGenerationTime: 0,
        successRate: 0
      }
    }
  }
}

// Función para obtener API key de Gemini
export async function getGeminiApiKey(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('provider', 'gemini')
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.warn('No se encontró API key de Gemini')
      return null
    }

    return data.encrypted_value
  } catch (error) {
    console.error('Error obteniendo API key de Gemini:', error)
    return null
  }
}

// Función para crear instancia del servicio
export async function createGeminiImageService(): Promise<GeminiImageService> {
  const apiKey = await getGeminiApiKey()
  return new GeminiImageService(apiKey || undefined)
}

// Exportar servicio como objeto
export const geminiImageService = {
  createService: createGeminiImageService,
  generateImages: async (request: GeminiImageRequest) => {
    const service = await createGeminiImageService()
    return service.generateImages(request)
  },
  createMarketingPrompt: (productName: string, productType: string, targetAudience: string, mood: string, setting: string) => {
    const service = new GeminiImageService()
    return service.createMarketingPrompt(productName, productType, targetAudience, mood, setting)
  },
  createSocialMediaPrompt: (content: string, platform: string, audience: string, style: string) => {
    const service = new GeminiImageService()
    return service.createSocialMediaPrompt(content, platform, audience, style)
  },
  createBrandingPrompt: (brandName: string, industry: string, brandPersonality: string, colorScheme: string) => {
    const service = new GeminiImageService()
    return service.createBrandingPrompt(brandName, industry, brandPersonality, colorScheme)
  }
}
