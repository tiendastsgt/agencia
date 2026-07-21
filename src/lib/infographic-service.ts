import { supabase } from './supabase'
import {
  InfographicData,
  InfographicGenerationRequest,
  InfographicGenerationResponse,
  InfographicPrompt,
  InfographicTemplate,
  InfographicRecord,
  InfographicInsert,
  InfographicCategory
} from './types/infographic'

export class InfographicService {
  private static instance: InfographicService

  public static getInstance(): InfographicService {
    if (!InfographicService.instance) {
      InfographicService.instance = new InfographicService()
    }
    return InfographicService.instance
  }

  /**
   * Genera un prompt optimizado para crear infografías basado en los datos JSON
   */
  async generateInfographicPrompt(data: InfographicData): Promise<InfographicPrompt> {
    const elements = this.extractElements(data)
    const colors = this.extractColors(data)
    const layout = this.describeLayout(data.layout)
    const style = this.describeStyle(data.theme)
    
    const prompt = {
      title: data.title,
      description: this.generateDescription(data),
      style: style,
      elements: elements,
      colors: colors,
      layout: layout,
      targetAudience: this.inferTargetAudience(data),
      purpose: this.inferPurpose(data)
    }

    return prompt
  }

  /**
   * Genera la descripción completa de la infografía
   */
  private generateDescription(data: InfographicData): string {
    let description = `Create a professional ${data.theme.style} infographic titled "${data.title}"`
    
    if (data.subtitle) {
      description += ` with subtitle "${data.subtitle}"`
    }
    
    description += `. The infographic should have a ${data.layout.type} layout with ${data.sections.length} main sections. `
    
    // Describir cada sección
    data.sections.forEach((section, index) => {
      description += `Section ${index + 1}: ${this.describeSection(section)}. `
    })
    
    description += `Use a ${data.theme.style} design style with primary color ${data.theme.primaryColor} and secondary color ${data.theme.secondaryColor}. `
    description += `The background should be ${data.theme.backgroundColor} with ${data.theme.textColor} text. `
    description += `Include professional typography using ${data.theme.fontFamily} font family. `
    description += `Make it visually appealing, modern, and suitable for social media sharing. `
    description += `Ensure all text is readable and the layout is clean and organized.`
    
    return description
  }

  /**
   * Extrae elementos visuales de los datos
   */
  private extractElements(data: InfographicData): string[] {
    const elements: string[] = []
    
    data.sections.forEach(section => {
      switch (section.type) {
        case 'stats':
          elements.push('statistical data visualization', 'numbers and metrics')
          break
        case 'chart':
          elements.push(`${section.content.chart?.type} chart`, 'data visualization')
          break
        case 'list':
          elements.push('bullet points', 'organized list')
          break
        case 'comparison':
          elements.push('comparison table', 'pros and cons')
          break
        case 'timeline':
          elements.push('timeline visualization', 'chronological data')
          break
        case 'image':
          elements.push('illustrative image', 'visual element')
          break
        default:
          elements.push('text content', 'information block')
      }
    })
    
    return [...new Set(elements)] // Remove duplicates
  }

  /**
   * Extrae colores de los datos
   */
  private extractColors(data: InfographicData): string[] {
    const colors = [
      data.theme.primaryColor,
      data.theme.secondaryColor,
      data.theme.accentColor,
      data.theme.backgroundColor
    ]
    
    // Extraer colores de las secciones
    data.sections.forEach(section => {
      if (section.style?.backgroundColor) {
        colors.push(section.style.backgroundColor)
      }
      if (section.style?.gradient?.from) {
        colors.push(section.style.gradient.from)
        colors.push(section.style.gradient.to)
      }
    })
    
    return [...new Set(colors.filter(color => color))]
  }

  /**
   * Describe el layout de la infografía
   */
  private describeLayout(layout: any): string {
    const layoutDescriptions = {
      'vertical': 'vertical stacked layout with sections arranged from top to bottom',
      'horizontal': 'horizontal layout with sections arranged from left to right',
      'grid': 'grid-based layout with organized sections in rows and columns',
      'timeline': 'timeline layout showing chronological progression',
      'comparison': 'comparison layout with side-by-side elements'
    }
    
    return layoutDescriptions[layout.type as keyof typeof layoutDescriptions] || 'organized layout'
  }

  /**
   * Describe el estilo de la infografía
   */
  private describeStyle(theme: any): string {
    const styleDescriptions = {
      'modern': 'modern, clean design with sharp edges and contemporary typography',
      'classic': 'classic, traditional design with elegant typography and refined elements',
      'minimalist': 'minimalist design with lots of white space and simple elements',
      'corporate': 'professional corporate design suitable for business presentations',
      'creative': 'creative, artistic design with unique visual elements and creative typography'
    }
    
    return styleDescriptions[theme.style as keyof typeof styleDescriptions] || 'professional design'
  }

  /**
   * Describe una sección específica
   */
  private describeSection(section: any): string {
    switch (section.type) {
      case 'stats':
        return `statistics section with ${section.content.stats?.items.length || 0} key metrics`
      case 'chart':
        return `${section.content.chart?.type} chart showing data visualization`
      case 'text':
        return `text section with ${section.content.text?.format} format`
      case 'list':
        return `list section with ${section.content.list?.items.length || 0} items`
      case 'comparison':
        return `comparison section with ${section.content.comparison?.items.length || 0} items`
      case 'timeline':
        return `timeline section with ${section.content.timeline?.items.length || 0} events`
      case 'image':
        return 'image section with visual content'
      default:
        return `${section.type} section`
    }
  }

  /**
   * Infiere la audiencia objetivo basada en los datos
   */
  private inferTargetAudience(data: InfographicData): string {
    // Analizar tags y categoría para inferir audiencia
    if (data.metadata.tags.some(tag => ['business', 'corporate', 'executive'].includes(tag.toLowerCase()))) {
      return 'business professionals and executives'
    }
    if (data.metadata.tags.some(tag => ['social', 'marketing', 'digital'].includes(tag.toLowerCase()))) {
      return 'marketing professionals and social media managers'
    }
    if (data.metadata.tags.some(tag => ['education', 'learning', 'academic'].includes(tag.toLowerCase()))) {
      return 'educators and students'
    }
    return 'general audience'
  }

  /**
   * Infiere el propósito de la infografía
   */
  private inferPurpose(data: InfographicData): string {
    if (data.sections.some(s => s.type === 'stats' || s.type === 'chart')) {
      return 'data visualization and statistical presentation'
    }
    if (data.sections.some(s => s.type === 'comparison')) {
      return 'comparative analysis and decision making'
    }
    if (data.sections.some(s => s.type === 'timeline')) {
      return 'chronological information and process explanation'
    }
    return 'information sharing and education'
  }

  /**
   * Genera la infografía usando APIs de generación de imágenes
   */
  async generateInfographic(request: InfographicGenerationRequest): Promise<InfographicGenerationResponse> {
    try {
      // Generar el prompt optimizado
      const prompt = await this.generateInfographicPrompt(request.data)
      
      // Crear el prompt final para la API
      const finalPrompt = this.createFinalPrompt(prompt, request)
      
      // Llamar a la API correspondiente
      const response = await this.callImageGenerationAPI(request.provider, finalPrompt, request)
      
      return {
        success: true,
        images: response.images,
        prompt: finalPrompt,
        metadata: {
          provider: request.provider,
          model: response.model,
          generationTime: response.generationTime,
          cost: response.cost
        }
      }
    } catch (error) {
      return {
        success: false,
        images: [],
        prompt: '',
        metadata: {
          provider: request.provider,
          model: '',
          generationTime: 0,
          cost: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Crea el prompt final para la API de generación de imágenes
   */
  private createFinalPrompt(prompt: InfographicPrompt, request: InfographicGenerationRequest): string {
    let finalPrompt = `Create a professional infographic: ${prompt.description}. `
    
    // Agregar especificaciones técnicas
    finalPrompt += `Design requirements: ${prompt.style}. `
    finalPrompt += `Color scheme: ${prompt.colors.join(', ')}. `
    finalPrompt += `Layout: ${prompt.layout}. `
    finalPrompt += `Target audience: ${prompt.targetAudience}. `
    finalPrompt += `Purpose: ${prompt.purpose}. `
    
    // Agregar elementos específicos
    if (prompt.elements.length > 0) {
      finalPrompt += `Include these elements: ${prompt.elements.join(', ')}. `
    }
    
    // Especificaciones de calidad
    finalPrompt += `High quality, professional design, suitable for print and digital use. `
    finalPrompt += `Clean typography, proper spacing, and visual hierarchy. `
    finalPrompt += `No watermarks, no text overlays that might be unreadable. `
    finalPrompt += `Modern, engaging, and shareable design.`
    
    return finalPrompt
  }

  /**
   * Llama a la API de generación de imágenes correspondiente
   */
  private async callImageGenerationAPI(provider: string, prompt: string, request: InfographicGenerationRequest): Promise<any> {
    // Esta función se integraría con los servicios existentes de generación de imágenes
    // Por ahora, retornamos un mock response
    
    const mockResponse = {
      images: [
        {
          id: `infographic_${Date.now()}`,
          url: `https://example.com/infographic_${Date.now()}.png`,
          prompt: prompt,
          metadata: {
            size: request.size,
            quality: request.quality,
            provider: provider,
            model: `${provider}_model`
          }
        }
      ],
      model: `${provider}_model`,
      generationTime: Math.random() * 10 + 5, // 5-15 seconds
      cost: Math.random() * 0.5 + 0.1 // $0.1-$0.6
    }
    
    return mockResponse
  }

  /**
   * Guarda la infografía en la base de datos
   */
  async saveInfographic(infographic: InfographicInsert): Promise<InfographicRecord> {
    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Usuario no autenticado')
    }

    // Preparar los datos para insertar
    const infographicData = {
      ...infographic,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('infographics')
      .insert(infographicData)
      .select()
      .single()

    if (error) {
      throw new Error(`Error saving infographic: ${error.message}`)
    }

    return data
  }

  /**
   * Obtiene infografías del usuario actual
   */
  async getUserInfographics(): Promise<InfographicRecord[]> {
    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('infographics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error fetching infographics: ${error.message}`)
    }

    return data || []
  }

  /**
   * Obtiene templates predefinidos
   */
  async getInfographicTemplates(category?: InfographicCategory): Promise<InfographicTemplate[]> {
    let query = supabase
      .from('infographic_templates')
      .select('*')
      .order('popularity', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Error fetching templates: ${error.message}`)
    }

    return data || []
  }

  /**
   * Crea una infografía desde un template
   */
  async createFromTemplate(templateId: string, customData: Partial<InfographicData>): Promise<InfographicData> {
    const { data: template, error } = await supabase
      .from('infographic_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (error) {
      throw new Error(`Error fetching template: ${error.message}`)
    }

    // Combinar datos del template con datos personalizados
    const infographicData: InfographicData = {
      ...template.data,
      ...customData,
      metadata: {
        ...template.data.metadata,
        ...customData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    return infographicData
  }

  /**
   * Valida los datos de la infografía
   */
  validateInfographicData(data: InfographicData): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (!data.theme) {
      errors.push('Theme is required')
    }

    if (!data.layout) {
      errors.push('Layout is required')
    }

    if (!data.sections || data.sections.length === 0) {
      errors.push('At least one section is required')
    }

    // Validar cada sección
    data.sections.forEach((section, index) => {
      if (!section.type) {
        errors.push(`Section ${index + 1}: Type is required`)
      }
      if (!section.content) {
        errors.push(`Section ${index + 1}: Content is required`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Exportar instancia singleton
export const infographicService = InfographicService.getInstance()
