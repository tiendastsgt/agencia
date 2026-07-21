import { InfographicData } from './types/infographic'
import { advancedInfographicGenerator } from './advanced-infographic-generator'
import { visualInfographicGenerator } from './visual-infographic-generator'
import { professionalInfographicGenerator } from './professional-infographic-generator'
import { cleanInfographicGenerator } from './clean-infographic-generator'
import { professionalStructureGenerator } from './professional-structure-generator'
import { realInfographicComposer } from './real-infographic-composer'
import { realInfographicAPI } from './real-infographic-api'
import { AIServiceFactory } from './ai/AIServiceFactory'
import { logger } from './logger'
import { AppError, ErrorCode, handleError } from './errors'
import { configManager } from './config'

export interface InfographicImageRequest {
  data: InfographicData
  provider: 'dalle' | 'stability' | 'gemini'
  size?: '1024x1024' | '1024x1792' | '1792x1024'
  quality?: 'standard' | 'hd'
}

export interface InfographicImageResult {
  success: boolean
  imageUrl?: string
  imageBase64?: string
  error?: string
  provider: string
  model: string
  prompt: string
  metadata?: any
}

export class InfographicImageService {
  private static instance: InfographicImageService

  public static getInstance(): InfographicImageService {
    if (!InfographicImageService.instance) {
      InfographicImageService.instance = new InfographicImageService()
    }
    return InfographicImageService.instance
  }

  /**
   * Genera una imagen de la infografía usando AI real
   */
  async generateInfographicImage(request: InfographicImageRequest): Promise<InfographicImageResult> {
    const startTime = Date.now()
    
    try {
      logger.info('Starting infographic image generation', {
        provider: request.provider,
        title: request.data.title,
        size: request.size
      })

      // Validar entrada
      this.validateRequest(request)

      // Crear un prompt detallado para la generación de imagen
      const prompt = this.createProfessionalImagePrompt(request.data)
      
      // Generar imagen real usando AI
      const result = await this.generateWithAI(request.provider, prompt, request)
      
      const duration = Date.now() - startTime
      logger.info('Infographic image generation completed', {
        provider: request.provider,
        success: result.success,
        duration
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      const appError = handleError(error as Error, {
        service: 'InfographicImageService',
        operation: 'generateInfographicImage',
        provider: request.provider,
        duration
      })

      logger.error('Infographic image generation failed', appError, {
        provider: request.provider,
        title: request.data.title,
        duration
      })

      return {
        success: false,
        error: appError.message,
        provider: request.provider,
        model: this.getModelName(request.provider),
        prompt: ''
      }
    }
  }

  /**
   * Valida la solicitud de generación de imagen
   */
  private validateRequest(request: InfographicImageRequest): void {
    if (!request.data) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Infographic data is required',
        { service: 'InfographicImageService', operation: 'validateRequest' }
      )
    }

    if (!request.data.title) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Infographic title is required',
        { service: 'InfographicImageService', operation: 'validateRequest' }
      )
    }

    if (!request.provider) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'AI provider is required',
        { service: 'InfographicImageService', operation: 'validateRequest' }
      )
    }

    const validProviders = ['dalle', 'stability', 'gemini']
    if (!validProviders.includes(request.provider)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `Invalid provider: ${request.provider}. Must be one of: ${validProviders.join(', ')}`,
        { service: 'InfographicImageService', operation: 'validateRequest', provider: request.provider }
      )
    }
  }

  /**
   * Crea un prompt profesional para la generación de imagen
   */
  private createProfessionalImagePrompt(data: InfographicData): string {
    const sections = data.sections?.map(section => {
      switch (section.type) {
        case 'stats':
          return `Estadísticas: ${section.content?.stats?.items?.map((item: any) => `${item.label}: ${item.value}${item.unit}`).join(', ')}`
        case 'text':
          return `Texto: ${section.content?.text?.content}`
        case 'list':
          return `Lista: ${section.content?.list?.items?.map((item: any) => item.text).join(', ')}`
        case 'chart':
          return `Gráfico: ${section.content?.chart?.type} con datos ${section.content?.chart?.data?.map((item: any) => `${item.label}: ${item.value}`).join(', ')}`
        case 'comparison':
          return `Comparación: ${section.content?.comparison?.items?.map((item: any) => item.title).join(' vs ')}`
        default:
          return section.title
      }
    }).join('; ')

    const style = data.theme?.style || 'modern'
    const primaryColor = data.theme?.primaryColor || '#3B82F6'
    const secondaryColor = data.theme?.secondaryColor || '#1E40AF'
    
    return `Create a professional, modern infographic about "${data.title}". ${data.subtitle ? `Subtitle: ${data.subtitle}. ` : ''}

Content to include: ${sections}

Design requirements:
- Professional infographic style with clean, modern layout
- Primary color: ${primaryColor}, Secondary color: ${secondaryColor}
- Include visual elements like icons, charts, and graphics
- Use a ${style} design style
- High contrast text for readability
- Balanced composition with proper spacing
- Include relevant icons and visual metaphors
- Professional typography and hierarchy
- Suitable for social media and presentations

The infographic should be visually appealing, informative, and professionally designed with clear visual hierarchy and engaging graphics.`
  }

  /**
   * Genera imagen usando AI
   */
  private async generateWithAI(provider: string, prompt: string, request: InfographicImageRequest): Promise<InfographicImageResult> {
    try {
      // Verificar si la API key está configurada dinámicamente
      const config = configManager.getAIConfig(provider as any)
      logger.info('Checking API key configuration', { 
        provider, 
        hasApiKey: !!config.apiKey,
        apiKeyLength: config.apiKey?.length || 0,
        apiKeyStart: config.apiKey?.substring(0, 10) || 'none'
      })
      
      if (!config.apiKey || config.apiKey === '' || config.apiKey === 'your_gemini_api_key_here') {
        logger.warn('API key not configured, using fallback', { provider, config })
        return await this.generateFallbackImage(request.data, prompt)
      }

      // Mapear nombres de proveedores
      const providerMap: Record<string, 'gemini' | 'dalle3' | 'stability' | 'imagen'> = {
        'gemini': 'imagen', // Usar Gemini 2.5 Flash según documentación oficial
        'dalle': 'dalle3',
        'stability': 'stability',
        'imagen': 'imagen' // Gemini 2.5 Flash
      }

      const mappedProvider = providerMap[provider]
      if (!mappedProvider) {
        throw new AppError(
          ErrorCode.INVALID_CONFIG,
          `Unsupported provider: ${provider}`,
          { provider, supportedProviders: Object.keys(providerMap) }
        )
      }

      // Crear servicio usando factory
      const aiService = AIServiceFactory.createService(mappedProvider)
      
      // Generar imagen
      const result = await aiService.generateImage(prompt, {
        size: request.size || configManager.getInfographicConfig().defaultSize,
        quality: request.quality || configManager.getInfographicConfig().defaultQuality
      })

      return {
        success: true,
        imageUrl: result.image_url,
        imageBase64: result.image_base64,
        provider: provider,
        model: result.model,
        prompt: result.prompt_used,
        metadata: {
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          generatedAt: new Date().toISOString(),
          revisedPrompt: result.revised_prompt
        }
      }
    } catch (error) {
      logger.warn('AI generation failed, using fallback', { 
        provider, 
        error: (error as Error).message 
      })
      return this.generateFallbackImage(request.data, prompt)
    }
  }

  /**
   * Genera imagen con DALL-E usando la API real
   */
  private async generateWithDalle(prompt: string, request: InfographicImageRequest): Promise<InfographicImageResult> {
    try {
      // Crear instancia del servicio unificado
      const unifiedImageService = await createUnifiedImageService()
      
      // Usar el servicio unificado para generar con DALL-E
      const unifiedRequest = {
        prompt: prompt,
        provider: 'dalle3' as const,
        options: {
          size: (request.size as any) || '1024x1024',
          quality: (request.quality as any) || 'standard',
          style: 'vivid' as const
        }
      }

      const result = await unifiedImageService.generateImage(unifiedRequest)
      
      return {
        success: true,
        imageUrl: result.image_url,
        imageBase64: result.image_base64,
        provider: 'dalle',
        model: result.model,
        prompt: result.prompt_used,
        metadata: {
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          generatedAt: new Date().toISOString(),
          revisedPrompt: result.revised_prompt
        }
      }
    } catch (error) {
      console.error('Error generando con DALL-E:', error)
      // Si falla DALL-E, usar fallback
      return this.generateFallbackImage(request.data, prompt)
    }
  }

  /**
   * Genera imagen con Stability AI usando la API real
   */
  private async generateWithStability(prompt: string, request: InfographicImageRequest): Promise<InfographicImageResult> {
    try {
      // Crear instancia del servicio unificado
      const unifiedImageService = await createUnifiedImageService()
      
      // Usar el servicio unificado para generar con Stability AI
      const unifiedRequest = {
        prompt: prompt,
        provider: 'stability' as const,
        options: {
          model: 'stable-image-ultra' as const,
          aspect_ratio: '16:9' as const,
          style_preset: 'photographic' as const,
          negative_prompt: 'blurry, low quality, distorted'
        }
      }

      const result = await unifiedImageService.generateImage(unifiedRequest)
      
      return {
        success: true,
        imageUrl: result.image_url,
        imageBase64: result.image_base64,
        provider: 'stability',
        model: result.model,
        prompt: result.prompt_used,
        metadata: {
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          generatedAt: new Date().toISOString(),
          revisedPrompt: result.revised_prompt
        }
      }
    } catch (error) {
      console.error('Error generando con Stability AI:', error)
      // Si falla Stability AI, usar fallback
      return this.generateFallbackImage(request.data, prompt)
    }
  }

  /**
   * Genera imagen con Gemini usando la API real
   */
  private async generateWithGemini(prompt: string, request: InfographicImageRequest): Promise<InfographicImageResult> {
    try {
      // Crear instancia del servicio unificado
      const unifiedImageService = await createUnifiedImageService()
      
      // Usar el servicio unificado para generar con Gemini
      const unifiedRequest = {
        prompt: prompt,
        provider: 'gemini' as const,
        options: {
          gemini_style: 'modern' as const,
          gemini_aspect_ratio: '16:9' as const,
          safety_filter: true
        }
      }

      const result = await unifiedImageService.generateImage(unifiedRequest)
      
      return {
        success: true,
        imageUrl: result.image_url,
        imageBase64: result.image_base64,
        provider: 'gemini',
        model: result.model,
        prompt: result.prompt_used,
        metadata: {
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          generatedAt: new Date().toISOString(),
          revisedPrompt: result.revised_prompt
        }
      }
    } catch (error) {
      console.error('Error generando con Gemini:', error)
      // Si falla Gemini, usar fallback
      return this.generateFallbackImage(request.data, prompt)
    }
  }

  /**
   * Genera imagen de fallback usando generador de estructura profesional
   */
  private async generateFallbackImage(data: InfographicData, prompt: string): Promise<InfographicImageResult> {
    try {
      logger.info('Generating fallback image using professional structure generator', {
        title: data.title,
        prompt: prompt.substring(0, 100)
      })

      // Usar el generador de estructura profesional como fallback principal
      const imageDataUrl = await professionalStructureGenerator.generateProfessionalStructure(data, {
        width: 1200,
        height: 1600,
        format: 'png',
        quality: 'high',
        includeWatermark: false
      })
      
      logger.info('Professional structure infographic generated successfully', {
        hasImageDataUrl: !!imageDataUrl
      })
      
      return {
        success: true,
        imageUrl: imageDataUrl,
        imageBase64: imageDataUrl.split(',')[1], // Extraer base64 del data URL
        provider: 'fallback',
        model: 'professional-structure-generator',
        prompt: prompt,
        metadata: {
          fallback: true,
          generatedAt: new Date().toISOString(),
          method: 'professional-structure-generator'
        }
      }
    } catch (error) {
      logger.error('Error generating professional structure infographic, trying clean fallback', error as Error, {
        title: data.title,
        prompt: prompt.substring(0, 100)
      })
      
      // Fallback al generador limpio si falla el de estructura
      try {
        const imageDataUrl = await cleanInfographicGenerator.generateCleanInfographic(data, {
          width: 1200,
          height: 1600,
          format: 'png',
          quality: 'high',
          includeWatermark: false
        })
        
        return {
          success: true,
          imageUrl: imageDataUrl,
          imageBase64: imageDataUrl.split(',')[1],
          provider: 'fallback',
          model: 'clean-infographic-generator',
          prompt: prompt,
          metadata: {
            fallback: true,
            generatedAt: new Date().toISOString(),
            method: 'clean-infographic-generator'
          }
        }
      } catch (cleanError) {
        logger.error('Error generating clean fallback, trying professional fallback', cleanError as Error, {
          title: data.title,
          prompt: prompt.substring(0, 100)
        })
        
        // Fallback al generador profesional si falla el limpio
        try {
          const imageDataUrl = await professionalInfographicGenerator.generateProfessionalInfographic(data, {
            width: 1200,
            height: 1600,
            format: 'png',
            quality: 'high',
            includeWatermark: false
          })
          
          return {
            success: true,
            imageUrl: imageDataUrl,
            imageBase64: imageDataUrl.split(',')[1],
            provider: 'fallback',
            model: 'professional-generator',
            prompt: prompt,
            metadata: {
              fallback: true,
              generatedAt: new Date().toISOString(),
              method: 'professional-generator'
            }
          }
        } catch (professionalError) {
          logger.error('Error generating professional fallback, trying advanced fallback', professionalError as Error, {
            title: data.title,
            prompt: prompt.substring(0, 100)
          })
          
          // Fallback final al generador avanzado
          try {
            const imageDataUrl = await advancedInfographicGenerator.generateAdvancedInfographic(data, {
              width: 1200,
              height: 1600,
              format: 'png',
              quality: 'high',
              includeWatermark: false
            })
            
            return {
              success: true,
              imageUrl: imageDataUrl,
              imageBase64: imageDataUrl.split(',')[1],
              provider: 'fallback',
              model: 'advanced-html-css',
              prompt: prompt,
              metadata: {
                fallback: true,
                generatedAt: new Date().toISOString(),
                method: 'advanced-html-css'
              }
            }
          } catch (fallbackError) {
            logger.error('Error generating advanced fallback image', fallbackError as Error, {
              title: data.title,
              prompt: prompt.substring(0, 100)
            })
            
            return {
              success: false,
              error: 'Error generando imagen de fallback',
              provider: 'fallback',
              model: 'none',
              prompt: prompt
            }
          }
        }
      }
    }
  }

  /**
   * Genera una URL de imagen mock para testing
   */
  private generateMockImageUrl(data: InfographicData): string {
    // Generar una URL de placeholder que represente la infografía
    const title = encodeURIComponent(data.title || 'Infografía')
    const color = data.theme?.primaryColor?.replace('#', '') || '3B82F6'
    const size = '1024x1024'
    
    return `https://via.placeholder.com/${size}/${color}/FFFFFF?text=${title}`
  }

  /**
   * Obtiene el nombre del modelo según el proveedor
   */
  private getModelName(provider: string): string {
    switch (provider) {
      case 'dalle':
        return 'dall-e-3'
      case 'stability':
        return 'stable-diffusion-xl'
      case 'gemini':
        return 'gemini-2.5-flash-image'
      default:
        return 'unknown'
    }
  }

  /**
   * Convierte la infografía a imagen usando canvas (para descarga)
   */
  async renderInfographicToCanvas(data: InfographicData): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas')
    }

    // Configurar el tamaño del canvas (formato infografía)
    canvas.width = 1200
    canvas.height = 1600

    // Crear gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, data.theme?.backgroundColor || '#FFFFFF')
    gradient.addColorStop(1, `${data.theme?.primaryColor || '#3B82F6'}08`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar header con fondo de color
    const headerHeight = 200
    ctx.fillStyle = data.theme?.primaryColor || '#3B82F6'
    ctx.fillRect(0, 0, canvas.width, headerHeight)

    // Título principal
    ctx.font = 'bold 48px Inter, sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText(data.title || 'Infografía', canvas.width / 2, 80)

    // Subtítulo
    if (data.subtitle) {
      ctx.font = '24px Inter, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(data.subtitle, canvas.width / 2, 120)
    }

    // Dibujar las secciones
    let yPosition = headerHeight + 60
    data.sections?.forEach((section, index) => {
      // Título de sección
      ctx.font = 'bold 36px Inter, sans-serif'
      ctx.fillStyle = data.theme?.primaryColor || '#3B82F6'
      ctx.textAlign = 'center'
      ctx.fillText(section.title, canvas.width / 2, yPosition)
      
      // Línea decorativa
      const lineWidth = 80
      const lineX = (canvas.width - lineWidth) / 2
      ctx.fillStyle = data.theme?.accentColor || '#F59E0B'
      ctx.fillRect(lineX, yPosition + 10, lineWidth, 4)
      
      yPosition += 60
      
      // Dibujar contenido de la sección
      switch (section.type) {
        case 'stats':
          const statsPerRow = 2
          const statWidth = (canvas.width - 120) / statsPerRow
          section.content?.stats?.items?.forEach((stat: any, statIndex: number) => {
            const col = statIndex % statsPerRow
            const row = Math.floor(statIndex / statsPerRow)
            const x = 60 + col * statWidth
            const y = yPosition + row * 120
            
            // Fondo de la tarjeta
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(x, y, statWidth - 20, 100)
            
            // Sombra
            ctx.fillStyle = `${data.theme?.primaryColor || '#3B82F6'}20`
            ctx.fillRect(x + 4, y + 4, statWidth - 20, 100)
            
            // Valor
            ctx.font = 'bold 32px Inter, sans-serif'
            ctx.fillStyle = data.theme?.primaryColor || '#3B82F6'
            ctx.textAlign = 'center'
            ctx.fillText(`${stat.value}${stat.unit}`, x + (statWidth - 20) / 2, y + 45)
            
            // Etiqueta
            ctx.font = '16px Inter, sans-serif'
            ctx.fillStyle = '#666666'
            ctx.fillText(stat.label, x + (statWidth - 20) / 2, y + 70)
          })
          yPosition += Math.ceil((section.content?.stats?.items?.length || 0) / statsPerRow) * 120 + 40
          break
          
        case 'text':
          if (section.content?.text?.content) {
            ctx.font = '20px Inter, sans-serif'
            ctx.fillStyle = '#333333'
            ctx.textAlign = 'left'
            
            const words = section.content.text.content.split(' ')
            let line = ''
            let lineY = yPosition
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' '
              const metrics = ctx.measureText(testLine)
              if (metrics.width > canvas.width - 120 && i > 0) {
                ctx.fillText(line, 60, lineY)
                line = words[i] + ' '
                lineY += 30
              } else {
                line = testLine
              }
            }
            ctx.fillText(line, 60, lineY)
            yPosition = lineY + 60
          }
          break
          
        case 'list':
          section.content?.list?.items?.forEach((item: any, itemIndex: number) => {
            ctx.font = '20px Inter, sans-serif'
            ctx.fillStyle = '#333333'
            ctx.textAlign = 'left'
            
            // Bullet point
            ctx.fillStyle = data.theme?.primaryColor || '#3B82F6'
            ctx.fillRect(60, yPosition - 8, 8, 8)
            
            // Texto
            ctx.fillStyle = '#333333'
            ctx.fillText(item.text, 80, yPosition)
            yPosition += 35
          })
          yPosition += 20
          break
          
        case 'chart':
          const chartWidth = canvas.width - 120
          const chartHeight = 200
          const chartX = 60
          const chartY = yPosition
          
          // Fondo del gráfico
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(chartX, chartY, chartWidth, chartHeight)
          
          const maxValue = Math.max(...(section.content?.chart?.data?.map((item: any) => item.value) || [0]))
          const barWidth = chartWidth / (section.content?.chart?.data?.length || 1) - 20
          
          section.content?.chart?.data?.forEach((item: any, itemIndex: number) => {
            const barHeight = (item.value / maxValue) * (chartHeight - 60)
            const barX = chartX + itemIndex * (barWidth + 20) + 10
            const barY = chartY + chartHeight - barHeight - 30
            
            // Barra
            ctx.fillStyle = data.theme?.primaryColor || '#3B82F6'
            ctx.fillRect(barX, barY, barWidth, barHeight)
            
            // Etiqueta
            ctx.font = '16px Inter, sans-serif'
            ctx.fillStyle = '#333333'
            ctx.textAlign = 'center'
            ctx.fillText(item.label, barX + barWidth / 2, chartY + chartHeight - 10)
            
            // Valor
            ctx.fillText(item.value.toString(), barX + barWidth / 2, barY - 10)
          })
          yPosition += chartHeight + 40
          break
      }
      
      yPosition += 40
    })

    return canvas
  }

  /**
   * Descarga la infografía como imagen usando AI real
   */
  async downloadInfographicAsImage(data: InfographicData, filename?: string, provider: 'dalle' | 'stability' | 'gemini' = 'gemini'): Promise<void> {
    try {
      // Generar imagen con AI real
      const aiResult = await this.generateInfographicImage({
        data: data,
        provider: provider,
        size: '1024x1792', // Formato infografía
        quality: 'hd'
      })
      
      if (aiResult.success && aiResult.imageUrl) {
        // Descargar imagen generada por AI
        logger.info('Downloading AI generated image', {
          imageUrlType: aiResult.imageUrl.startsWith('data:') ? 'data-url' : 'http-url',
          imageUrlLength: aiResult.imageUrl.length
        })
        
        let downloadUrl: string
        
        if (aiResult.imageUrl.startsWith('data:')) {
          // Es un data URL, usarlo directamente
          downloadUrl = aiResult.imageUrl
          logger.info('Using data URL directly for download')
        } else {
          // Es una URL HTTP, descargar primero
          logger.info('Fetching HTTP URL for download')
          const response = await fetch(aiResult.imageUrl)
          const blob = await response.blob()
          downloadUrl = URL.createObjectURL(blob)
          logger.info('Created blob URL for download')
        }
        
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || `${data.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'infografia'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Limpiar URL solo si no es data URL
        if (!aiResult.imageUrl.startsWith('data:')) {
          URL.revokeObjectURL(downloadUrl)
        }
        return
      }
    } catch (error) {
      console.warn('Error generando con AI, usando generador avanzado:', error)
    }
    
    try {
      // Fallback al generador de estructura profesional
      const imageDataUrl = await professionalStructureGenerator.generateProfessionalStructure(data, {
        width: 1200,
        height: 1600,
        format: 'png',
        quality: 'high',
        includeWatermark: false
      })
      
      // Convertir data URL a blob
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      
      // Crear URL y descargar
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `${data.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'infografia'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      // Fallback final al método anterior
      console.warn('Error con generador avanzado, usando fallback final:', error)
      try {
        const canvas = await this.renderInfographicToCanvas(data)
        
        // Convertir canvas a blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
          }, 'image/png', 0.9)
        })

        // Crear URL y descargar
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || `${data.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'infografia'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (fallbackError) {
        throw new Error(`Error al descargar imagen: ${fallbackError instanceof Error ? fallbackError.message : 'Error desconocido'}`)
      }
    }
  }
}

export const infographicImageService = InfographicImageService.getInstance()
