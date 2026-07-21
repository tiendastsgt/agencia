// APIs de generación de contenido visual
// Integración con múltiples proveedores de IA

export interface GenerationRequest {
  prompt: string
  dimensions?: string
  style?: string
  quality?: 'standard' | 'high' | 'premium'
  platform?: string
  duration?: number // Para videos en segundos
  type?: 'image' | 'video'
}

export interface GenerationResponse {
  success: boolean
  image_url?: string
  video_url?: string
  thumbnail_url?: string
  error?: string
  api_used: string
  cost?: number
  processing_time?: number
  duration?: number
  resolution?: string
}

export class ContentGenerationAPIs {
  private apiKeys: Record<string, string> = {}
  private baseUrls: Record<string, string> = {
    'openai': 'https://api.openai.com/v1',
    'stability': 'https://api.stability.ai/v1',
    'google': 'https://generativelanguage.googleapis.com/v1beta',
    'runway': 'https://api.runwayml.com/v1',
    'pika': 'https://api.pika.art/v1',
    'luma': 'https://api.lumalabs.ai/v1'
  }

  constructor() {
    this.loadAPIKeys()
  }

  private loadAPIKeys() {
    // Cargar API keys desde variables de entorno
    this.apiKeys = {
      openai: import.meta.env.VITE_OPENAI_API_KEY || '',
      stability: import.meta.env.VITE_STABILITY_API_KEY || '',
      google: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
      runway: import.meta.env.VITE_RUNWAY_API_KEY || '',
      pika: import.meta.env.VITE_PIKA_API_KEY || '',
      luma: import.meta.env.VITE_LUMA_API_KEY || ''
    }
  }

  // OpenAI DALL-E 3
  async generateWithDALLE(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.openai) {
      return {
        success: false,
        error: 'OpenAI API key not configured',
        api_used: 'dalle-3'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.openai}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: this.optimizePromptForDALLE(request.prompt),
          n: 1,
          size: this.getDALLESize(request.dimensions),
          quality: request.quality === 'premium' ? 'hd' : 'standard',
          style: request.style === 'vivid' ? 'vivid' : 'natural'
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Unknown error',
          api_used: 'dalle-3',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        image_url: data.data[0].url,
        api_used: 'dalle-3',
        cost: 0.04, // Costo aproximado por imagen
        processing_time: processingTime
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'dalle-3'
      }
    }
  }

  // Stability AI Stable Diffusion
  async generateWithStableDiffusion(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.stability) {
      return {
        success: false,
        error: 'Stability AI API key not configured',
        api_used: 'stable-diffusion'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.stability}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.stability}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: this.optimizePromptForStableDiffusion(request.prompt),
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: this.getHeight(request.dimensions),
          width: this.getWidth(request.dimensions),
          samples: 1,
          steps: 30
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Unknown error',
          api_used: 'stable-diffusion',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        image_url: `data:image/png;base64,${data.artifacts[0].base64}`,
        api_used: 'stable-diffusion',
        cost: 0.01, // Costo aproximado por imagen
        processing_time: processingTime
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'stable-diffusion'
      }
    }
  }

  // Google Imagen
  async generateWithImagen(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.google) {
      return {
        success: false,
        error: 'Google AI API key not configured',
        api_used: 'google-imagen'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.google}/models/imagen-3.0-generate-001:generateImage?key=${this.apiKeys.google}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.optimizePromptForImagen(request.prompt),
          config: {
            aspectRatio: this.getImagenAspectRatio(request.dimensions),
            safetyFilterLevel: 'block_some',
            personGeneration: 'allow_adult'
          }
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Unknown error',
          api_used: 'google-imagen',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        image_url: data.generatedImages[0].imageUri,
        api_used: 'google-imagen',
        cost: 0.02, // Costo aproximado por imagen
        processing_time: processingTime
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'google-imagen'
      }
    }
  }

  // RunwayML Gen-4 para videos
  async generateWithRunway(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.runway) {
      return {
        success: false,
        error: 'RunwayML API key not configured',
        api_used: 'runway-gen4'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.runway}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.runway}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gen4-turbo',
          prompt: this.optimizePromptForRunway(request.prompt),
          duration: Math.min(request.duration || 5, 18), // Máximo 18 segundos
          resolution: this.getRunwayResolution(request.dimensions),
          quality: request.quality === 'premium' ? 'high' : 'standard'
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Unknown error',
          api_used: 'runway-gen4',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url,
        api_used: 'runway-gen4',
        cost: (data.duration || 5) * 0.05, // $0.05 por segundo
        processing_time: processingTime,
        duration: data.duration,
        resolution: data.resolution
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'runway-gen4'
      }
    }
  }

  // Pika Labs para videos
  async generateWithPika(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.pika) {
      return {
        success: false,
        error: 'Pika Labs API key not configured',
        api_used: 'pika-labs'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.pika}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.pika}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'pika-2.2',
          prompt: this.optimizePromptForPika(request.prompt),
          duration: Math.min(request.duration || 5, 25), // Máximo 25 segundos
          resolution: this.getPikaResolution(request.dimensions),
          style: request.style || 'cinematic'
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Unknown error',
          api_used: 'pika-labs',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url,
        api_used: 'pika-labs',
        cost: this.calculatePikaCost(request.duration || 5, request.dimensions),
        processing_time: processingTime,
        duration: data.duration,
        resolution: data.resolution
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'pika-labs'
      }
    }
  }

  // Luma AI Dream Machine para videos
  async generateWithLuma(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.apiKeys.luma) {
      return {
        success: false,
        error: 'Luma AI API key not configured',
        api_used: 'luma-dream-machine'
      }
    }

    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrls.luma}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.luma}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dream-machine',
          prompt: this.optimizePromptForLuma(request.prompt),
          duration: Math.min(request.duration || 5, 10), // Máximo 10 segundos
          resolution: this.getLumaResolution(request.dimensions),
          style: request.style || 'realistic'
        })
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Unknown error',
          api_used: 'luma-dream-machine',
          processing_time: processingTime
        }
      }

      return {
        success: true,
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url,
        api_used: 'luma-dream-machine',
        cost: (data.duration || 5) * 0.10, // $0.10 por segundo
        processing_time: processingTime,
        duration: data.duration,
        resolution: data.resolution
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        api_used: 'luma-dream-machine'
      }
    }
  }

  // Método principal para generar contenido
  async generateContent(request: GenerationRequest, preferredAPI?: string): Promise<GenerationResponse> {
    // Determinar qué API usar
    const apiToUse = preferredAPI || this.selectOptimalAPI(request)
    
    switch (apiToUse) {
      case 'dalle-3':
        return await this.generateWithDALLE(request)
      case 'stable-diffusion':
        return await this.generateWithStableDiffusion(request)
      case 'google-imagen':
        return await this.generateWithImagen(request)
      case 'runway-gen4':
        return await this.generateWithRunway(request)
      case 'pika-labs':
        return await this.generateWithPika(request)
      case 'luma-dream-machine':
        return await this.generateWithLuma(request)
      default:
        // Fallback basado en tipo de contenido
        if (request.type === 'video') {
          return await this.generateWithPika(request)
        } else {
          return await this.generateWithStableDiffusion(request)
        }
    }
  }

  // Seleccionar API óptima basada en criterios
  private selectOptimalAPI(request: GenerationRequest): string {
    // Para videos
    if (request.type === 'video') {
      if (request.quality === 'premium') {
        return 'runway-gen4'
      } else if (request.duration && request.duration > 10) {
        return 'pika-labs' // Pika soporta hasta 25 segundos
      } else {
        return 'luma-dream-machine' // Más económico para videos cortos
      }
    }
    
    // Para imágenes
    if (request.quality === 'premium') {
      return 'dalle-3'
    }
    
    // Si se requiere velocidad
    if (request.platform === 'TikTok' || request.platform === 'Instagram') {
      return 'stable-diffusion'
    }
    
    // Si se requiere balance calidad-velocidad
    if (request.quality === 'high') {
      return 'google-imagen'
    }
    
    // Default: Stable Diffusion (más económico)
    return 'stable-diffusion'
  }

  // Optimizar prompts para cada API
  private optimizePromptForDALLE(prompt: string): string {
    // DALL-E 3 funciona mejor con prompts descriptivos y específicos
    return `${prompt}, high quality, professional photography, detailed, sharp focus`
  }

  private optimizePromptForStableDiffusion(prompt: string): string {
    // Stable Diffusion funciona mejor con prompts técnicos
    return `${prompt}, masterpiece, best quality, highly detailed, 8k resolution`
  }

  private optimizePromptForImagen(prompt: string): string {
    // Imagen funciona mejor con prompts naturales
    return `${prompt}, high quality, professional, clean composition`
  }

  private optimizePromptForRunway(prompt: string): string {
    // RunwayML funciona mejor con prompts cinematográficos
    return `${prompt}, cinematic, high quality, professional video, smooth motion, detailed`
  }

  private optimizePromptForPika(prompt: string): string {
    // Pika Labs funciona mejor con prompts dinámicos
    return `${prompt}, dynamic, engaging, high quality, smooth animation, vibrant colors`
  }

  private optimizePromptForLuma(prompt: string): string {
    // Luma AI funciona mejor con prompts realistas
    return `${prompt}, realistic, high quality, natural motion, detailed, professional`
  }

  // Utilidades para dimensiones
  private getDALLESize(dimensions?: string): string {
    const sizeMap: Record<string, string> = {
      '1080x1080': '1024x1024',
      '1080x1920': '1024x1792',
      '1920x1080': '1792x1024',
      '1200x627': '1024x1024'
    }
    return sizeMap[dimensions || '1080x1080'] || '1024x1024'
  }

  private getHeight(dimensions?: string): number {
    const dims = dimensions?.split('x') || ['1024', '1024']
    return parseInt(dims[1]) || 1024
  }

  private getWidth(dimensions?: string): number {
    const dims = dimensions?.split('x') || ['1024', '1024']
    return parseInt(dims[0]) || 1024
  }

  private getImagenAspectRatio(dimensions?: string): string {
    const dims = dimensions?.split('x') || ['1024', '1024']
    const width = parseInt(dims[0])
    const height = parseInt(dims[1])
    
    if (width === height) return '1:1'
    if (width > height) return '16:9'
    if (height > width) return '9:16'
    return '1:1'
  }

  // Utilidades para APIs de video
  private getRunwayResolution(dimensions?: string): string {
    const resolutionMap: Record<string, string> = {
      '1080x1080': '1080x1080',
      '1080x1920': '1080x1920',
      '1920x1080': '1920x1080',
      '1200x627': '1920x1080'
    }
    return resolutionMap[dimensions || '1080x1080'] || '1080x1080'
  }

  private getPikaResolution(dimensions?: string): string {
    const resolutionMap: Record<string, string> = {
      '1080x1080': '720x720',
      '1080x1920': '720x1280',
      '1920x1080': '1280x720',
      '1200x627': '1280x720'
    }
    return resolutionMap[dimensions || '1080x1080'] || '720x720'
  }

  private getLumaResolution(dimensions?: string): string {
    const resolutionMap: Record<string, string> = {
      '1080x1080': '1024x1024',
      '1080x1920': '1024x1792',
      '1920x1080': '1792x1024',
      '1200x627': '1024x1024'
    }
    return resolutionMap[dimensions || '1080x1080'] || '1024x1024'
  }

  private calculatePikaCost(duration: number, dimensions?: string): number {
    const isHD = dimensions?.includes('1080') || false
    const baseCost = isHD ? 0.15 : 0.08 // Costo por segundo
    
    if (duration <= 5) return duration * baseCost
    if (duration <= 10) return duration * (baseCost * 1.2)
    if (duration <= 25) return duration * (baseCost * 1.5)
    
    return duration * baseCost
  }

  // Verificar estado de APIs
  async checkAPIStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {}
    
    // Verificar APIs de imágenes
    status.openai = !!this.apiKeys.openai
    status.stability = !!this.apiKeys.stability
    status.google = !!this.apiKeys.google
    
    // Verificar APIs de video
    status.runway = !!this.apiKeys.runway
    status.pika = !!this.apiKeys.pika
    status.luma = !!this.apiKeys.luma
    
    return status
  }

  // Obtener costos estimados
  getEstimatedCosts(): Record<string, { image?: number, video?: number }> {
    return {
      'dalle-3': { image: 0.04 },
      'stable-diffusion': { image: 0.01 },
      'google-imagen': { image: 0.02 },
      'runway-gen4': { video: 0.05 }, // Por segundo
      'pika-labs': { video: 0.08 }, // Por segundo (promedio)
      'luma-dream-machine': { video: 0.10 } // Por segundo
    }
  }
}

// Instancia singleton
export const contentGenerationAPIs = new ContentGenerationAPIs()
