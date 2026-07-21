/**
 * Intelligent Scheduling Service
 * Servicio de programación inteligente para MarketPro GT
 * Basado en: mejoras/media/intelligent_content_scheduling.md
 */

import { supabase } from './supabase'






// Tipos para programación inteligente
export interface ContentItem {
  id: string
  title: string
  content: string
  type: 'text' | 'image' | 'video' | 'carousel'
  platform: string
  priority: number
  tags: string[]
  target_audience: string[]
  created_at: string
  scheduled_for?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
}

export interface OptimalTimeSlot {
  platform: string
  time_slot: string
  engagement_score: number
  reach_score: number
  audience_activity: number
  competition_level: number
  optimal_score: number
  timezone: string
  day_of_week: number
  hour: number
}

export interface AudienceSegment {
  id: string
  name: string
  demographics: {
    age_range: string
    location: string
    interests: string[]
    behavior_patterns: string[]
  }
  activity_patterns: {
    peak_hours: number[]
    peak_days: number[]
    timezone: string
    engagement_preferences: string[]
  }
  size: number
  engagement_rate: number
}

export interface SchedulingRecommendation {
  content_id: string
  platform: string
  optimal_time: string
  timezone: string
  expected_engagement: number
  expected_reach: number
  confidence_score: number
  reasoning: string[]
  alternative_times: OptimalTimeSlot[]
  audience_insights: {
    target_segments: string[]
    peak_activity: string
    competition_analysis: string
  }
}

export interface SchedulingQueue {
  id: string
  content_items: ContentItem[]
  priority_scores: Map<string, number>
  scheduled_times: Map<string, string>
  conflicts: SchedulingConflict[]
  optimization_suggestions: string[]
}

export interface SchedulingConflict {
  type: 'time_overlap' | 'platform_limit' | 'audience_conflict' | 'resource_conflict'
  content_ids: string[]
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  suggested_resolution: string
}

// Clase principal del servicio de programación inteligente
export class IntelligentSchedulingService {
  private platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']
  private timezoneData = new Map<string, string>()
  private audienceSegments = new Map<string, AudienceSegment>()
  private optimalTimeCache = new Map<string, OptimalTimeSlot[]>()

  constructor() {
    this.initializeTimezoneData()
    this.initializeAudienceSegments()
  }

  /**
   * Predice los mejores horarios para publicar contenido
   */
  async predictOptimalTimes(
    content: ContentItem,
    audienceSegments: string[],
    timeRange: { start: string; end: string }
  ): Promise<OptimalTimeSlot[]> {
    try {
      const cacheKey = `${content.platform}-${audienceSegments.join(',')}-${timeRange.start}-${timeRange.end}`
      
      if (this.optimalTimeCache.has(cacheKey)) {
        return this.optimalTimeCache.get(cacheKey)!
      }

      const optimalSlots: OptimalTimeSlot[] = []
      const startDate = new Date(timeRange.start)
      const endDate = new Date(timeRange.end)

      // Generar slots de tiempo para el rango especificado
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        for (let hour = 0; hour < 24; hour++) {
          const timeSlot = new Date(date)
          timeSlot.setHours(hour, 0, 0, 0)

          const slot = await this.calculateTimeSlotScore(
            content,
            timeSlot,
            audienceSegments
          )

          if (slot.optimal_score > 0.3) { // Umbral mínimo
            optimalSlots.push(slot)
          }
        }
      }

      // Ordenar por score óptimo
      optimalSlots.sort((a, b) => b.optimal_score - a.optimal_score)

      // Limitar a top 10 slots
      const topSlots = optimalSlots.slice(0, 10)
      
      this.optimalTimeCache.set(cacheKey, topSlots)
      return topSlots
    } catch (error) {
      console.error('Error prediciendo horarios óptimos:', error)
      return []
    }
  }

  /**
   * Genera recomendaciones de programación para contenido
   */
  async generateSchedulingRecommendations(
    contentItems: ContentItem[],
    audienceSegments: string[]
  ): Promise<SchedulingRecommendation[]> {
    try {
      const recommendations: SchedulingRecommendation[] = []

      for (const content of contentItems) {
        const optimalTimes = await this.predictOptimalTimes(
          content,
          audienceSegments,
          {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
          }
        )

        if (optimalTimes.length > 0) {
          const bestTime = optimalTimes[0]
          const alternativeTimes = optimalTimes.slice(1, 4)

          const recommendation: SchedulingRecommendation = {
            content_id: content.id,
            platform: content.platform,
            optimal_time: bestTime.time_slot,
            timezone: bestTime.timezone,
            expected_engagement: bestTime.engagement_score,
            expected_reach: bestTime.reach_score,
            confidence_score: bestTime.optimal_score,
            reasoning: this.generateReasoning(content, bestTime, audienceSegments),
            alternative_times: alternativeTimes,
            audience_insights: {
              target_segments: audienceSegments,
              peak_activity: this.getPeakActivityDescription(bestTime),
              competition_analysis: this.getCompetitionAnalysis(bestTime)
            }
          }

          recommendations.push(recommendation)
        }
      }

      return recommendations
    } catch (error) {
      console.error('Error generando recomendaciones de programación:', error)
      return []
    }
  }

  /**
   * Optimiza la cola de programación
   */
  async optimizeSchedulingQueue(
    contentItems: ContentItem[],
    constraints: {
      max_posts_per_day?: number
      min_interval_minutes?: number
      platform_limits?: Record<string, number>
    } = {}
  ): Promise<SchedulingQueue> {
    try {
      const queue: SchedulingQueue = {
        id: `queue_${Date.now()}`,
        content_items: [...contentItems],
        priority_scores: new Map(),
        scheduled_times: new Map(),
        conflicts: [],
        optimization_suggestions: []
      }

      // Calcular scores de prioridad
      for (const content of contentItems) {
        const priorityScore = this.calculatePriorityScore(content)
        queue.priority_scores.set(content.id, priorityScore)
      }

      // Ordenar por prioridad
      queue.content_items.sort((a, b) => {
        const scoreA = queue.priority_scores.get(a.id) || 0
        const scoreB = queue.priority_scores.get(b.id) || 0
        return scoreB - scoreA
      })

      // Programar contenido
      const scheduledTimes = new Map<string, string>()
      const platformCounts = new Map<string, number>()

      for (const content of queue.content_items) {
        const optimalTimes = await this.predictOptimalTimes(
          content,
          content.target_audience,
          {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        )

        if (optimalTimes.length > 0) {
          const bestTime = optimalTimes[0]
          const timeKey = `${content.platform}-${bestTime.time_slot}`

          // Verificar conflictos
          if (this.hasConflict(scheduledTimes, bestTime, constraints)) {
            queue.conflicts.push({
              type: 'time_overlap',
              content_ids: [content.id],
              description: `Conflicto de tiempo con ${content.platform}`,
              severity: 'medium',
              suggested_resolution: 'Ajustar horario o cambiar plataforma'
            })
            continue
          }

          scheduledTimes.set(content.id, bestTime.time_slot)
          queue.scheduled_times.set(content.id, bestTime.time_slot)

          // Actualizar contadores de plataforma
          const currentCount = platformCounts.get(content.platform) || 0
          platformCounts.set(content.platform, currentCount + 1)
        }
      }

      // Generar sugerencias de optimización
      queue.optimization_suggestions = this.generateOptimizationSuggestions(
        queue,
        platformCounts,
        constraints
      )

      return queue
    } catch (error) {
      console.error('Error optimizando cola de programación:', error)
      throw error
    }
  }

  /**
   * Analiza audiencia en tiempo real
   */
  async analyzeAudienceInRealTime(
    platform: string,
    audienceSegments: string[]
  ): Promise<{
    current_activity: number
    peak_hours: number[]
    engagement_trends: Array<{ hour: number; activity: number }>
    recommendations: string[]
  }> {
    try {
      const currentHour = new Date().getHours()
      const currentActivity = this.calculateCurrentActivity(platform, currentHour)
      const peakHours = this.getPeakHours(platform, audienceSegments)
      const engagementTrends = this.getEngagementTrends(platform, audienceSegments)

      const recommendations = this.generateAudienceRecommendations(
        currentActivity,
        peakHours,
        engagementTrends
      )

      return {
        current_activity: currentActivity,
        peak_hours: peakHours,
        engagement_trends: engagementTrends,
        recommendations
      }
    } catch (error) {
      console.error('Error analizando audiencia en tiempo real:', error)
      throw error
    }
  }

  /**
   * Ajusta automáticamente el contenido basado en análisis
   */
  async autoAdjustContent(
    content: ContentItem,
    audienceAnalysis: any,
    performanceData: any
  ): Promise<{
    adjusted_content: ContentItem
    adjustments_made: string[]
    reasoning: string[]
  }> {
    try {
      const adjustedContent = { ...content }
      const adjustmentsMade: string[] = []
      const reasoning: string[] = []

      // Ajustar horario basado en actividad de audiencia
      if (audienceAnalysis.current_activity < 0.3) {
        const newTime = this.findBetterTimeSlot(content, audienceAnalysis.peak_hours)
        if (newTime) {
          adjustedContent.scheduled_for = newTime
          adjustmentsMade.push('Horario ajustado para pico de audiencia')
          reasoning.push('Audiencia actualmente inactiva, movido a horario de mayor actividad')
        }
      }

      // Ajustar contenido basado en rendimiento
      if (performanceData.engagement_rate < 0.05) {
        // Sugerir cambios en el contenido
        if (content.type === 'text' && content.content.length < 100) {
          adjustedContent.content = this.enhanceTextContent(content.content)
          adjustmentsMade.push('Contenido de texto mejorado')
          reasoning.push('Contenido muy corto, agregado más valor')
        }
      }

      // Ajustar tags basado en tendencias
      const trendingTags = this.getTrendingTags(content.platform)
      if (trendingTags.length > 0) {
        adjustedContent.tags = [...content.tags, ...trendingTags.slice(0, 2)]
        adjustmentsMade.push('Tags actualizados con tendencias')
        reasoning.push('Agregados tags trending para mayor alcance')
      }

      return {
        adjusted_content: adjustedContent,
        adjustments_made: adjustmentsMade,
        reasoning
      }
    } catch (error) {
      console.error('Error ajustando contenido automáticamente:', error)
      throw error
    }
  }

  /**
   * Calcula el score de un slot de tiempo
   */
  private async calculateTimeSlotScore(
    content: ContentItem,
    timeSlot: Date,
    audienceSegments: string[]
  ): Promise<OptimalTimeSlot> {
    const hour = timeSlot.getHours()
    const dayOfWeek = timeSlot.getDay()
    const platform = content.platform

    // Calcular scores individuales
    const engagementScore = this.calculateEngagementScore(platform, hour, dayOfWeek, audienceSegments)
    const reachScore = this.calculateReachScore(platform, hour, dayOfWeek)
    const audienceActivity = this.calculateAudienceActivity(audienceSegments, hour, dayOfWeek)
    const competitionLevel = this.calculateCompetitionLevel(platform, hour, dayOfWeek)

    // Score óptimo combinado
    const optimalScore = (engagementScore * 0.4) + (reachScore * 0.3) + (audienceActivity * 0.2) + ((1 - competitionLevel) * 0.1)

    return {
      platform,
      time_slot: timeSlot.toISOString(),
      engagement_score: engagementScore,
      reach_score: reachScore,
      audience_activity: audienceActivity,
      competition_level: competitionLevel,
      optimal_score: optimalScore,
      timezone: this.getTimezoneForPlatform(platform),
      day_of_week: dayOfWeek,
      hour
    }
  }

  /**
   * Calcula score de engagement
   */
  private calculateEngagementScore(
    platform: string,
    hour: number,
    dayOfWeek: number,
    audienceSegments: string[]
  ): number {
    // Patrones de engagement por plataforma
    const platformPatterns = {
      facebook: { peak_hours: [9, 12, 15, 19], peak_days: [1, 2, 3, 4, 5] },
      instagram: { peak_hours: [11, 14, 17, 20], peak_days: [1, 2, 3, 4, 5] },
      twitter: { peak_hours: [8, 12, 17, 21], peak_days: [1, 2, 3, 4, 5] },
      linkedin: { peak_hours: [8, 12, 17], peak_days: [1, 2, 3, 4, 5] },
      youtube: { peak_hours: [14, 20, 22], peak_days: [0, 6] },
      tiktok: { peak_hours: [18, 19, 20, 21], peak_days: [0, 1, 2, 3, 4, 5, 6] }
    }

    const pattern = platformPatterns[platform as keyof typeof platformPatterns]
    if (!pattern) return 0.5

    const hourScore = pattern.peak_hours.includes(hour) ? 1.0 : 0.3
    const dayScore = pattern.peak_days.includes(dayOfWeek) ? 1.0 : 0.5

    return (hourScore + dayScore) / 2
  }

  /**
   * Calcula score de alcance
   */
  private calculateReachScore(platform: string, hour: number, dayOfWeek: number): number {
    // Simular score de alcance basado en patrones históricos
    const baseScore = 0.5
    const hourMultiplier = hour >= 9 && hour <= 21 ? 1.2 : 0.8
    const dayMultiplier = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.1 : 0.9

    return Math.min(1.0, baseScore * hourMultiplier * dayMultiplier)
  }

  /**
   * Calcula actividad de audiencia
   */
  private calculateAudienceActivity(audienceSegments: string[], hour: number, dayOfWeek: number): number {
    let totalActivity = 0
    let segmentCount = 0

    for (const segmentId of audienceSegments) {
      const segment = this.audienceSegments.get(segmentId)
      if (segment) {
        const hourActivity = segment.activity_patterns.peak_hours.includes(hour) ? 1.0 : 0.3
        const dayActivity = segment.activity_patterns.peak_days.includes(dayOfWeek) ? 1.0 : 0.5
        totalActivity += (hourActivity + dayActivity) / 2
        segmentCount++
      }
    }

    return segmentCount > 0 ? totalActivity / segmentCount : 0.5
  }

  /**
   * Calcula nivel de competencia
   */
  private calculateCompetitionLevel(platform: string, hour: number, dayOfWeek: number): number {
    // Simular nivel de competencia (0 = baja, 1 = alta)
    const peakHours = [9, 12, 15, 17, 19, 20]
    const peakDays = [1, 2, 3, 4, 5]

    const isPeakHour = peakHours.includes(hour)
    const isPeakDay = peakDays.includes(dayOfWeek)

    if (isPeakHour && isPeakDay) return 0.8
    if (isPeakHour || isPeakDay) return 0.5
    return 0.2
  }

  /**
   * Calcula score de prioridad del contenido
   */
  private calculatePriorityScore(content: ContentItem): number {
    let score = 0

    // Prioridad base
    score += content.priority * 0.3

    // Tipo de contenido
    const typeScores = { video: 1.0, carousel: 0.8, image: 0.6, text: 0.4 }
    score += (typeScores[content.type] || 0.5) * 0.2

    // Antigüedad del contenido
    const ageInHours = (Date.now() - new Date(content.created_at).getTime()) / (1000 * 60 * 60)
    const ageScore = Math.max(0, 1 - (ageInHours / 168)) // 1 semana
    score += ageScore * 0.2

    // Número de tags
    score += Math.min(1.0, content.tags.length / 10) * 0.1

    // Tamaño de audiencia objetivo
    score += Math.min(1.0, content.target_audience.length / 5) * 0.2

    return Math.min(1.0, score)
  }

  /**
   * Verifica conflictos en la programación
   */
  private hasConflict(
    scheduledTimes: Map<string, string>,
    timeSlot: OptimalTimeSlot,
    constraints: any
  ): boolean {
    // Verificar intervalo mínimo
    if (constraints.min_interval_minutes) {
      for (const [contentId, scheduledTime] of scheduledTimes) {
        const timeDiff = Math.abs(
          new Date(timeSlot.time_slot).getTime() - new Date(scheduledTime).getTime()
        )
        if (timeDiff < constraints.min_interval_minutes * 60 * 1000) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Genera razonamiento para recomendaciones
   */
  private generateReasoning(
    content: ContentItem,
    timeSlot: OptimalTimeSlot,
    audienceSegments: string[]
  ): string[] {
    const reasoning: string[] = []

    if (timeSlot.engagement_score > 0.7) {
      reasoning.push('Alto potencial de engagement en este horario')
    }

    if (timeSlot.audience_activity > 0.8) {
      reasoning.push('Audiencia objetivo muy activa')
    }

    if (timeSlot.competition_level < 0.3) {
      reasoning.push('Baja competencia en este horario')
    }

    if (timeSlot.reach_score > 0.7) {
      reasoning.push('Excelente potencial de alcance')
    }

    return reasoning
  }

  /**
   * Obtiene descripción de actividad pico
   */
  private getPeakActivityDescription(timeSlot: OptimalTimeSlot): string {
    const hour = timeSlot.hour
    if (hour >= 9 && hour <= 17) return 'Horario laboral - audiencia profesional activa'
    if (hour >= 18 && hour <= 22) return 'Horario nocturno - audiencia general activa'
    return 'Horario de baja actividad'
  }

  /**
   * Obtiene análisis de competencia
   */
  private getCompetitionAnalysis(timeSlot: OptimalTimeSlot): string {
    if (timeSlot.competition_level < 0.3) return 'Baja competencia - oportunidad excelente'
    if (timeSlot.competition_level < 0.6) return 'Competencia moderada - buena oportunidad'
    return 'Alta competencia - considera horarios alternativos'
  }

  /**
   * Inicializa datos de zona horaria
   */
  private initializeTimezoneData(): void {
    this.timezoneData.set('facebook', 'America/Guatemala')
    this.timezoneData.set('instagram', 'America/Guatemala')
    this.timezoneData.set('twitter', 'America/Guatemala')
    this.timezoneData.set('linkedin', 'America/Guatemala')
    this.timezoneData.set('youtube', 'America/Guatemala')
    this.timezoneData.set('tiktok', 'America/Guatemala')
  }

  /**
   * Inicializa segmentos de audiencia
   */
  private initializeAudienceSegments(): void {
    // Segmentos de audiencia predefinidos
    const segments: AudienceSegment[] = [
      {
        id: 'professionals',
        name: 'Profesionales',
        demographics: {
          age_range: '25-45',
          location: 'Guatemala',
          interests: ['negocios', 'tecnología', 'desarrollo profesional'],
          behavior_patterns: ['activos en horario laboral', 'usan LinkedIn']
        },
        activity_patterns: {
          peak_hours: [8, 12, 17],
          peak_days: [1, 2, 3, 4, 5],
          timezone: 'America/Guatemala',
          engagement_preferences: ['contenido educativo', 'casos de estudio']
        },
        size: 10000,
        engagement_rate: 0.08
      },
      {
        id: 'young_adults',
        name: 'Jóvenes Adultos',
        demographics: {
          age_range: '18-30',
          location: 'Guatemala',
          interests: ['entretenimiento', 'música', 'moda', 'tecnología'],
          behavior_patterns: ['activos en redes sociales', 'usan Instagram y TikTok']
        },
        activity_patterns: {
          peak_hours: [18, 19, 20, 21],
          peak_days: [0, 1, 2, 3, 4, 5, 6],
          timezone: 'America/Guatemala',
          engagement_preferences: ['contenido visual', 'trends', 'humor']
        },
        size: 25000,
        engagement_rate: 0.12
      }
    ]

    segments.forEach(segment => {
      this.audienceSegments.set(segment.id, segment)
    })
  }

  /**
   * Obtiene zona horaria para plataforma
   */
  private getTimezoneForPlatform(platform: string): string {
    return this.timezoneData.get(platform) || 'America/Guatemala'
  }

  /**
   * Calcula actividad actual
   */
  private calculateCurrentActivity(platform: string, hour: number): number {
    const patterns = {
      facebook: [9, 12, 15, 19],
      instagram: [11, 14, 17, 20],
      twitter: [8, 12, 17, 21],
      linkedin: [8, 12, 17],
      youtube: [14, 20, 22],
      tiktok: [18, 19, 20, 21]
    }

    const peakHours = patterns[platform as keyof typeof patterns] || []
    return peakHours.includes(hour) ? 0.8 : 0.3
  }

  /**
   * Obtiene horas pico
   */
  private getPeakHours(platform: string, audienceSegments: string[]): number[] {
    const patterns = {
      facebook: [9, 12, 15, 19],
      instagram: [11, 14, 17, 20],
      twitter: [8, 12, 17, 21],
      linkedin: [8, 12, 17],
      youtube: [14, 20, 22],
      tiktok: [18, 19, 20, 21]
    }

    return patterns[platform as keyof typeof patterns] || []
  }

  /**
   * Obtiene tendencias de engagement
   */
  private getEngagementTrends(platform: string, audienceSegments: string[]): Array<{ hour: number; activity: number }> {
    const trends: Array<{ hour: number; activity: number }> = []
    
    for (let hour = 0; hour < 24; hour++) {
      const activity = this.calculateCurrentActivity(platform, hour)
      trends.push({ hour, activity })
    }

    return trends
  }

  /**
   * Genera recomendaciones de audiencia
   */
  private generateAudienceRecommendations(
    currentActivity: number,
    peakHours: number[],
    engagementTrends: Array<{ hour: number; activity: number }>
  ): string[] {
    const recommendations: string[] = []

    if (currentActivity < 0.4) {
      recommendations.push('Audiencia actualmente inactiva, considera programar para horas pico')
    }

    if (peakHours.length > 0) {
      recommendations.push(`Horas pico identificadas: ${peakHours.join(', ')}`)
    }

    const maxActivity = Math.max(...engagementTrends.map(t => t.activity))
    const bestHour = engagementTrends.find(t => t.activity === maxActivity)?.hour

    if (bestHour !== undefined) {
      recommendations.push(`Mejor hora para engagement: ${bestHour}:00`)
    }

    return recommendations
  }

  /**
   * Encuentra mejor slot de tiempo
   */
  private findBetterTimeSlot(content: ContentItem, peakHours: number[]): string | null {
    if (peakHours.length === 0) return null

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(peakHours[0], 0, 0, 0)

    return tomorrow.toISOString()
  }

  /**
   * Mejora contenido de texto
   */
  private enhanceTextContent(content: string): string {
    // Simular mejora de contenido
    const enhancements = [
      '💡 Tip: ',
      '🚀 Pro tip: ',
      '✨ Bonus: ',
      '🎯 Clave: '
    ]

    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)]
    return randomEnhancement + content + ' ¿Qué opinas?'
  }

  /**
   * Obtiene tags trending
   */
  private getTrendingTags(platform: string): string[] {
    const trendingTags = {
      facebook: ['#negocios', '#tecnología', '#guatemala'],
      instagram: ['#guatemala', '#emprendimiento', '#marketing'],
      twitter: ['#tech', '#startup', '#digital'],
      linkedin: ['#profesional', '#carrera', '#liderazgo'],
      youtube: ['#tutorial', '#educación', '#contenido'],
      tiktok: ['#viral', '#trending', '#creativo']
    }

    return trendingTags[platform as keyof typeof trendingTags] || []
  }

  /**
   * Genera sugerencias de optimización
   */
  private generateOptimizationSuggestions(
    queue: SchedulingQueue,
    platformCounts: Map<string, number>,
    constraints: any
  ): string[] {
    const suggestions: string[] = []

    // Verificar límites de plataforma
    if (constraints.platform_limits) {
      for (const [platform, limit] of Object.entries(constraints.platform_limits)) {
        const currentCount = platformCounts.get(platform) || 0
        if (currentCount > limit) {
          suggestions.push(`Reducir publicaciones en ${platform} (actual: ${currentCount}, límite: ${limit})`)
        }
      }
    }

    // Verificar distribución de contenido
    const totalContent = queue.content_items.length
    const scheduledContent = queue.scheduled_times.size
    const unscheduledContent = totalContent - scheduledContent

    if (unscheduledContent > 0) {
      suggestions.push(`${unscheduledContent} contenido sin programar, revisar conflictos`)
    }

    // Sugerir optimizaciones de horario
    if (queue.conflicts.length > 0) {
      suggestions.push('Resolver conflictos de programación para optimizar distribución')
    }

    return suggestions
  }
}

// Función para crear una instancia del servicio
export function createIntelligentSchedulingService(): IntelligentSchedulingService {
  return new IntelligentSchedulingService()
}

// Exportar instancia singleton
export const intelligentSchedulingService = IntelligentSchedulingService.getInstance();

// Exportar interfaces para uso en componentes
export type { AudienceAnalysis, OptimalSchedule, CampaignSchedule };
