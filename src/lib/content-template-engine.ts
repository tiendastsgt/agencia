import { supabase } from './supabase'

export interface ContentTemplate {
  id: string
  name: string
  framework: string
  hook_type: string
  visual_elements: {
    opening_frame: {
      text_overlay: string
      background: string
      duration: string
      effects: string[]
    }
    authority_proof?: {
      element: string
      content: string
      duration: string
    }
    revelation_moment?: {
      text: string
      visual: string
      duration: string
    }
  }
  psychological_triggers: string[]
  target_audience: string
  platforms: string[]
  variables: Record<string, string[]>
}

export interface ContentRequest {
  templateType: string
  variables: Record<string, string>
  targetPlatforms: string[]
  brandContext: {
    name: string
    industry: string
    personality: string
    colorPalette: string[]
  }
  contentType?: 'image' | 'video'
  duration?: number // Para videos en segundos
}

export class ContentTemplateEngine {
  private templates: Map<string, ContentTemplate> = new Map()
  private apiConfigs = {
    'dalle-3': { cost: 0.04, quality: 'high', speed: 'medium', type: 'image' },
    'stable-diffusion': { cost: 0.01, quality: 'medium', speed: 'fast', type: 'image' },
    'google-imagen': { cost: 0.02, quality: 'high', speed: 'fast', type: 'image' },
    'runway-gen4': { cost: 0.05, quality: 'premium', speed: 'slow', type: 'video' },
    'pika-labs': { cost: 0.08, quality: 'high', speed: 'medium', type: 'video' },
    'luma-dream-machine': { cost: 0.10, quality: 'high', speed: 'fast', type: 'video' }
  }

  constructor() {
    this.loadTemplates()
  }

  private async loadTemplates() {
    // Cargar templates desde la base de datos o archivos JSON
    const templates = await this.getTemplatesFromDB()
    templates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  private async getTemplatesFromDB(): Promise<ContentTemplate[]> {
    // Implementar carga desde Supabase
    const { data, error } = await supabase
      .from('content_templates')
      .select('*')
    
    if (error) {
      console.error('Error loading templates:', error)
      return this.getDefaultTemplates()
    }
    
    return data || this.getDefaultTemplates()
  }

  private getDefaultTemplates(): ContentTemplate[] {
    return [
      {
        id: 'd100-insider-access',
        name: 'Insider Access Hook',
        framework: 'Dream 100',
        hook_type: 'Insider Access',
        visual_elements: {
          opening_frame: {
            text_overlay: 'Los {NUMBER} secretos que {AUTHORITY} no quiere que sepas',
            background: 'behind_scenes_footage',
            duration: '2-3 segundos',
            effects: ['zoom_in', 'text_reveal_animation']
          },
          authority_proof: {
            element: 'screenshot_social_proof',
            content: 'Capturas de pantalla de interacciones con figuras de autoridad',
            duration: '1-2 segundos'
          },
          revelation_moment: {
            text: 'Aquí está el secreto número {X} que cambió todo para mí',
            visual: 'dramatic_reveal_animation',
            duration: '3-4 segundos'
          }
        },
        psychological_triggers: ['curiosity_gap', 'authority_proof', 'exclusivity'],
        target_audience: 'Ambitious Professionals',
        platforms: ['LinkedIn', 'Instagram', 'TikTok'],
        variables: {
          NUMBER: ['3', '5', '7', '10'],
          AUTHORITY: ['expertos de la industria', 'gurús del marketing', 'líderes empresariales'],
          X: ['1', '2', '3', '4', '5']
        }
      },
      {
        id: 'hso-problem-agitation',
        name: 'Problem Agitation Hook',
        framework: 'Hook-Story-Offer',
        hook_type: 'Problem Agitation',
        visual_elements: {
          opening_frame: {
            text_overlay: '¿Te ha pasado que {PROBLEM}?',
            background: 'relatable_problem_scenario',
            duration: '3-4 segundos',
            effects: ['emotional_color_grading', 'close_up_shots']
          }
        },
        psychological_triggers: ['problem_agitation', 'relatability', 'solution_seeking'],
        target_audience: 'Problem Solvers',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        variables: {
          PROBLEM: [
            'trabajas 12 horas y no ves resultados',
            'tienes mil ideas pero no sabes por dónde empezar',
            'quieres crecer pero no tienes tiempo'
          ]
        }
      }
    ]
  }

  async generateContent(request: ContentRequest) {
    const template = this.templates.get(request.templateType)
    if (!template) {
      throw new Error(`Template ${request.templateType} not found`)
    }

    // 1. Procesar variables dinámicas
    const processedTemplate = this.processVariables(template, request.variables, request.brandContext)
    
    // 2. Seleccionar API óptima
    const optimalAPI = this.selectOptimalAPI(processedTemplate, request.targetPlatforms, request.contentType)
    
    // 3. Generar contenido
    const content = await this.generateWithAPI(optimalAPI, processedTemplate, request.targetPlatforms, request.contentType, request.duration)
    
    // 4. Optimizar para plataformas específicas
    const optimizedContent = await this.optimizeForPlatforms(content, request.targetPlatforms)
    
    return {
      template: processedTemplate,
      api_used: optimalAPI,
      content: optimizedContent,
      metadata: {
        generated_at: new Date().toISOString(),
        variables_used: request.variables,
        platforms: request.targetPlatforms,
        content_type: request.contentType || 'image',
        duration: request.duration
      }
    }
  }

  private processVariables(template: ContentTemplate, variables: Record<string, string>, brandContext: any): ContentTemplate {
    const processed = JSON.parse(JSON.stringify(template)) // Deep clone
    
    // Procesar variables en visual_elements
    Object.keys(processed.visual_elements).forEach(key => {
      const element = processed.visual_elements[key]
      if (typeof element === 'object') {
        Object.keys(element).forEach(prop => {
          if (typeof element[prop] === 'string') {
            element[prop] = this.replaceVariables(element[prop], variables, brandContext)
          }
        })
      }
    })
    
    return processed
  }

  private replaceVariables(text: string, variables: Record<string, string>, brandContext: any): string {
    let processed = text
    
    // Reemplazar variables específicas
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g')
      processed = processed.replace(regex, variables[key])
    })
    
    // Reemplazar variables de marca
    processed = processed.replace(/{BRAND_NAME}/g, brandContext.name)
    processed = processed.replace(/{INDUSTRY}/g, brandContext.industry)
    processed = processed.replace(/{PERSONALITY}/g, brandContext.personality)
    
    return processed
  }

  private selectOptimalAPI(template: ContentTemplate, platforms: string[], contentType?: string): string {
    // Lógica de selección basada en costo, calidad y velocidad
    const platformNeeds = this.analyzePlatformNeeds(platforms)
    
    // Para videos
    if (contentType === 'video') {
      if (platformNeeds.quality === 'premium' && platformNeeds.budget === 'high') {
        return 'runway-gen4'
      } else if (platformNeeds.speed === 'fast' && platformNeeds.budget === 'low') {
        return 'luma-dream-machine'
      } else {
        return 'pika-labs' // Balance calidad-velocidad
      }
    }
    
    // Para imágenes
    if (platformNeeds.quality === 'premium' && platformNeeds.budget === 'high') {
      return 'dalle-3'
    } else if (platformNeeds.speed === 'fast' && platformNeeds.budget === 'low') {
      return 'stable-diffusion'
    } else if (platformNeeds.quality === 'high' && platformNeeds.speed === 'fast') {
      return 'google-imagen'
    }
    
    return 'stable-diffusion' // Default
  }

  private analyzePlatformNeeds(platforms: string[]) {
    const needs = { quality: 'medium', speed: 'medium', budget: 'medium' }
    
    if (platforms.includes('LinkedIn') || platforms.includes('YouTube')) {
      needs.quality = 'high'
    }
    
    if (platforms.includes('TikTok') || platforms.includes('Instagram')) {
      needs.speed = 'fast'
    }
    
    return needs
  }

  private async generateWithAPI(api: string, template: ContentTemplate, platforms: string[], contentType?: string, duration?: number) {
    // Implementar llamadas a APIs específicas
    const prompt = this.buildPrompt(template, platforms)
    
    switch (api) {
      case 'dalle-3':
        return await this.generateWithDALLE(prompt)
      case 'stable-diffusion':
        return await this.generateWithStableDiffusion(prompt)
      case 'google-imagen':
        return await this.generateWithImagen(prompt)
      case 'runway-gen4':
        return await this.generateWithRunway(prompt, duration)
      case 'pika-labs':
        return await this.generateWithPika(prompt, duration)
      case 'luma-dream-machine':
        return await this.generateWithLuma(prompt, duration)
      default:
        throw new Error(`API ${api} not implemented`)
    }
  }

  private buildPrompt(template: ContentTemplate, platforms: string[]): string {
    const platformOptimizations = {
      'Instagram': ', Instagram-optimized, high contrast, mobile-first design',
      'TikTok': ', TikTok-style, energetic, Gen Z aesthetic',
      'LinkedIn': ', professional, clean, business-appropriate',
      'YouTube': ', YouTube thumbnail optimized, engaging, click-worthy'
    }
    
    let prompt = template.visual_elements.opening_frame.text_overlay
    
    platforms.forEach(platform => {
      if (platformOptimizations[platform]) {
        prompt += platformOptimizations[platform]
      }
    })
    
    return prompt
  }

  private async generateWithDALLE(prompt: string) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithDALLE({
      prompt,
      quality: 'high'
    })
    
    if (!response.success) {
      throw new Error(`DALL-E generation failed: ${response.error}`)
    }
    
    return {
      image_url: response.image_url,
      prompt_used: prompt,
      api: 'dalle-3',
      cost: response.cost,
      processing_time: response.processing_time
    }
  }

  private async generateWithStableDiffusion(prompt: string) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithStableDiffusion({
      prompt,
      quality: 'standard'
    })
    
    if (!response.success) {
      throw new Error(`Stable Diffusion generation failed: ${response.error}`)
    }
    
    return {
      image_url: response.image_url,
      prompt_used: prompt,
      api: 'stable-diffusion',
      cost: response.cost,
      processing_time: response.processing_time
    }
  }

  private async generateWithImagen(prompt: string) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithImagen({
      prompt,
      quality: 'high'
    })
    
    if (!response.success) {
      throw new Error(`Google Imagen generation failed: ${response.error}`)
    }
    
    return {
      image_url: response.image_url,
      prompt_used: prompt,
      api: 'google-imagen',
      cost: response.cost,
      processing_time: response.processing_time
    }
  }

  private async generateWithRunway(prompt: string, duration?: number) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithRunway({
      prompt,
      duration: duration || 5,
      type: 'video',
      quality: 'premium'
    })
    
    if (!response.success) {
      throw new Error(`RunwayML generation failed: ${response.error}`)
    }
    
    return {
      video_url: response.video_url,
      thumbnail_url: response.thumbnail_url,
      prompt_used: prompt,
      api: 'runway-gen4',
      cost: response.cost,
      processing_time: response.processing_time,
      duration: response.duration,
      resolution: response.resolution
    }
  }

  private async generateWithPika(prompt: string, duration?: number) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithPika({
      prompt,
      duration: duration || 5,
      type: 'video',
      quality: 'high'
    })
    
    if (!response.success) {
      throw new Error(`Pika Labs generation failed: ${response.error}`)
    }
    
    return {
      video_url: response.video_url,
      thumbnail_url: response.thumbnail_url,
      prompt_used: prompt,
      api: 'pika-labs',
      cost: response.cost,
      processing_time: response.processing_time,
      duration: response.duration,
      resolution: response.resolution
    }
  }

  private async generateWithLuma(prompt: string, duration?: number) {
    const { contentGenerationAPIs } = await import('./content-generation-apis')
    
    const response = await contentGenerationAPIs.generateWithLuma({
      prompt,
      duration: duration || 5,
      type: 'video',
      quality: 'high'
    })
    
    if (!response.success) {
      throw new Error(`Luma AI generation failed: ${response.error}`)
    }
    
    return {
      video_url: response.video_url,
      thumbnail_url: response.thumbnail_url,
      prompt_used: prompt,
      api: 'luma-dream-machine',
      cost: response.cost,
      processing_time: response.processing_time,
      duration: response.duration,
      resolution: response.resolution
    }
  }

  private async optimizeForPlatforms(content: any, platforms: string[]) {
    const optimized = { ...content }
    
    platforms.forEach(platform => {
      const specs = this.getPlatformSpecs(platform)
      optimized[platform] = {
        ...content,
        dimensions: specs.dimensions,
        format: specs.format,
        optimization: specs.optimization
      }
    })
    
    return optimized
  }

  private getPlatformSpecs(platform: string) {
    const specs = {
      'Instagram': {
        dimensions: '1080x1080',
        format: 'JPG',
        optimization: 'high_contrast_mobile'
      },
      'TikTok': {
        dimensions: '1080x1920',
        format: 'MP4',
        optimization: 'vertical_energetic'
      },
      'LinkedIn': {
        dimensions: '1200x627',
        format: 'JPG',
        optimization: 'professional_clean'
      },
      'YouTube': {
        dimensions: '1920x1080',
        format: 'JPG',
        optimization: 'thumbnail_engaging'
      }
    }
    
    return specs[platform] || specs['Instagram']
  }

  // Métodos para gestión de templates
  async addTemplate(template: ContentTemplate) {
    this.templates.set(template.id, template)
    
    // Guardar en base de datos
    const { error } = await supabase
      .from('content_templates')
      .insert(template)
    
    if (error) {
      console.error('Error saving template:', error)
    }
  }

  async updateTemplate(id: string, updates: Partial<ContentTemplate>) {
    const template = this.templates.get(id)
    if (!template) {
      throw new Error(`Template ${id} not found`)
    }
    
    const updated = { ...template, ...updates }
    this.templates.set(id, updated)
    
    const { error } = await supabase
      .from('content_templates')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating template:', error)
    }
  }

  getAvailableTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values())
  }

  getTemplateById(id: string): ContentTemplate | undefined {
    return this.templates.get(id)
  }
}

// Instancia singleton
export const contentTemplateEngine = new ContentTemplateEngine()
