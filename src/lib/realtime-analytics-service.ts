/**
 * Real-time Analytics Service
 * Servicio de analytics en tiempo real para MarketPro GT
 * Basado en: mejoras/jsons/social_media_benchmarks_2025.json
 */

import { supabase } from './supabase'






// Tipos para analytics en tiempo real
export interface RealtimeMetrics {
  platform: string
  timestamp: number
  metrics: {
    posts_published: number
    inbound_engagements: number
    outbound_engagements: number
    reach: number
    impressions: number
    clicks: number
    shares: number
    comments: number
    likes: number
    followers: number
    engagement_rate: number
    click_through_rate: number
  }
  benchmarks: {
    industry_average: number
    platform_average: number
    performance_vs_benchmark: number
  }
}

export interface CampaignComparison {
  campaign_id: string
  campaign_name: string
  platform: string
  start_date: string
  end_date: string
  metrics: {
    total_posts: number
    total_engagements: number
    total_reach: number
    total_impressions: number
    total_clicks: number
    engagement_rate: number
    click_through_rate: number
    cost_per_engagement: number
    cost_per_click: number
    return_on_investment: number
  }
  performance_score: number
  status: 'active' | 'completed' | 'paused'
}

export interface PerformanceAlert {
  id: string
  type: 'engagement_drop' | 'reach_decrease' | 'cost_increase' | 'performance_spike'
  severity: 'low' | 'medium' | 'high' | 'critical'
  platform: string
  campaign_id?: string
  message: string
  current_value: number
  previous_value: number
  change_percentage: number
  threshold: number
  timestamp: number
  resolved: boolean
}

export interface DashboardData {
  realtime_metrics: RealtimeMetrics[]
  campaign_comparisons: CampaignComparison[]
  performance_alerts: PerformanceAlert[]
  summary: {
    total_platforms: number
    active_campaigns: number
    total_engagements: number
    total_reach: number
    average_engagement_rate: number
    alerts_count: number
  }
}

// Clase principal del servicio de analytics en tiempo real
export class RealtimeAnalyticsService {
  private updateInterval: number = 30000 // 30 segundos
  private alertThresholds = {
    engagement_drop: -20, // -20%
    reach_decrease: -15, // -15%
    cost_increase: 25, // +25%
    performance_spike: 50 // +50%
  }

  /**
   * Obtiene métricas en tiempo real de todas las plataformas
   */
  async getRealtimeMetrics(clientId?: string): Promise<RealtimeMetrics[]> {
    try {
      // Simulamos datos en tiempo real basados en benchmarks 2025
      const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']
      const metrics: RealtimeMetrics[] = []

      for (const platform of platforms) {
        const platformMetrics = await this.generatePlatformMetrics(platform, clientId)
        metrics.push(platformMetrics)
      }

      return metrics
    } catch (error) {
      console.error('Error obteniendo métricas en tiempo real:', error)
      return []
    }
  }

  /**
   * Obtiene comparaciones entre campañas
   */
  async getCampaignComparisons(clientId?: string): Promise<CampaignComparison[]> {
    try {
      let query = supabase
        .from('campaigns')
        .select(`
          id,
          name,
          platform,
          start_date,
          end_date,
          status,
          campaign_metrics (
            total_posts,
            total_engagements,
            total_reach,
            total_impressions,
            total_clicks,
            engagement_rate,
            click_through_rate,
            cost_per_engagement,
            cost_per_click,
            return_on_investment
          )
        `)
        .eq('is_active', true)

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error obteniendo campañas:', error)
        return []
      }

      return data.map(campaign => ({
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        platform: campaign.platform,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        metrics: campaign.campaign_metrics || {
          total_posts: 0,
          total_engagements: 0,
          total_reach: 0,
          total_impressions: 0,
          total_clicks: 0,
          engagement_rate: 0,
          click_through_rate: 0,
          cost_per_engagement: 0,
          cost_per_click: 0,
          return_on_investment: 0
        },
        performance_score: this.calculatePerformanceScore(campaign.campaign_metrics),
        status: campaign.status as 'active' | 'completed' | 'paused'
      }))
    } catch (error) {
      console.error('Error obteniendo comparaciones de campañas:', error)
      return []
    }
  }

  /**
   * Obtiene alertas de rendimiento
   */
  async getPerformanceAlerts(clientId?: string): Promise<PerformanceAlert[]> {
    try {
      let query = supabase
        .from('performance_alerts')
        .select('*')
        .eq('resolved', false)
        .order('timestamp', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error obteniendo alertas:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error obteniendo alertas de rendimiento:', error)
      return []
    }
  }

  /**
   * Obtiene datos completos del dashboard
   */
  async getDashboardData(clientId?: string): Promise<DashboardData> {
    try {
      const [realtimeMetrics, campaignComparisons, performanceAlerts] = await Promise.all([
        this.getRealtimeMetrics(clientId),
        this.getCampaignComparisons(clientId),
        this.getPerformanceAlerts(clientId)
      ])

      const summary = {
        total_platforms: realtimeMetrics.length,
        active_campaigns: campaignComparisons.filter(c => c.status === 'active').length,
        total_engagements: realtimeMetrics.reduce((sum, m) => sum + m.metrics.inbound_engagements, 0),
        total_reach: realtimeMetrics.reduce((sum, m) => sum + m.metrics.reach, 0),
        average_engagement_rate: realtimeMetrics.reduce((sum, m) => sum + m.metrics.engagement_rate, 0) / realtimeMetrics.length,
        alerts_count: performanceAlerts.length
      }

      return {
        realtime_metrics: realtimeMetrics,
        campaign_comparisons: campaignComparisons,
        performance_alerts: performanceAlerts,
        summary
      }
    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error)
      return {
        realtime_metrics: [],
        campaign_comparisons: [],
        performance_alerts: [],
        summary: {
          total_platforms: 0,
          active_campaigns: 0,
          total_engagements: 0,
          total_reach: 0,
          average_engagement_rate: 0,
          alerts_count: 0
        }
      }
    }
  }

  /**
   * Crea una alerta de rendimiento
   */
  async createPerformanceAlert(alert: Omit<PerformanceAlert, 'id' | 'timestamp'>): Promise<PerformanceAlert> {
    try {
      const newAlert: PerformanceAlert = {
        ...alert,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      }

      const { data, error } = await supabase
        .from('performance_alerts')
        .insert([newAlert])
        .select()
        .single()

      if (error) {
        console.error('Error creando alerta:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creando alerta de rendimiento:', error)
      throw error
    }
  }

  /**
   * Marca una alerta como resuelta
   */
  async resolveAlert(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('performance_alerts')
        .update({ resolved: true })
        .eq('id', alertId)

      if (error) {
        console.error('Error resolviendo alerta:', error)
        throw error
      }
    } catch (error) {
      console.error('Error resolviendo alerta:', error)
      throw error
    }
  }

  /**
   * Inicia el monitoreo en tiempo real
   */
  startRealtimeMonitoring(callback: (data: DashboardData) => void, clientId?: string): () => void {
    const interval = setInterval(async () => {
      try {
        const data = await this.getDashboardData(clientId)
        callback(data)
      } catch (error) {
        console.error('Error en monitoreo en tiempo real:', error)
      }
    }, this.updateInterval)

    // Retornar función para detener el monitoreo
    return () => clearInterval(interval)
  }

  /**
   * Genera métricas simuladas para una plataforma
   */
  private async generatePlatformMetrics(platform: string, clientId?: string): Promise<RealtimeMetrics> {
    // Benchmarks 2025 basados en la documentación
    const benchmarks = {
      facebook: { posts_per_day: 9.5, engagement_per_post: 14, engagement_growth: 0.09 },
      instagram: { posts_per_day: 9.5, engagement_per_post: 14, engagement_growth: 0.28 },
      twitter: { posts_per_day: 9.5, engagement_per_post: 13, engagement_growth: 0 },
      linkedin: { posts_per_day: 9.5, engagement_per_post: 14, engagement_growth: 0.15 },
      youtube: { posts_per_day: 9.5, engagement_per_post: 14, engagement_growth: 0.20 },
      tiktok: { posts_per_day: 9.5, engagement_per_post: 14, engagement_growth: 0.25 }
    }

    const benchmark = benchmarks[platform as keyof typeof benchmarks] || benchmarks.facebook

    // Generar métricas con variación realista
    const basePosts = benchmark.posts_per_day
    const baseEngagement = benchmark.engagement_per_post
    const variation = 0.2 // ±20% variación

    const posts_published = Math.floor(basePosts * (1 + (Math.random() - 0.5) * variation))
    const inbound_engagements = Math.floor(baseEngagement * posts_published * (1 + (Math.random() - 0.5) * variation))
    const outbound_engagements = Math.floor(inbound_engagements * 0.1) // 10% de outbound
    const reach = Math.floor(inbound_engagements * (2 + Math.random() * 3)) // 2-5x reach
    const impressions = Math.floor(reach * (1.5 + Math.random() * 1.5)) // 1.5-3x impressions
    const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.02)) // 1-3% CTR
    const shares = Math.floor(inbound_engagements * (0.1 + Math.random() * 0.1)) // 10-20% shares
    const comments = Math.floor(inbound_engagements * (0.2 + Math.random() * 0.2)) // 20-40% comments
    const likes = inbound_engagements - shares - comments
    const followers = Math.floor(10000 + Math.random() * 50000) // 10k-60k followers
    const engagement_rate = (inbound_engagements / reach) * 100
    const click_through_rate = (clicks / impressions) * 100

    return {
      platform,
      timestamp: Date.now(),
      metrics: {
        posts_published,
        inbound_engagements,
        outbound_engagements,
        reach,
        impressions,
        clicks,
        shares,
        comments,
        likes,
        followers,
        engagement_rate,
        click_through_rate
      },
      benchmarks: {
        industry_average: benchmark.engagement_per_post,
        platform_average: benchmark.engagement_per_post,
        performance_vs_benchmark: ((inbound_engagements / posts_published) / benchmark.engagement_per_post - 1) * 100
      }
    }
  }

  /**
   * Calcula el score de rendimiento de una campaña
   */
  private calculatePerformanceScore(metrics: any): number {
    if (!metrics) return 0

    const weights = {
      engagement_rate: 0.3,
      click_through_rate: 0.25,
      return_on_investment: 0.25,
      reach: 0.2
    }

    const normalizedMetrics = {
      engagement_rate: Math.min(metrics.engagement_rate / 10, 1), // Normalizar a 0-1
      click_through_rate: Math.min(metrics.click_through_rate / 5, 1), // Normalizar a 0-1
      return_on_investment: Math.min(metrics.return_on_investment / 5, 1), // Normalizar a 0-1
      reach: Math.min(metrics.total_reach / 100000, 1) // Normalizar a 0-1
    }

    return Object.entries(weights).reduce((score, [metric, weight]) => {
      return score + (normalizedMetrics[metric as keyof typeof normalizedMetrics] * weight)
    }, 0) * 100
  }
}

// Función para crear una instancia del servicio
export function createRealtimeAnalyticsService(): RealtimeAnalyticsService {
  return new RealtimeAnalyticsService()
}
