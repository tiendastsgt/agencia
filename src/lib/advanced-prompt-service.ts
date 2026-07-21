import { supabase } from './supabase'

// Interfaces basadas en la investigación de prompts
export interface PromptTemplate {
  id: string
  name: string
  category: 'copywriting' | 'image_generation' | 'video_generation' | 'sentiment_analysis'
  structure: PromptStructure
  variables: string[]
  examples: PromptExample[]
  performance_metrics?: {
    success_rate: number
    avg_quality_score: number
    last_updated: string
  }
}

export interface PromptStructure {
  role: string
  context: string
  instruction: string
  examples?: string
  output_format: string
  constraints: string[]
}

export interface PromptExample {
  input: Record<string, any>
  output: string
  quality_score: number
}

export interface AdvancedPromptRequest {
  template_id: string
  variables: Record<string, any>
  target_audience?: string
  brand_voice?: string
  channel?: string
  objective?: string
}

export interface PromptOptimizationResult {
  original_prompt: string
  optimized_prompt: string
  improvements: string[]
  expected_quality_improvement: number
}

export class AdvancedPromptService {
  private templates: Map<string, PromptTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  // Inicializar plantillas basadas en la investigación
  private initializeTemplates() {
    // Plantilla para generación de imágenes de producto
    const productImageTemplate: PromptTemplate = {
      id: 'product_image_photorealistic',
      name: 'Product Photography - Photorealistic',
      category: 'image_generation',
      structure: {
        role: 'Act as a professional product photographer specializing in luxury goods and commercial photography',
        context: 'Create a high-quality product image for {product_name}, a {product_type} with {key_features}. Target audience: {target_audience}. Brand personality: {brand_voice}',
        instruction: 'Generate a photorealistic product image that showcases the product in the best possible light, emphasizing its premium quality and appeal to the target audience',
        output_format: 'High-resolution image with professional lighting and composition',
        constraints: [
          'No text or watermarks',
          'Clean, uncluttered background',
          'Professional product photography style',
          'Emphasize product quality and premium feel'
        ]
      },
      variables: ['product_name', 'product_type', 'key_features', 'target_audience', 'brand_voice'],
      examples: [
        {
          input: {
            product_name: 'Liendrex Anti-Lice Shampoo',
            product_type: 'healthcare product',
            key_features: 'natural ingredients, effective treatment, family-safe',
            target_audience: 'concerned parents',
            brand_voice: 'trustworthy, caring, professional'
          },
          output: 'Professional product photography of Liendrex Anti-Lice Shampoo, a healthcare product with natural ingredients, effective treatment, family-safe features. The product is displayed in a modern bathroom setting with soft, natural lighting. The composition emphasizes cleanliness and trust, appealing to concerned parents. The brand voice is trustworthy, caring, and professional. High-resolution image with professional lighting and composition, clean background, no text or watermarks, premium product photography style.',
          quality_score: 9.2
        }
      ]
    }

    // Plantilla para copywriting persuasivo
    const copywritingTemplate: PromptTemplate = {
      id: 'persuasive_copy_aida',
      name: 'Persuasive Copywriting - AIDA Framework',
      category: 'copywriting',
      structure: {
        role: 'Act as an expert direct response copywriter with 15+ years of experience in digital marketing',
        context: 'Write persuasive copy for {product_name} targeting {target_audience}. Product benefits: {key_benefits}. Brand voice: {brand_voice}. Channel: {channel}',
        instruction: 'Create compelling copy using the AIDA framework (Attention, Interest, Desire, Action) that drives conversions',
        output_format: 'Structured copy with clear AIDA sections and strong call-to-action',
        constraints: [
          'Maximum {word_limit} words',
          'Include emotional triggers',
          'Use power words for urgency and exclusivity',
          'End with clear call-to-action'
        ]
      },
      variables: ['product_name', 'target_audience', 'key_benefits', 'brand_voice', 'channel', 'word_limit'],
      examples: [
        {
          input: {
            product_name: 'Liendrex Anti-Lice Treatment',
            target_audience: 'worried parents',
            key_benefits: 'natural, effective, safe for children',
            brand_voice: 'caring, trustworthy, professional',
            channel: 'Facebook Ad',
            word_limit: '150'
          },
          output: 'ATTENTION: Tired of endless battles with lice? INTEREST: Liendrex offers a natural, effective solution that parents trust. Our gentle formula is safe for children while being powerful against lice. DESIRE: Join thousands of satisfied parents who have found peace of mind with Liendrex. No harsh chemicals, just proven results. ACTION: Get your Liendrex treatment today and protect your family naturally.',
          quality_score: 8.8
        }
      ]
    }

    // Plantilla para análisis de sentimientos avanzado
    const sentimentAnalysisTemplate: PromptTemplate = {
      id: 'advanced_sentiment_analysis',
      name: 'Advanced Sentiment Analysis with Emotions',
      category: 'sentiment_analysis',
      structure: {
        role: 'Act as an expert in sentiment analysis and emotional intelligence with deep understanding of consumer psychology',
        context: 'Analyze the sentiment and emotional undertones of {text_type} from {platform} regarding {brand/product}. Target audience: {target_audience}',
        instruction: 'Perform comprehensive sentiment analysis including emotional mapping, intent detection, and actionable insights',
        output_format: 'Structured JSON with sentiment scores, emotions, intent, and recommendations',
        constraints: [
          'Provide confidence scores for each analysis',
          'Identify specific emotional triggers',
          'Suggest actionable improvements',
          'Consider cultural context for Guatemala'
        ]
      },
      variables: ['text_type', 'platform', 'brand/product', 'target_audience'],
      examples: [
        {
          input: {
            text_type: 'customer review',
            platform: 'Facebook',
            'brand/product': 'Liendrex shampoo',
            target_audience: 'Guatemalan parents'
          },
          output: '{"sentiment": "positive", "confidence": 0.92, "emotions": {"satisfaction": 0.85, "relief": 0.78, "trust": 0.82}, "intent": "recommendation", "key_phrases": ["funciona perfecto", "recomiendo", "sin químicos"], "cultural_insights": "Values natural products and family safety", "recommendations": ["Highlight natural ingredients", "Emphasize family safety", "Use testimonials from local parents"]}',
          quality_score: 9.1
        }
      ]
    }

    this.templates.set('product_image_photorealistic', productImageTemplate)
    this.templates.set('persuasive_copy_aida', copywritingTemplate)
    this.templates.set('advanced_sentiment_analysis', sentimentAnalysisTemplate)
  }

  // Generar prompt usando plantilla avanzada
  async generateAdvancedPrompt(request: AdvancedPromptRequest): Promise<string> {
    const template = this.templates.get(request.template_id)
    if (!template) {
      throw new Error(`Template ${request.template_id} not found`)
    }

    // Aplicar técnicas avanzadas de prompt engineering
    let prompt = this.buildBasePrompt(template, request)
    
    // Aplicar EmotionPrompt technique
    prompt = this.applyEmotionPrompt(prompt, request)
    
    // Aplicar Chain-of-Thought si es necesario
    if (this.requiresChainOfThought(template.category)) {
      prompt = this.applyChainOfThought(prompt, template.category)
    }
    
    // Aplicar power words
    prompt = this.applyPowerWords(prompt, request.objective)
    
    return prompt
  }

  // Construir prompt base usando la estructura
  private buildBasePrompt(template: PromptTemplate, request: AdvancedPromptRequest): string {
    const { structure, variables } = template
    
    // Reemplazar variables en el contexto
    let context = structure.context
    variables.forEach(variable => {
      const value = request.variables[variable] || `{${variable}}`
      context = context.replace(`{${variable}}`, value)
    })
    
    // Construir prompt completo
    const promptParts = [
      structure.role,
      context,
      structure.instruction,
      `Output format: ${structure.output_format}`,
      `Constraints: ${structure.constraints.join(', ')}`
    ]
    
    // Agregar ejemplos si existen
    if (template.examples.length > 0) {
      const example = template.examples[0]
      promptParts.push(`Example: ${example.output}`)
    }
    
    return promptParts.join('\n\n')
  }

  // Aplicar técnica EmotionPrompt
  private applyEmotionPrompt(prompt: string, request: AdvancedPromptRequest): string {
    const emotionalEnhancements = {
      'awareness': 'This is crucial for building brand recognition and establishing market presence. The success of this content directly impacts our brand visibility.',
      'conversion': 'This content is essential for driving sales and revenue. Every word and image must be optimized for maximum conversion potential.',
      'engagement': 'This content is vital for building community and fostering customer relationships. The emotional connection we create here will determine long-term loyalty.',
      'retention': 'This content is critical for maintaining customer satisfaction and reducing churn. The quality of this output directly affects customer lifetime value.'
    }
    
    if (request.objective && emotionalEnhancements[request.objective]) {
      prompt += `\n\nIMPORTANT: ${emotionalEnhancements[request.objective]}`
    }
    
    return prompt
  }

  // Aplicar Chain-of-Thought para tareas complejas
  private applyChainOfThought(prompt: string, category: string): string {
    const cotInstructions = {
      'copywriting': 'Think step by step: 1) Analyze the target audience psychology, 2) Identify key pain points and desires, 3) Structure the message for maximum impact, 4) Craft compelling copy that drives action.',
      'image_generation': 'Think step by step: 1) Visualize the perfect composition, 2) Consider lighting and mood, 3) Plan the visual hierarchy, 4) Create the final image description.',
      'sentiment_analysis': 'Think step by step: 1) Identify emotional indicators, 2) Analyze context and cultural factors, 3) Determine underlying intent, 4) Provide actionable insights.'
    }
    
    if (cotInstructions[category]) {
      prompt += `\n\n${cotInstructions[category]}`
    }
    
    return prompt
  }

  // Determinar si requiere Chain-of-Thought
  private requiresChainOfThought(category: string): boolean {
    return ['copywriting', 'image_generation', 'sentiment_analysis'].includes(category)
  }

  // Aplicar power words según el objetivo
  private applyPowerWords(prompt: string, objective?: string): string {
    const powerWordSets = {
      'conversion': 'exclusive, limited-time, instant, guaranteed, proven, breakthrough',
      'engagement': 'discover, explore, transform, inspire, connect, share',
      'awareness': 'innovative, cutting-edge, revolutionary, game-changing, industry-leading',
      'retention': 'loyal, trusted, reliable, consistent, dependable, valued'
    }
    
    if (objective && powerWordSets[objective]) {
      prompt += `\n\nPower words to incorporate: ${powerWordSets[objective]}`
    }
    
    return prompt
  }

  // Optimizar prompt existente
  async optimizePrompt(originalPrompt: string, category: string, targetAudience?: string): Promise<PromptOptimizationResult> {
    const optimizations = []
    let optimizedPrompt = originalPrompt
    
    // Aplicar mejoras basadas en la investigación
    
    // 1. Mejorar especificidad
    if (!originalPrompt.includes('high quality') || !originalPrompt.includes('detailed')) {
      optimizedPrompt += ', high quality, detailed, professional'
      optimizations.push('Added quality descriptors')
    }
    
    // 2. Agregar contexto emocional
    if (targetAudience && !originalPrompt.includes('appealing to')) {
      optimizedPrompt += `, appealing to ${targetAudience}`
      optimizations.push('Added emotional context for target audience')
    }
    
    // 3. Mejorar estructura visual (para imágenes)
    if (category === 'image_generation' && !originalPrompt.includes('composition')) {
      optimizedPrompt += ', well-composed, visually appealing'
      optimizations.push('Enhanced visual composition guidance')
    }
    
    // 4. Agregar restricciones técnicas
    if (category === 'image_generation' && !originalPrompt.includes('no text')) {
      optimizedPrompt += ', no text, no watermarks'
      optimizations.push('Added technical constraints')
    }
    
    return {
      original_prompt: originalPrompt,
      optimized_prompt: optimizedPrompt,
      improvements: optimizations,
      expected_quality_improvement: optimizations.length * 0.15 // 15% improvement per optimization
    }
  }

  // Crear prompt para marketing específico de Guatemala
  createGuatemalanMarketingPrompt(
    product: string,
    audience: string,
    channel: string,
    objective: string
  ): string {
    const culturalContext = 'Consider Guatemalan cultural values: family importance, trust in natural products, respect for traditional medicine, and preference for authentic, caring brands.'
    
    const channelSpecifics = {
      'facebook': 'Facebook-optimized content with emotional appeal and community focus',
      'instagram': 'Instagram-optimized visual content with lifestyle appeal',
      'whatsapp': 'WhatsApp-optimized personal and direct communication',
      'tiktok': 'TikTok-optimized engaging and entertaining content'
    }
    
    const objectiveSpecifics = {
      'awareness': 'Focus on brand recognition and trust-building',
      'conversion': 'Focus on clear value proposition and urgency',
      'engagement': 'Focus on community building and interaction',
      'retention': 'Focus on customer satisfaction and loyalty'
    }
    
    return `Create marketing content for ${product} targeting ${audience} on ${channel} for ${objective} objective. ${culturalContext} ${channelSpecifics[channel] || ''} ${objectiveSpecifics[objective] || ''}. Ensure the content resonates with Guatemalan families and reflects local values.`
  }

  // Guardar plantilla personalizada
  async saveCustomTemplate(template: PromptTemplate): Promise<void> {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .insert({
          id: template.id,
          name: template.name,
          category: template.category,
          structure: template.structure,
          variables: template.variables,
          examples: template.examples,
          performance_metrics: template.performance_metrics
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error guardando plantilla personalizada:', error)
      throw error
    }
  }

  // Obtener plantillas disponibles
  getAvailableTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values())
  }

  // Obtener plantilla por ID
  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId)
  }
}

// Instancia singleton del servicio
export const advancedPromptService = new AdvancedPromptService()

// Funciones de utilidad para integración
export const createMarketingPrompt = (product: string, audience: string, channel: string, objective: string) => {
  return advancedPromptService.createGuatemalanMarketingPrompt(product, audience, channel, objective)
}

export const optimizeImagePrompt = (originalPrompt: string, targetAudience?: string) => {
  return advancedPromptService.optimizePrompt(originalPrompt, 'image_generation', targetAudience)
}

export const optimizeCopyPrompt = (originalPrompt: string, targetAudience?: string) => {
  return advancedPromptService.optimizePrompt(originalPrompt, 'copywriting', targetAudience)
}
