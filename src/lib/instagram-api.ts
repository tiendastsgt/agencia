/**
 * Instagram Basic Display API Service
 * Implementación completa de la API de Instagram para MarketPro GT
 * Basado en: mejoras/jsons/instagram_insights_api.json
 */

import { supabase } from './supabase'

// Tipos para la API de Instagram
export interface InstagramUser {
  id: string
  username: string
  account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL'
  media_count: number
  followers_count?: number
  follows_count?: number
  name?: string
  profile_picture_url?: string
  website?: string
  biography?: string
  ig_id?: number
}

export interface InstagramMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  username: string
  children?: {
    data: Array<{
      id: string
      media_type: 'IMAGE' | 'VIDEO'
      media_url: string
    }>
  }
  like_count?: number
  comments_count?: number
  is_comment_enabled?: boolean
}

export interface InstagramInsight {
  name: string
  period: string
  values: Array<{
    value: number | Record<string, number>
    end_time: string
  }>
  title: string
  description: string
  id: string
}

export interface InstagramStory {
  id: string
  media_type: 'IMAGE' | 'VIDEO'
  media_url: string
  permalink: string
  timestamp: string
  username: string
  like_count?: number
  comments_count?: number
  is_comment_enabled?: boolean
}

export interface InstagramReel {
  id: string
  caption?: string
  media_type: 'VIDEO'
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
  username: string
  like_count?: number
  comments_count?: number
  is_comment_enabled?: boolean
}

// Clase principal del servicio de Instagram Basic Display API
export class InstagramBasicDisplayService {
  private baseURL = 'https://graph.instagram.com'
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  /**
   * Obtiene información del usuario de Instagram
   */
  async getUserInfo(): Promise<InstagramUser> {
    const response = await this.makeRequest('/me', {
      fields: 'id,username,account_type,media_count,followers_count,follows_count,name,profile_picture_url,website,biography,ig_id'
    })

    return response
  }

  /**
   * Obtiene el feed de medios del usuario
   */
  async getUserMedia(limit = 25): Promise<InstagramMedia[]> {
    const response = await this.makeRequest('/me/media', {
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,children,like_count,comments_count,is_comment_enabled',
      limit: limit.toString()
    })

    return response.data || []
  }

  /**
   * Obtiene un medio específico por ID
   */
  async getMedia(mediaId: string): Promise<InstagramMedia> {
    const response = await this.makeRequest(`/${mediaId}`, {
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,children,like_count,comments_count,is_comment_enabled'
    })

    return response
  }

  /**
   * Obtiene insights de un medio específico
   */
  async getMediaInsights(mediaId: string, metrics: string[]): Promise<InstagramInsight[]> {
    const response = await this.makeRequest(`/${mediaId}/insights`, {
      metric: metrics.join(',')
    })

    return response.data || []
  }

  /**
   * Obtiene métricas de engagement de un medio
   */
  async getMediaEngagementMetrics(mediaId: string): Promise<{
    comments: number
    likes: number
    reach: number
    impressions: number
    saved: number
    shares: number
    total_interactions: number
  }> {
    const metrics = [
      'comments',
      'likes',
      'reach',
      'impressions',
      'saved',
      'shares',
      'total_interactions'
    ]

    const insights = await this.getMediaInsights(mediaId, metrics)
    
    const result: any = {}
    insights.forEach(insight => {
      if (insight.values && insight.values.length > 0) {
        result[insight.name] = insight.values[0].value
      }
    })

    return result
  }

  /**
   * Obtiene métricas de engagement de un reel
   */
  async getReelEngagementMetrics(mediaId: string): Promise<{
    comments: number
    likes: number
    reach: number
    shares: number
    total_interactions: number
    views: number
    ig_reels_avg_watch_time: number
    ig_reels_video_view_total_time: number
  }> {
    const metrics = [
      'comments',
      'likes',
      'reach',
      'shares',
      'total_interactions',
      'views',
      'ig_reels_avg_watch_time',
      'ig_reels_video_view_total_time'
    ]

    const insights = await this.getMediaInsights(mediaId, metrics)
    
    const result: any = {}
    insights.forEach(insight => {
      if (insight.values && insight.values.length > 0) {
        result[insight.name] = insight.values[0].value
      }
    })

    return result
  }

  /**
   * Obtiene métricas de engagement de una historia
   */
  async getStoryEngagementMetrics(mediaId: string): Promise<{
    reach: number
    impressions: number
    replies: number
    shares: number
    total_interactions: number
    views: number
    navigation: number
    profile_activity: number
    profile_visits: number
    follows: number
  }> {
    const metrics = [
      'reach',
      'impressions',
      'replies',
      'shares',
      'total_interactions',
      'views',
      'navigation',
      'profile_activity',
      'profile_visits',
      'follows'
    ]

    const insights = await this.getMediaInsights(mediaId, metrics)
    
    const result: any = {}
    insights.forEach(insight => {
      if (insight.values && insight.values.length > 0) {
        result[insight.name] = insight.values[0].value
      }
    })

    return result
  }

  /**
   * Obtiene historias del usuario
   */
  async getUserStories(): Promise<InstagramStory[]> {
    const response = await this.makeRequest('/me/stories', {
      fields: 'id,media_type,media_url,permalink,timestamp,username,like_count,comments_count,is_comment_enabled'
    })

    return response.data || []
  }

  /**
   * Obtiene reels del usuario
   */
  async getUserReels(limit = 25): Promise<InstagramReel[]> {
    const response = await this.makeRequest('/me/media', {
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count,is_comment_enabled',
      limit: limit.toString()
    })

    // Filtrar solo reels (videos)
    const allMedia = response.data || []
    return allMedia.filter(media => media.media_type === 'VIDEO') as InstagramReel[]
  }

  /**
   * Obtiene estadísticas de la cuenta
   */
  async getAccountStats(): Promise<{
    followers: number
    following: number
    media: number
  }> {
    const user = await this.getUserInfo()
    
    return {
      followers: user.followers_count || 0,
      following: user.follows_count || 0,
      media: user.media_count || 0
    }
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.getUserInfo()
      return true
    } catch (error) {
      console.error('Error validando credenciales de Instagram:', error)
      return false
    }
  }

  /**
   * Realiza una petición a la API de Instagram Basic Display
   */
  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers
    }

    if (options.body) {
      config.body = options.body
    }

    // Agregar query parameters
    if (options && Object.keys(options).length > 0 && !options.method) {
      const params = new URLSearchParams()
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
      const queryString = params.toString()
      if (queryString) {
        config.url = `${url}?${queryString}`
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Instagram Basic Display API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en petición a Instagram Basic Display API:', error)
      throw error
    }
  }
}

// Función para obtener credenciales de Instagram desde Supabase
export async function getInstagramCredentials(clientId?: string): Promise<string | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('provider', 'instagram')
      .eq('is_active', true)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      console.warn('No se encontraron credenciales de Instagram:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    return data[0].encrypted_value
  } catch (error) {
    console.warn('Error al obtener credenciales de Instagram:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Instagram
export async function createInstagramService(clientId?: string): Promise<InstagramBasicDisplayService | null> {
  const accessToken = await getInstagramCredentials(clientId)
  
  if (!accessToken) {
    console.warn('No se pudieron obtener las credenciales de Instagram')
    return null
  }

  return new InstagramBasicDisplayService(accessToken)
}

// Función para validar credenciales de Instagram
export async function validateInstagramCredentials(accessToken: string): Promise<{ valid: boolean; user?: InstagramUser; error?: string }> {
  try {
    const service = new InstagramBasicDisplayService(accessToken)
    const user = await service.getUserInfo()
    return { valid: true, user }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}

// Instancia por defecto del servicio de Instagram
export const instagramAPIService = {
  createService: createInstagramService,
  validateCredentials: validateInstagramCredentials,
  getCredentials: getInstagramCredentials
}
