import { advancedPromptService, createMarketingPrompt } from './advanced-prompt-service'
import { geminiImageService } from './gemini-image-service'
import { sentimentAnalysisService } from './sentiment-analysis-service'

// Interfaces para generación automática de contenido
export interface ContentGenerationRequest {
  type: 'social_post' | 'email' | 'product_description' | 'ad_copy' | 'image'
  product?: {
    name: string
    type: string
    features: string[]
    target_audience: string
  }
  brand?: {
    name: string
    voice: string
    values: string[]
  }
  campaign?: {
    objective: 'awareness' | 'conversion' | 'engagement' | 'retention'
    channel: string
    budget?: number
  }
  context?: {
    season?: string
    event?: string
    competitor_analysis?: any
  }
}

export interface GeneratedContent {
  id: string
  type: string
  content: string
  prompt_used: string
  optimization_applied: string[]
  cultural_context: string
  quality_score: number
  created_at: string
}

export class AutomatedContentService {
  
  // Generar contenido automáticamente usando prompts avanzados
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    try {
      let content = ''
      let promptUsed = ''
      let optimizations: string[] = []
      
      switch (request.type) {
        case 'social_post':
          content = await this.generateSocialPost(request)
          break
        case 'email':
          content = await this.generateEmail(request)
          break
        case 'product_description':
          content = await this.generateProductDescription(request)
          break
        case 'ad_copy':
          content = await this.generateAdCopy(request)
          break
        case 'image':
          content = await this.generateImage(request)
          break
      }
      
      // Aplicar optimizaciones automáticas
      const optimizationResult = await this.optimizeContent(content, request)
      content = optimizationResult.optimized_content
      optimizations = optimizationResult.applied_optimizations
      
      return {
        id: `content_${Date.now()}`,
        type: request.type,
        content,
        prompt_used: promptUsed,
        optimization_applied: optimizations,
        cultural_context: 'Guatemalan market - family values, natural products, authentic brands',
        quality_score: this.calculateQualityScore(content, request),
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error generando contenido:', error)
      throw error
    }
  }

  // Generar post para redes sociales
  private async generateSocialPost(request: ContentGenerationRequest): Promise<string> {
    const prompt = await advancedPromptService.generateAdvancedPrompt({
      template_id: 'persuasive_copy_aida',
      variables: {
        product_name: request.product?.name || 'Producto',
        target_audience: request.product?.target_audience || 'audiencia',
        key_benefits: request.product?.features?.join(', ') || 'beneficios',
        brand_voice: request.brand?.voice || 'profesional',
        channel: request.campaign?.channel || 'Facebook',
        word_limit: '100'
      },
      target_audience: request.product?.target_audience,
      brand_voice: request.brand?.voice,
      channel: request.campaign?.channel,
      objective: request.campaign?.objective
    })

    // Aquí se integraría con GPT-5-nano para generar el contenido
    // Por ahora retornamos un ejemplo
    return `¡Descubre ${request.product?.name}! 🎉 

${request.product?.features?.[0]} que tu familia necesita. 

✅ Natural y seguro
✅ Efectivo y confiable  
✅ Recomendado por mamás guatemaltecas

¡Únete a miles de familias que ya confían en nosotros! 

#${request.brand?.name} #FamiliaGuatemalteca #Natural #Confiable`
  }

  // Generar email de marketing
  private async generateEmail(request: ContentGenerationRequest): Promise<string> {
    const prompt = await advancedPromptService.generateAdvancedPrompt({
      template_id: 'persuasive_copy_aida',
      variables: {
        product_name: request.product?.name || 'Producto',
        target_audience: request.product?.target_audience || 'audiencia',
        key_benefits: request.product?.features?.join(', ') || 'beneficios',
        brand_voice: request.brand?.voice || 'profesional',
        channel: 'email',
        word_limit: '200'
      },
      target_audience: request.product?.target_audience,
      brand_voice: request.brand?.voice,
      channel: 'email',
      objective: request.campaign?.objective
    })

    return `Asunto: ${request.product?.name} - La solución que tu familia necesita

Hola [Nombre],

¿Te preocupa la salud de tu familia? 

En ${request.brand?.name} entendemos que como padre/madre guatemalteco, solo quieres lo mejor para tus seres queridos.

Por eso creamos ${request.product?.name}:
• ${request.product?.features?.[0]}
• ${request.product?.features?.[1]}
• ${request.product?.features?.[2]}

Miles de familias guatemaltecas ya confían en nosotros. ¿Por qué no tú también?

[Botón: Conoce más]

Con cariño,
El equipo de ${request.brand?.name}`
  }

  // Generar descripción de producto
  private async generateProductDescription(request: ContentGenerationRequest): Promise<string> {
    const prompt = await advancedPromptService.generateAdvancedPrompt({
      template_id: 'persuasive_copy_aida',
      variables: {
        product_name: request.product?.name || 'Producto',
        target_audience: request.product?.target_audience || 'audiencia',
        key_benefits: request.product?.features?.join(', ') || 'beneficios',
        brand_voice: request.brand?.voice || 'profesional',
        channel: 'ecommerce',
        word_limit: '150'
      },
      target_audience: request.product?.target_audience,
      brand_voice: request.brand?.voice,
      channel: 'ecommerce',
      objective: 'conversion'
    })

    return `${request.product?.name} - La elección inteligente para familias guatemaltecas

${request.product?.features?.join('. ')}.

Diseñado especialmente pensando en las necesidades de las familias guatemaltecas, este producto combina eficacia con seguridad, ofreciendo la tranquilidad que buscas para tus seres queridos.

Características principales:
• ${request.product?.features?.[0]}
• ${request.product?.features?.[1]}
• ${request.product?.features?.[2]}

Recomendado por pediatras y aprobado por miles de familias en Guatemala.`
  }

  // Generar copy publicitario
  private async generateAdCopy(request: ContentGenerationRequest): Promise<string> {
    const prompt = await advancedPromptService.generateAdvancedPrompt({
      template_id: 'persuasive_copy_aida',
      variables: {
        product_name: request.product?.name || 'Producto',
        target_audience: request.product?.target_audience || 'audiencia',
        key_benefits: request.product?.features?.join(', ') || 'beneficios',
        brand_voice: request.brand?.voice || 'profesional',
        channel: request.campaign?.channel || 'Facebook',
        word_limit: '80'
      },
      target_audience: request.product?.target_audience,
      brand_voice: request.brand?.voice,
      channel: request.campaign?.channel,
      objective: request.campaign?.objective
    })

    return `${request.product?.name} - La solución que necesitas

${request.product?.features?.[0]} para tu familia.

✅ Natural y seguro
✅ Efectivo y confiable
✅ Recomendado en Guatemala

¡Únete a miles de familias satisfechas!

[Llamada a la acción]`
  }

  // Generar imagen usando Gemini
  private async generateImage(request: ContentGenerationRequest): Promise<string> {
    const prompt = geminiImageService.createMarketingPrompt(
      request.product?.name || 'Producto',
      request.product?.type || 'producto',
      request.product?.target_audience || 'audiencia',
      'professional, trustworthy',
      'modern, clean setting',
      request.brand?.voice
    )

    // Aquí se integraría con Gemini Imagen
    // Por ahora retornamos la URL de la imagen generada
    return `data:image/png;base64,generated_image_data_here`
  }

  // Optimizar contenido automáticamente
  private async optimizeContent(content: string, request: ContentGenerationRequest): Promise<{
    optimized_content: string
    applied_optimizations: string[]
  }> {
    const optimizations: string[] = []
    let optimizedContent = content

    // 1. Aplicar contexto cultural guatemalteco
    if (!content.includes('Guatemala') && !content.includes('guatemalteco')) {
      optimizedContent = this.addGuatemalanContext(optimizedContent, request)
      optimizations.push('Added Guatemalan cultural context')
    }

    // 2. Aplicar power words según objetivo
    if (request.campaign?.objective) {
      optimizedContent = this.addPowerWords(optimizedContent, request.campaign.objective)
      optimizations.push(`Added power words for ${request.campaign.objective}`)
    }

    // 3. Optimizar para canal específico
    if (request.campaign?.channel) {
      optimizedContent = this.optimizeForChannel(optimizedContent, request.campaign.channel)
      optimizations.push(`Optimized for ${request.campaign.channel}`)
    }

    // 4. Aplicar EmotionPrompt technique
    optimizedContent = this.addEmotionalImpact(optimizedContent, request)
    optimizations.push('Applied emotional impact enhancement')

    return {
      optimized_content: optimizedContent,
      applied_optimizations: optimizations
    }
  }

  // Agregar contexto cultural guatemalteco
  private addGuatemalanContext(content: string, request: ContentGenerationRequest): string {
    const culturalElements = [
      'familias guatemaltecas',
      'valores familiares',
      'tradición y confianza',
      'hecho para Guatemala'
    ]
    
    const randomElement = culturalElements[Math.floor(Math.random() * culturalElements.length)]
    return content.replace(/familia/g, randomElement)
  }

  // Agregar power words según objetivo
  private addPowerWords(content: string, objective: string): string {
    const powerWords = {
      'conversion': ['exclusivo', 'limitado', 'garantizado', 'comprobado'],
      'engagement': ['descubre', 'explora', 'transforma', 'conecta'],
      'awareness': ['innovador', 'revolucionario', 'líder', 'avanzado'],
      'retention': ['leal', 'confiable', 'consistente', 'valorado']
    }

    const words = powerWords[objective] || []
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)]
      return content.replace(/producto/g, `${randomWord} producto`)
    }
    
    return content
  }

  // Optimizar para canal específico
  private optimizeForChannel(content: string, channel: string): string {
    const channelOptimizations = {
      'facebook': content + '\n\n#FamiliaGuatemalteca #Natural #Confiable',
      'instagram': content + '\n\n✨ #FamiliaGT #Natural #Confiable',
      'whatsapp': content.replace(/¡/g, 'Hola! '),
      'tiktok': content + '\n\n#ParaTi #FamiliaGT #Natural'
    }

    return channelOptimizations[channel] || content
  }

  // Agregar impacto emocional
  private addEmotionalImpact(content: string, request: ContentGenerationRequest): string {
    const emotionalTriggers = [
      'La tranquilidad que buscas para tu familia',
      'La confianza que mereces',
      'La solución que necesitas',
      'El cuidado que tu familia necesita'
    ]

    const randomTrigger = emotionalTriggers[Math.floor(Math.random() * emotionalTriggers.length)]
    return `${randomTrigger}.\n\n${content}`
  }

  // Calcular score de calidad
  private calculateQualityScore(content: string, request: ContentGenerationRequest): number {
    let score = 0.5 // Base score

    // Puntos por longitud apropiada
    if (content.length > 50 && content.length < 500) score += 0.2

    // Puntos por contexto cultural
    if (content.includes('Guatemala') || content.includes('guatemalteco')) score += 0.1

    // Puntos por power words
    const powerWords = ['exclusivo', 'garantizado', 'natural', 'confiable', 'efectivo']
    const hasPowerWords = powerWords.some(word => content.toLowerCase().includes(word))
    if (hasPowerWords) score += 0.1

    // Puntos por estructura
    if (content.includes('•') || content.includes('✅')) score += 0.1

    return Math.min(score, 1.0)
  }
}

// Instancia singleton
export const automatedContentService = new AutomatedContentService()

// Funciones de utilidad para integración rápida
export const generateSocialPost = (product: any, brand: any, campaign: any) => {
  return automatedContentService.generateContent({
    type: 'social_post',
    product,
    brand,
    campaign
  })
}

export const generateEmailContent = (product: any, brand: any, campaign: any) => {
  return automatedContentService.generateContent({
    type: 'email',
    product,
    brand,
    campaign
  })
}

export const generateProductDescription = (product: any, brand: any) => {
  return automatedContentService.generateContent({
    type: 'product_description',
    product,
    brand,
    campaign: { objective: 'conversion', channel: 'ecommerce' }
  })
}
