/**
 * YouTube Analytics API Service
 * Implementación completa de la API de YouTube Analytics para MarketPro GT
 * Basado en: mejoras/jsons/youtube_analytics_api_docs.json
 */

import { supabase } from './supabase'






// Tipos para la API de YouTube Analytics
export interface YouTubeChannel {
  id: string
  title: string
  description: string
  customUrl: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
  country: string
  viewCount: string
  subscriberCount: string
  videoCount: string
  privacyStatus: string
  uploads: string
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
    standard: { url: string; width: number; height: number }
    maxres: { url: string; width: number; height: number }
  }
  channelId: string
  channelTitle: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  privacyStatus: string
  categoryId: string
  tags: string[]
}

export interface YouTubeAnalyticsReport {
  kind: string
  columnHeaders: Array<{
    name: string
    columnType: string
    dataType: string
  }>
  rows: Array<Array<string | number>>
}

export interface YouTubeAnalyticsMetrics {
  // Métricas principales
  views: number
  estimatedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
  engagedViews: number
  viewerPercentage: number
  
  // Métricas de engagement
  likes: number
  dislikes: number
  comments: number
  shares: number
  subscribersGained: number
  subscribersLost: number
  
  // Métricas de ingresos
  estimatedRevenue: number
  estimatedAdRevenue: number
  estimatedRedPartnerRevenue: number
  
  // Métricas de anuncios
  adImpressions: number
  monetizedPlaybacks: number
  grossRevenue: number
  cpm: number
  playbackBasedCpm: number
  
  // Métricas de listas de reproducción
  playlistViews: number
  playlistStarts: number
  playlistSaves: number
  averageTimeInPlaylist: number
  
  // Métricas de anotaciones
  annotationImpressions: number
  annotationClicks: number
  annotationClickThroughRate: number
  annotationCloseRate: number
  
  // Métricas de tarjetas
  cardImpressions: number
  cardClicks: number
  cardClickRate: number
  
  // Métricas de transmisión en vivo
  averageConcurrentViewers: number
  peakConcurrentViewers: number
}

export interface YouTubeAnalyticsRequest {
  ids: string
  startDate: string
  endDate: string
  metrics: string[]
  dimensions?: string[]
  sort?: string
  filters?: string
  maxResults?: number
  startIndex?: number
}

// Clase principal del servicio de YouTube Analytics API
export class YouTubeAnalyticsService {
  private baseURL = 'https://youtubeanalytics.googleapis.com/v2'
  private dataURL = 'https://www.googleapis.com/youtube/v3'
  private accessToken: string
  private channelId: string

  constructor(accessToken: string, channelId: string) {
    this.accessToken = accessToken
    this.channelId = channelId
  }

  /**
   * Obtiene información del canal
   */
  async getChannelInfo(): Promise<YouTubeChannel> {
    const response = await this.makeDataRequest('/channels', {
      part: 'snippet,statistics,contentDetails',
      id: this.channelId
    })

    if (!response.items || response.items.length === 0) {
      throw new Error('Canal no encontrado')
    }

    return response.items[0]
  }

  /**
   * Obtiene videos del canal
   */
  async getChannelVideos(maxResults = 50): Promise<YouTubeVideo[]> {
    const response = await this.makeDataRequest('/search', {
      part: 'snippet',
      channelId: this.channelId,
      type: 'video',
      order: 'date',
      maxResults: maxResults.toString()
    })

    return response.items || []
  }

  /**
   * Obtiene métricas básicas del canal
   */
  async getChannelMetrics(startDate: string, endDate: string): Promise<YouTubeAnalyticsMetrics> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'views',
        'estimatedMinutesWatched',
        'averageViewDuration',
        'averageViewPercentage',
        'engagedViews',
        'viewerPercentage',
        'likes',
        'dislikes',
        'comments',
        'shares',
        'subscribersGained',
        'subscribersLost'
      ]
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return this.getEmptyMetrics()
    }

    const row = response.rows[0]
    const headers = response.columnHeaders.map(h => h.name)

    return {
      views: this.getMetricValue(row, headers, 'views'),
      estimatedMinutesWatched: this.getMetricValue(row, headers, 'estimatedMinutesWatched'),
      averageViewDuration: this.getMetricValue(row, headers, 'averageViewDuration'),
      averageViewPercentage: this.getMetricValue(row, headers, 'averageViewPercentage'),
      engagedViews: this.getMetricValue(row, headers, 'engagedViews'),
      viewerPercentage: this.getMetricValue(row, headers, 'viewerPercentage'),
      likes: this.getMetricValue(row, headers, 'likes'),
      dislikes: this.getMetricValue(row, headers, 'dislikes'),
      comments: this.getMetricValue(row, headers, 'comments'),
      shares: this.getMetricValue(row, headers, 'shares'),
      subscribersGained: this.getMetricValue(row, headers, 'subscribersGained'),
      subscribersLost: this.getMetricValue(row, headers, 'subscribersLost'),
      estimatedRevenue: 0,
      estimatedAdRevenue: 0,
      estimatedRedPartnerRevenue: 0,
      adImpressions: 0,
      monetizedPlaybacks: 0,
      grossRevenue: 0,
      cpm: 0,
      playbackBasedCpm: 0,
      playlistViews: 0,
      playlistStarts: 0,
      playlistSaves: 0,
      averageTimeInPlaylist: 0,
      annotationImpressions: 0,
      annotationClicks: 0,
      annotationClickThroughRate: 0,
      annotationCloseRate: 0,
      cardImpressions: 0,
      cardClicks: 0,
      cardClickRate: 0,
      averageConcurrentViewers: 0,
      peakConcurrentViewers: 0
    }
  }

  /**
   * Obtiene métricas de ingresos
   */
  async getRevenueMetrics(startDate: string, endDate: string): Promise<{
    estimatedRevenue: number
    estimatedAdRevenue: number
    estimatedRedPartnerRevenue: number
    grossRevenue: number
    cpm: number
    playbackBasedCpm: number
  }> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'estimatedRevenue',
        'estimatedAdRevenue',
        'estimatedRedPartnerRevenue',
        'grossRevenue',
        'cpm',
        'playbackBasedCpm'
      ]
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return {
        estimatedRevenue: 0,
        estimatedAdRevenue: 0,
        estimatedRedPartnerRevenue: 0,
        grossRevenue: 0,
        cpm: 0,
        playbackBasedCpm: 0
      }
    }

    const row = response.rows[0]
    const headers = response.columnHeaders.map(h => h.name)

    return {
      estimatedRevenue: this.getMetricValue(row, headers, 'estimatedRevenue'),
      estimatedAdRevenue: this.getMetricValue(row, headers, 'estimatedAdRevenue'),
      estimatedRedPartnerRevenue: this.getMetricValue(row, headers, 'estimatedRedPartnerRevenue'),
      grossRevenue: this.getMetricValue(row, headers, 'grossRevenue'),
      cpm: this.getMetricValue(row, headers, 'cpm'),
      playbackBasedCpm: this.getMetricValue(row, headers, 'playbackBasedCpm')
    }
  }

  /**
   * Obtiene métricas de anuncios
   */
  async getAdMetrics(startDate: string, endDate: string): Promise<{
    adImpressions: number
    monetizedPlaybacks: number
    grossRevenue: number
    cpm: number
    playbackBasedCpm: number
  }> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'adImpressions',
        'monetizedPlaybacks',
        'grossRevenue',
        'cpm',
        'playbackBasedCpm'
      ]
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return {
        adImpressions: 0,
        monetizedPlaybacks: 0,
        grossRevenue: 0,
        cpm: 0,
        playbackBasedCpm: 0
      }
    }

    const row = response.rows[0]
    const headers = response.columnHeaders.map(h => h.name)

    return {
      adImpressions: this.getMetricValue(row, headers, 'adImpressions'),
      monetizedPlaybacks: this.getMetricValue(row, headers, 'monetizedPlaybacks'),
      grossRevenue: this.getMetricValue(row, headers, 'grossRevenue'),
      cpm: this.getMetricValue(row, headers, 'cpm'),
      playbackBasedCpm: this.getMetricValue(row, headers, 'playbackBasedCpm')
    }
  }

  /**
   * Obtiene métricas de videos individuales
   */
  async getVideoMetrics(videoIds: string[], startDate: string, endDate: string): Promise<Array<{
    videoId: string
    title: string
    views: number
    estimatedMinutesWatched: number
    averageViewDuration: number
    likes: number
    comments: number
    shares: number
  }>> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'views',
        'estimatedMinutesWatched',
        'averageViewDuration',
        'likes',
        'comments',
        'shares'
      ],
      dimensions: ['video'],
      filters: `video==${videoIds.join(',')}`
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return []
    }

    const headers = response.columnHeaders.map(h => h.name)
    
    return response.rows.map(row => ({
      videoId: row[0] as string,
      title: '', // Se puede obtener por separado
      views: this.getMetricValue(row, headers, 'views'),
      estimatedMinutesWatched: this.getMetricValue(row, headers, 'estimatedMinutesWatched'),
      averageViewDuration: this.getMetricValue(row, headers, 'averageViewDuration'),
      likes: this.getMetricValue(row, headers, 'likes'),
      comments: this.getMetricValue(row, headers, 'comments'),
      shares: this.getMetricValue(row, headers, 'shares')
    }))
  }

  /**
   * Obtiene métricas de listas de reproducción
   */
  async getPlaylistMetrics(startDate: string, endDate: string): Promise<{
    playlistViews: number
    playlistStarts: number
    playlistSaves: number
    averageTimeInPlaylist: number
  }> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'playlistViews',
        'playlistStarts',
        'playlistSaves',
        'averageTimeInPlaylist'
      ]
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return {
        playlistViews: 0,
        playlistStarts: 0,
        playlistSaves: 0,
        averageTimeInPlaylist: 0
      }
    }

    const row = response.rows[0]
    const headers = response.columnHeaders.map(h => h.name)

    return {
      playlistViews: this.getMetricValue(row, headers, 'playlistViews'),
      playlistStarts: this.getMetricValue(row, headers, 'playlistStarts'),
      playlistSaves: this.getMetricValue(row, headers, 'playlistSaves'),
      averageTimeInPlaylist: this.getMetricValue(row, headers, 'averageTimeInPlaylist')
    }
  }

  /**
   * Obtiene métricas de transmisión en vivo
   */
  async getLiveStreamMetrics(startDate: string, endDate: string): Promise<{
    averageConcurrentViewers: number
    peakConcurrentViewers: number
  }> {
    const request: YouTubeAnalyticsRequest = {
      ids: `channel==${this.channelId}`,
      startDate,
      endDate,
      metrics: [
        'averageConcurrentViewers',
        'peakConcurrentViewers'
      ]
    }

    const response = await this.makeAnalyticsRequest('/reports', request)
    
    if (!response.rows || response.rows.length === 0) {
      return {
        averageConcurrentViewers: 0,
        peakConcurrentViewers: 0
      }
    }

    const row = response.rows[0]
    const headers = response.columnHeaders.map(h => h.name)

    return {
      averageConcurrentViewers: this.getMetricValue(row, headers, 'averageConcurrentViewers'),
      peakConcurrentViewers: this.getMetricValue(row, headers, 'peakConcurrentViewers')
    }
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.getChannelInfo()
      return true
    } catch (error) {
      console.error('Error validando credenciales de YouTube Analytics:', error)
      return false
    }
  }

  /**
   * Obtiene métricas vacías por defecto
   */
  private getEmptyMetrics(): YouTubeAnalyticsMetrics {
    return {
      views: 0,
      estimatedMinutesWatched: 0,
      averageViewDuration: 0,
      averageViewPercentage: 0,
      engagedViews: 0,
      viewerPercentage: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      subscribersGained: 0,
      subscribersLost: 0,
      estimatedRevenue: 0,
      estimatedAdRevenue: 0,
      estimatedRedPartnerRevenue: 0,
      adImpressions: 0,
      monetizedPlaybacks: 0,
      grossRevenue: 0,
      cpm: 0,
      playbackBasedCpm: 0,
      playlistViews: 0,
      playlistStarts: 0,
      playlistSaves: 0,
      averageTimeInPlaylist: 0,
      annotationImpressions: 0,
      annotationClicks: 0,
      annotationClickThroughRate: 0,
      annotationCloseRate: 0,
      cardImpressions: 0,
      cardClicks: 0,
      cardClickRate: 0,
      averageConcurrentViewers: 0,
      peakConcurrentViewers: 0
    }
  }

  /**
   * Obtiene el valor de una métrica específica
   */
  private getMetricValue(row: Array<string | number>, headers: string[], metricName: string): number {
    const index = headers.indexOf(metricName)
    if (index === -1) return 0
    
    const value = row[index]
    return typeof value === 'number' ? value : parseFloat(value.toString()) || 0
  }

  /**
   * Realiza una petición a la API de YouTube Analytics
   */
  private async makeAnalyticsRequest(endpoint: string, params: any): Promise<YouTubeAnalyticsReport> {
    const url = `${this.baseURL}${endpoint}`
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','))
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })

    const fullUrl = `${url}?${searchParams.toString()}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`YouTube Analytics API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Realiza una petición a la API de YouTube Data
   */
  private async makeDataRequest(endpoint: string, params: any): Promise<any> {
    const url = `${this.dataURL}${endpoint}`
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const fullUrl = `${url}?${searchParams.toString()}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`YouTube Data API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de YouTube Analytics desde Supabase
export async function getYouTubeAnalyticsCredentials(clientId?: string): Promise<{ accessToken: string; channelId: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'youtube_analytics')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de YouTube Analytics:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const accessToken = data.encrypted_value
    const channelId = data.config?.channel_id || ''

    if (!accessToken || !channelId) {
      console.warn('Credenciales de YouTube Analytics incompletas')
      return null
    }

    return { accessToken, channelId }
  } catch (error) {
    console.warn('Error al obtener credenciales de YouTube Analytics:', error)
    return null
  }
}

// Función para crear una instancia del servicio de YouTube Analytics
export async function createYouTubeAnalyticsService(clientId?: string): Promise<YouTubeAnalyticsService | null> {
  const credentials = await getYouTubeAnalyticsCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de YouTube Analytics')
    return null
  }

  return new YouTubeAnalyticsService(credentials.accessToken, credentials.channelId)
}

// Función para validar credenciales de YouTube Analytics
export async function validateYouTubeAnalyticsCredentials(accessToken: string, channelId: string): Promise<{ valid: boolean; channel?: YouTubeChannel; error?: string }> {
  try {
    const service = new YouTubeAnalyticsService(accessToken, channelId)
    const channel = await service.getChannelInfo()
    return { valid: true, channel }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
