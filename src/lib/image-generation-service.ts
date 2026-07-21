import { supabase } from './supabase'
import { AdvancedPromptService } from './advanced-prompt-service'

// Interfaces para generación de imágenes con Gemini
export interface ImageGenerationRequest {
  prompt: string
  style?: 'realistic' | 'artistic' | 'cartoon' | 'minimalist' | 'vintage'
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
  size?: '1K' | '2K'
  quality?: 'standard' | 'hd'
  count?: number
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all'
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  size: string
  quality: string
  created_at: string
  revised_prompt?: string
}

export interface ImageVariationRequest {
  imageUrl: string
  count?: number
  size?: '1K' | '2K'
}

export interface ImageEditRequest {
  imageUrl: string
  maskUrl?: string
  prompt: string
  size?: '1024x1024' | '1024x1792' | '1792x1024'
}

export interface ImageGenerationResult {
  success: boolean
  images?: GeneratedImage[]
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class ImageGenerationService {
  private geminiApiKey: string
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(geminiApiKey?: string) {
    this.geminiApiKey = geminiApiKey || ''
  }

  // Generar imagen con Gemini Imagen
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    try {
      if (!this.geminiApiKey) {
        throw new Error('API key de Gemini no configurada')
      }

      console.log('🔍 Generando imagen con Gemini:', {
        prompt: request.prompt,
        style: request.style,
        aspectRatio: request.aspectRatio,
        size: request.size,
        count: request.count
      })

      const enhancedPrompt = this.enhancePrompt(request.prompt, request.style)
      console.log('📝 Prompt mejorado:', enhancedPrompt)
      
      // Gemini Imagen tiene límite de 1 imagen por solicitud, así que hacemos múltiples solicitudes
      const imageCount = Math.min(request.count || 4, 4) // Máximo 4 imágenes
      const allImages: GeneratedImage[] = []
      
      console.log(`🔄 Generando ${imageCount} imágenes con ${imageCount} solicitudes separadas...`)
      
      for (let i = 0; i < imageCount; i++) {
        console.log(`📸 Generando imagen ${i + 1}/${imageCount}...`)
        
        const response = await fetch(
          `${this.apiUrl}/models/imagen-4.0-generate-001:predict`,
          {
            method: 'POST',
            headers: {
              'x-goog-api-key': this.geminiApiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              instances: [
                {
                  prompt: enhancedPrompt
                }
              ],
              parameters: {
                sampleCount: 1, // Solo 1 imagen por solicitud
                aspectRatio: request.aspectRatio || '1:1',
                sampleImageSize: request.size || '1K',
                personGeneration: request.personGeneration || 'allow_adult'
              }
            })
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Error de Gemini API: ${errorData.error?.message || 'Error desconocido'}`)
        }

        const data = await response.json()
        console.log(`🔍 Respuesta de Gemini API para imagen ${i + 1}:`, data)
        
        // Verificar que la respuesta tiene la estructura esperada
        if (!data.predictions || !Array.isArray(data.predictions)) {
          console.error('❌ Estructura de respuesta inesperada:', data)
          throw new Error('Respuesta de Gemini API no tiene la estructura esperada')
        }
        
        // Procesar la imagen generada
        const prediction = data.predictions[0]
        if (!prediction.bytesBase64Encoded) {
          console.error('❌ Predicción sin imagen:', prediction)
          throw new Error(`Predicción ${i} no contiene imagen`)
        }
        
        const generatedImage: GeneratedImage = {
          id: `gemini_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          url: `data:image/png;base64,${prediction.bytesBase64Encoded}`,
          prompt: enhancedPrompt,
          style: request.style || 'realistic',
          size: request.size || '1K',
          quality: 'standard',
          created_at: new Date().toISOString()
        }
        
        allImages.push(generatedImage)
        console.log(`✅ Imagen ${i + 1}/${imageCount} generada correctamente`)
        
        // Pequeña pausa entre solicitudes para evitar rate limiting
        if (i < imageCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      console.log(`🎉 Total de ${allImages.length} imágenes generadas exitosamente`)

      // Intentar guardar en la base de datos (no crítico)
      try {
        await this.saveGeneratedImages(allImages)
        console.log('✅ Imágenes guardadas en base de datos')
      } catch (error) {
        console.warn('⚠️ No se pudieron guardar en base de datos, pero las imágenes están disponibles:', error)
      }

      return {
        success: true,
        images: allImages,
        usage: {
          prompt_tokens: enhancedPrompt.length / 4, // Estimación aproximada
          completion_tokens: 0,
          total_tokens: enhancedPrompt.length / 4
        }
      }
    } catch (error) {
      console.error('Error generando imagen:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Mejorar prompt con estilo específico y detalles optimizados para Gemini
  private enhancePrompt(prompt: string, style?: string): string {
    // Si el prompt es muy simple, aplicar prompt engineering avanzado
    if (prompt.length < 50) {
      return this.createAdvancedPrompt(prompt, style || 'realistic')
    }

    const styleEnhancements = {
      realistic: 'photorealistic, high quality, detailed, professional photography, sharp focus, perfect lighting, commercial quality',
      artistic: 'artistic, creative, expressive, unique style, digital art, vibrant colors, imaginative composition',
      cartoon: 'cartoon style, colorful, fun, animated, character design, playful, cheerful, kid-friendly',
      minimalist: 'minimalist, clean, simple, modern, geometric, elegant, sophisticated, uncluttered',
      vintage: 'vintage style, retro, classic, aged, nostalgic, timeless, traditional, authentic'
    }

    const enhancement = style ? styleEnhancements[style] || '' : ''
    const basePrompt = enhancement ? `${prompt}, ${enhancement}` : prompt
    
    // Agregar mejoras adicionales basadas en las mejores prácticas de Gemini
    const additionalEnhancements = [
      'high resolution',
      'detailed',
      'well-composed',
      'visually appealing'
    ]
    
    return `${basePrompt}, ${additionalEnhancements.join(', ')}`
  }

  // Crear prompt avanzado para prompts simples usando el sistema automático
  private createAdvancedPrompt(simplePrompt: string, style: string): string {
    try {
      // Usar el servicio de prompts avanzados
      const promptService = new AdvancedPromptService()
      
      // Generar prompt avanzado automáticamente
      const advancedPrompt = promptService.createImagePrompt({
        subject: simplePrompt,
        style: style,
        context: 'educational infographic',
        audience: 'general audience',
        brandVoice: 'professional and educational',
        culturalContext: 'guatemalan'
      })
      
      console.log('🤖 Prompt avanzado generado automáticamente:', advancedPrompt)
      return advancedPrompt
    } catch (error) {
      console.warn('⚠️ Error usando sistema automático de prompts, usando fallback:', error)
      // Fallback a prompt mejorado estándar
      return `${simplePrompt}, professional design, high quality, detailed, well-composed, modern style, clean layout, suitable for educational materials, visually appealing, high resolution`
    }
  }

  // Generar variaciones de una imagen
  async generateVariations(request: ImageVariationRequest): Promise<ImageGenerationResult> {
    try {
      // DALL-E 3 no soporta variaciones directamente
      // Usaremos una estrategia alternativa: generar nueva imagen con prompt similar
      const basePrompt = await this.generatePromptFromImage(request.imageUrl)
      
      return await this.generateImage({
        prompt: basePrompt,
        size: request.size || '2K',
        count: request.count || 1
      })
    } catch (error) {
      console.error('Error generando variaciones:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Generar prompt basado en una imagen (usando GPT-4 Vision)
  private async generatePromptFromImage(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe esta imagen en detalle para poder recrearla con DALL-E. Incluye estilo, colores, composición y elementos principales.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 300
        })
      })

      if (!response.ok) {
        throw new Error('Error analizando imagen')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error generando prompt desde imagen:', error)
      return 'A creative and artistic image'
    }
  }

  // Editar imagen existente
  async editImage(request: ImageEditRequest): Promise<ImageGenerationResult> {
    try {
      // DALL-E 3 no soporta edición directa
      // Usaremos una estrategia alternativa: generar nueva imagen con instrucciones de edición
      const editPrompt = `Edit this image: ${request.prompt}. Keep the same style and composition but apply the requested changes.`
      
      return await this.generateImage({
        prompt: editPrompt,
        size: request.size || '1024x1024'
      })
    } catch (error) {
      console.error('Error editando imagen:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Generar imagen para redes sociales
  async generateSocialMediaImage(
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin',
    content: string,
    style: string = 'realistic'
  ): Promise<ImageGenerationResult> {
    try {
      const platformPrompts = {
        facebook: 'Facebook post image, engaging, social media optimized',
        instagram: 'Instagram post, visually appealing, square format, social media',
        twitter: 'Twitter post image, clean, simple, social media',
        linkedin: 'LinkedIn post image, professional, business-oriented, clean design'
      }

      const platformPrompt = platformPrompts[platform]
      const fullPrompt = `${content}, ${platformPrompt}, ${style} style`

      const sizeMap = {
        facebook: '2K' as const,
        instagram: '2K' as const,
        twitter: '2K' as const,
        linkedin: '2K' as const
      }

      return await this.generateImage({
        prompt: fullPrompt,
        style: style as any,
        size: sizeMap[platform],
        quality: 'hd'
      })
    } catch (error) {
      console.error('Error generando imagen para redes sociales:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Generar imagen para campaña publicitaria
  async generateAdImage(
    product: string,
    targetAudience: string,
    adObjective: 'awareness' | 'conversion' | 'engagement',
    style: string = 'realistic'
  ): Promise<ImageGenerationResult> {
    try {
      const objectivePrompts = {
        awareness: 'eye-catching, attention-grabbing, brand awareness',
        conversion: 'call-to-action, product-focused, conversion-oriented',
        engagement: 'engaging, interactive, community-focused'
      }

      const objectivePrompt = objectivePrompts[adObjective]
      const fullPrompt = `${product} advertisement for ${targetAudience}, ${objectivePrompt}, ${style} style, professional marketing image`

      return await this.generateImage({
        prompt: fullPrompt,
        style: style as any,
        size: '2K',
        quality: 'hd'
      })
    } catch (error) {
      console.error('Error generando imagen publicitaria:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Guardar imágenes generadas en la base de datos
  private async saveGeneratedImages(images: GeneratedImage[]): Promise<void> {
    try {
      const imageRecords = images.map(img => ({
        prompt: img.prompt || 'Prompt no especificado',
        style: img.style || 'realistic',
        size: img.size || '1K',
        quality: img.quality || 'standard',
        image_url: img.url,
        revised_prompt: img.revised_prompt || null,
        created_at: img.created_at || new Date().toISOString()
      }))

      console.log('💾 Guardando imágenes en base de datos:', imageRecords)

      const { error } = await supabase
        .from('generated_images')
        .insert(imageRecords)

      if (error) {
        console.error('Error guardando imágenes generadas:', error)
        throw error
      } else {
      }
    } catch (error) {
      console.error('Error guardando imágenes:', error)
      throw error
    }
  }

  // Obtener historial de imágenes generadas
  async getGeneratedImagesHistory(limit = 20): Promise<GeneratedImage[]> {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data?.map(record => ({
        id: record.id,
        url: record.image_url,
        prompt: record.prompt,
        style: record.style,
        size: record.size,
        quality: record.quality,
        created_at: record.created_at,
        revised_prompt: record.revised_prompt
      })) || []
    } catch (error) {
      console.error('Error obteniendo historial de imágenes:', error)
      return []
    }
  }

  // Obtener estadísticas de uso
  async getUsageStats(): Promise<{
    totalImages: number
    imagesThisMonth: number
    totalCost: number
    mostUsedStyles: string[]
  }> {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')

      if (error) {
        throw error
      }

      const totalImages = data?.length || 0
      const thisMonth = new Date()
      thisMonth.setDate(1)
      
      const imagesThisMonth = data?.filter(img => 
        new Date(img.created_at) >= thisMonth
      ).length || 0

      // Calcular costo estimado (DALL-E 3: $0.040 por imagen 1024x1024)
      const totalCost = totalImages * 0.040

      // Obtener estilos más usados
      const styleCounts = data?.reduce((acc, img) => {
        acc[img.style] = (acc[img.style] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const mostUsedStyles = Object.entries(styleCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([style]) => style)

      return {
        totalImages,
        imagesThisMonth,
        totalCost,
        mostUsedStyles
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas de uso:', error)
      return {
        totalImages: 0,
        imagesThisMonth: 0,
        totalCost: 0,
        mostUsedStyles: []
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
export async function createImageGenerationService(): Promise<ImageGenerationService> {
  const apiKey = await getGeminiApiKey()
  return new ImageGenerationService(apiKey || undefined)
}

// Exportar servicio como objeto
export const imageGenerationService = {
  createService: createImageGenerationService,
  generateImage: async (request: ImageGenerationRequest) => {
    const service = await createImageGenerationService()
    return service.generateImage(request)
  },
  generateSocialMediaImage: async (platform: string, content: string, style?: string) => {
    const service = await createImageGenerationService()
    return service.generateSocialMediaImage(platform as any, content, style)
  },
  generateAdImage: async (product: string, targetAudience: string, adObjective: string, style?: string) => {
    const service = await createImageGenerationService()
    return service.generateAdImage(product, targetAudience, adObjective as any, style)
  }
}
