/**
 * Recommendation Engine Service
 * Motor de recomendaciones automáticas para MarketPro GT
 * Basado en: mejoras/jsons/js_recommendation_engines.json
 */

import { supabase } from './supabase'






// Tipos para motor de recomendaciones
export interface ContentItem {
  id: string
  title: string
  content: string
  type: 'post' | 'campaign' | 'ad' | 'content'
  platform: string
  tags: string[]
  metrics: {
    engagement_rate: number
    reach: number
    clicks: number
    shares: number
    comments: number
    likes: number
  }
  created_at: string
  performance_score: number
}

export interface UserProfile {
  id: string
  interests: string[]
  preferred_platforms: string[]
  content_types: string[]
  engagement_history: {
    content_id: string
    engagement_type: 'like' | 'share' | 'comment' | 'click'
    timestamp: string
  }[]
  demographics?: {
    age_range?: string
    location?: string
    industry?: string
  }
}

export interface Recommendation {
  content_id: string
  title: string
  content: string
  type: string
  platform: string
  score: number
  reasons: string[]
  confidence: number
  similarity_factors: {
    tag_similarity: number
    performance_similarity: number
    platform_preference: number
    engagement_pattern: number
  }
}

export interface RecommendationRequest {
  user_id: string
  content_type?: string
  platform?: string
  limit?: number
  include_reasons?: boolean
}

export interface RecommendationBatch {
  user_id: string
  recommendations: Recommendation[]
  total_count: number
  generated_at: string
  algorithm_used: string
}

// Clase principal del motor de recomendaciones
export class RecommendationEngineService {
  private tfidfCache = new Map<string, number>()
  private documentVectors = new Map<string, Map<string, number>>()
  private similarityCache = new Map<string, Map<string, number>>()

  /**
   * Genera recomendaciones para un usuario
   */
  async generateRecommendations(request: RecommendationRequest): Promise<RecommendationBatch> {
    try {
      // Obtener perfil del usuario
      const userProfile = await this.getUserProfile(request.user_id)
      if (!userProfile) {
        throw new Error('Perfil de usuario no encontrado')
      }

      // Obtener contenido disponible
      const availableContent = await this.getAvailableContent({
        content_type: request.content_type,
        platform: request.platform
      })

      // Calcular recomendaciones
      const recommendations = await this.calculateRecommendations(
        userProfile,
        availableContent,
        request.limit || 10
      )

      return {
        user_id: request.user_id,
        recommendations,
        total_count: recommendations.length,
        generated_at: new Date().toISOString(),
        algorithm_used: 'content-based-tfidf'
      }
    } catch (error) {
      console.error('Error generando recomendaciones:', error)
      throw error
    }
  }

  /**
   * Entrena el modelo con datos históricos
   */
  async trainModel(clientId?: string): Promise<void> {
    try {
      // Obtener todos los contenidos
      const contents = await this.getAllContent(clientId)
      
      // Procesar documentos
      const processedDocs = this.formatData(contents)
      
      // Calcular TF-IDF
      const tfidf = this.calculateTFIDF(processedDocs)
      
      // Crear vectores de documentos
      const documentVectors = this.createVectorsFromDocs(processedDocs, tfidf)
      
      // Calcular similitudes
      const similarities = this.calcSimilarities(documentVectors)
      
      // Guardar en caché
      this.documentVectors = documentVectors
      this.similarityCache = similarities
      
    } catch (error) {
      console.error('Error entrenando modelo:', error)
      throw error
    }
  }

  /**
   * Obtiene contenido similar
   */
  async getSimilarContent(contentId: string, limit: number = 5): Promise<Recommendation[]> {
    try {
      const similarities = this.similarityCache.get(contentId)
      if (!similarities) {
        return []
      }

      const similarItems = Array.from(similarities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)

      const recommendations: Recommendation[] = []
      
      for (const [similarId, score] of similarItems) {
        const content = await this.getContentById(similarId)
        if (content) {
          recommendations.push({
            content_id: content.id,
            title: content.title,
            content: content.content,
            type: content.type,
            platform: content.platform,
            score,
            reasons: [`Similitud de contenido: ${(score * 100).toFixed(1)}%`],
            confidence: score,
            similarity_factors: {
              tag_similarity: score,
              performance_similarity: 0,
              platform_preference: 0,
              engagement_pattern: 0
            }
          })
        }
      }

      return recommendations
    } catch (error) {
      console.error('Error obteniendo contenido similar:', error)
      return []
    }
  }

  /**
   * Obtiene perfil del usuario
   */
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error obteniendo perfil de usuario:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error)
      return null
    }
  }

  /**
   * Obtiene contenido disponible
   */
  private async getAvailableContent(filters: {
    content_type?: string
    platform?: string
  }): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_items')
        .select('*')
        .eq('is_active', true)

      if (filters.content_type) {
        query = query.eq('type', filters.content_type)
      }

      if (filters.platform) {
        query = query.eq('platform', filters.platform)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error obteniendo contenido:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error obteniendo contenido disponible:', error)
      return []
    }
  }

  /**
   * Obtiene todo el contenido
   */
  private async getAllContent(clientId?: string): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_items')
        .select('*')

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error obteniendo todo el contenido:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error obteniendo todo el contenido:', error)
      return []
    }
  }

  /**
   * Obtiene contenido por ID
   */
  private async getContentById(contentId: string): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) {
        console.error('Error obteniendo contenido por ID:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error obteniendo contenido por ID:', error)
      return null
    }
  }

  /**
   * Formatea datos para procesamiento
   */
  private formatData(contents: ContentItem[]): Array<{ id: string; content: string }> {
    return contents.map(content => ({
      id: content.id,
      content: `${content.title} ${content.content} ${content.tags.join(' ')}`.toLowerCase()
    }))
  }

  /**
   * Calcula TF-IDF
   */
  private calculateTFIDF(processedDocs: Array<{ id: string; content: string }>): Map<string, Map<string, number>> {
    const tfidf = new Map<string, Map<string, number>>()
    const documentCount = processedDocs.length
    const termDocumentCount = new Map<string, number>()

    // Contar documentos que contienen cada término
    processedDocs.forEach(doc => {
      const terms = new Set(doc.content.split(/\s+/))
      terms.forEach(term => {
        termDocumentCount.set(term, (termDocumentCount.get(term) || 0) + 1)
      })
    })

    // Calcular TF-IDF para cada documento
    processedDocs.forEach(doc => {
      const termFreq = new Map<string, number>()
      const terms = doc.content.split(/\s+/)
      
      // Calcular frecuencia de términos
      terms.forEach(term => {
        termFreq.set(term, (termFreq.get(term) || 0) + 1)
      })

      const docTfidf = new Map<string, number>()
      termFreq.forEach((tf, term) => {
        const idf = Math.log(documentCount / (termDocumentCount.get(term) || 1))
        const tfidfScore = tf * idf
        docTfidf.set(term, tfidfScore)
      })

      tfidf.set(doc.id, docTfidf)
    })

    return tfidf
  }

  /**
   * Crea vectores de documentos
   */
  private createVectorsFromDocs(
    processedDocs: Array<{ id: string; content: string }>,
    tfidf: Map<string, Map<string, number>>
  ): Map<string, Map<string, number>> {
    const documentVectors = new Map<string, Map<string, number>>()

    processedDocs.forEach(doc => {
      const vector = tfidf.get(doc.id) || new Map()
      documentVectors.set(doc.id, vector)
    })

    return documentVectors
  }

  /**
   * Calcula similitudes entre documentos
   */
  private calcSimilarities(documentVectors: Map<string, Map<string, number>>): Map<string, Map<string, number>> {
    const MAX_SIMILAR = 20
    const MIN_SCORE = 0.2
    const similarities = new Map<string, Map<string, number>>()

    // Inicializar mapas de similitud
    documentVectors.forEach((_, docId) => {
      similarities.set(docId, new Map())
    })

    // Calcular similitudes
    const docIds = Array.from(documentVectors.keys())
    
    for (let i = 0; i < docIds.length; i++) {
      for (let j = i + 1; j < docIds.length; j++) {
        const docId1 = docIds[i]
        const docId2 = docIds[j]
        const vector1 = documentVectors.get(docId1)!
        const vector2 = documentVectors.get(docId2)!

        const similarity = this.getCosineSimilarity(vector1, vector2)
        
        if (similarity > MIN_SCORE) {
          similarities.get(docId1)!.set(docId2, similarity)
          similarities.get(docId2)!.set(docId1, similarity)
        }
      }
    }

    // Limitar número de similitudes por documento
    similarities.forEach((docSimilarities) => {
      const sortedSimilarities = Array.from(docSimilarities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_SIMILAR)
      
      docSimilarities.clear()
      sortedSimilarities.forEach(([id, score]) => {
        docSimilarities.set(id, score)
      })
    })

    return similarities
  }

  /**
   * Calcula similitud coseno entre dos vectores
   */
  private getCosineSimilarity(vector1: Map<string, number>, vector2: Map<string, number>): number {
    const dotProduct = this.getDotProduct(vector1, vector2)
    const length1 = this.getVectorLength(vector1)
    const length2 = this.getVectorLength(vector2)

    if (length1 === 0 || length2 === 0) {
      return 0
    }

    return dotProduct / (length1 * length2)
  }

  /**
   * Calcula producto punto entre dos vectores
   */
  private getDotProduct(vector1: Map<string, number>, vector2: Map<string, number>): number {
    let dotProduct = 0
    
    vector1.forEach((value1, term) => {
      const value2 = vector2.get(term) || 0
      dotProduct += value1 * value2
    })

    return dotProduct
  }

  /**
   * Calcula longitud de un vector
   */
  private getVectorLength(vector: Map<string, number>): number {
    let length = 0
    
    vector.forEach((value) => {
      length += value * value
    })

    return Math.sqrt(length)
  }

  /**
   * Calcula recomendaciones basadas en perfil de usuario
   */
  private async calculateRecommendations(
    userProfile: UserProfile,
    availableContent: ContentItem[],
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    for (const content of availableContent) {
      const score = this.calculateContentScore(userProfile, content)
      
      if (score > 0.1) { // Umbral mínimo
        const reasons = this.generateReasons(userProfile, content, score)
        
        recommendations.push({
          content_id: content.id,
          title: content.title,
          content: content.content,
          type: content.type,
          platform: content.platform,
          score,
          reasons,
          confidence: score,
          similarity_factors: {
            tag_similarity: this.calculateTagSimilarity(userProfile.interests, content.tags),
            performance_similarity: content.performance_score / 100,
            platform_preference: userProfile.preferred_platforms.includes(content.platform) ? 1 : 0,
            engagement_pattern: this.calculateEngagementPattern(userProfile, content)
          }
        })
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Calcula score de contenido para un usuario
   */
  private calculateContentScore(userProfile: UserProfile, content: ContentItem): number {
    let score = 0

    // Similitud de tags (40% del score)
    const tagSimilarity = this.calculateTagSimilarity(userProfile.interests, content.tags)
    score += tagSimilarity * 0.4

    // Preferencia de plataforma (20% del score)
    if (userProfile.preferred_platforms.includes(content.platform)) {
      score += 0.2
    }

    // Preferencia de tipo de contenido (20% del score)
    if (userProfile.content_types.includes(content.type)) {
      score += 0.2
    }

    // Patrón de engagement (20% del score)
    const engagementPattern = this.calculateEngagementPattern(userProfile, content)
    score += engagementPattern * 0.2

    return Math.min(score, 1)
  }

  /**
   * Calcula similitud de tags
   */
  private calculateTagSimilarity(userInterests: string[], contentTags: string[]): number {
    if (userInterests.length === 0 || contentTags.length === 0) {
      return 0
    }

    const commonTags = userInterests.filter(interest => 
      contentTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    )

    return commonTags.length / Math.max(userInterests.length, contentTags.length)
  }

  /**
   * Calcula patrón de engagement
   */
  private calculateEngagementPattern(userProfile: UserProfile, content: ContentItem): number {
    // Simular patrón basado en historial de engagement
    const similarEngagements = userProfile.engagement_history.filter(engagement => {
      // Aquí podrías implementar lógica más sofisticada
      return true // Simplificado por ahora
    })

    return Math.min(similarEngagements.length / 10, 1) // Normalizar a 0-1
  }

  /**
   * Genera razones para la recomendación
   */
  private generateReasons(userProfile: UserProfile, content: ContentItem, score: number): string[] {
    const reasons: string[] = []

    // Razones basadas en tags
    const commonTags = userProfile.interests.filter(interest => 
      content.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    )
    
    if (commonTags.length > 0) {
      reasons.push(`Intereses relacionados: ${commonTags.join(', ')}`)
    }

    // Razones basadas en plataforma
    if (userProfile.preferred_platforms.includes(content.platform)) {
      reasons.push(`Plataforma preferida: ${content.platform}`)
    }

    // Razones basadas en rendimiento
    if (content.performance_score > 70) {
      reasons.push('Alto rendimiento histórico')
    }

    // Razones basadas en tipo de contenido
    if (userProfile.content_types.includes(content.type)) {
      reasons.push(`Tipo de contenido preferido: ${content.type}`)
    }

    return reasons
  }
}

// Función para crear una instancia del servicio
export function createRecommendationEngineService(): RecommendationEngineService {
  return new RecommendationEngineService()
}
