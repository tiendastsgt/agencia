import { credentialsService } from './credentials-service'

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
  statistics: {
    viewCount: string
    subscriberCount: string
    videoCount: string
  }
  brandingSettings?: {
    channel: {
      title: string
      description: string
      keywords: string
      defaultLanguage: string
    }
  }
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
    standard?: { url: string; width: number; height: number }
    maxres?: { url: string; width: number; height: number }
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails: {
    duration: string
    dimension: string
    definition: string
  }
  snippet: {
    channelId: string
    channelTitle: string
    tags?: string[]
    categoryId: string
    liveBroadcastContent: string
  }
}

export interface YouTubeAnalytics {
  // Métricas principales
  views: number
  estimatedMinutesWatched: number
  averageViewDuration: number
  averageViewPercentage: number
  subscribersGained: number
  subscribersLost: number
  likes: number
  dislikes: number
  comments: number
  shares: number
  estimatedRevenue: number
  
  // Métricas de engagement
  engagedViews: number
  viewerPercentage: number
  
  // Métricas de listas de reproducción
  playlistViews: number
  playlistStarts: number
  playlistEstimatedMinutesWatched: number
  
  // Métricas de anotaciones
  annotationClickThroughRate: number
  annotationCloseRate: number
  
  // Métricas de tarjetas
  cardClickRate: number
  
  // Métricas de transmisión en vivo
  averageConcurrentViewers?: number
  peakConcurrentViewers?: number
  
  // Métricas de ingresos
  estimatedAdRevenue: number
  estimatedRedPartnerRevenue: number
  
  // Métricas de anuncios
  adImpressions: number
  monetizedPlaybacks: number
  cpm: number
}

export interface YouTubeAnalyticsReport {
  rows: number[][]
  columnHeaders: Array<{
    name: string
    columnType: string
    dataType: string
  }>
}

export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
  statistics: {
    viewCount: string
    videoCount: string
  }
  contentDetails: {
    itemCount: number
  }
}

class YouTubeAPIService {
  private analyticsBaseURL = import.meta.env.VITE_YOUTUBE_ANALYTICS_URL || 'https://youtubeanalytics.googleapis.com/v2'
  private dataBaseURL = import.meta.env.VITE_YOUTUBE_API_URL || 'https://www.googleapis.com/youtube/v3'
  private clientId: string | null = null
  private clientSecret: string | null = null
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.initializeCredentials()
  }

  private async initializeCredentials() {
    try {
      const credentials = await credentialsService.getCredentials('youtube')
      if (credentials && credentials.length > 0) {
        const cred = credentials[0]
        this.clientId = cred.api_key
        this.clientSecret = cred.api_secret
        this.accessToken = cred.access_token
        this.refreshToken = cred.refresh_token
      }
    } catch (error) {
      console.error('Error initializing YouTube credentials:', error)
    }
  }

  /**
   * Obtiene información del canal del usuario autenticado
   */
  async getMyChannel(): Promise<{ success: boolean; channel?: YouTubeChannel; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const response = await fetch(
        `${this.dataBaseURL}/channels?part=snippet,statistics,brandingSettings&mine=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener información del canal')
      }

      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        return { success: true, channel: data.items[0] }
      } else {
        throw new Error('No se encontró información del canal')
      }

    } catch (error) {
      console.error('Error getting YouTube channel:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene los videos del canal
   */
  async getChannelVideos(
    channelId: string,
    maxResults: number = 25
  ): Promise<{ success: boolean; videos?: YouTubeVideo[]; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const response = await fetch(
        `${this.dataBaseURL}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener videos del canal')
      }

      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        // Obtener estadísticas detalladas de cada video
        const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
        const statsResponse = await fetch(
          `${this.dataBaseURL}/videos?part=statistics,contentDetails&id=${videoIds}`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          const videos = data.items.map((item: any) => {
            const stats = statsData.items.find((stat: any) => stat.id === item.id.videoId)
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              publishedAt: item.snippet.publishedAt,
              thumbnails: item.snippet.thumbnails,
              statistics: stats?.statistics || { viewCount: '0', likeCount: '0', commentCount: '0' },
              contentDetails: stats?.contentDetails || { duration: 'PT0S', dimension: '2d', definition: 'hd' },
              snippet: {
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                tags: item.snippet.tags,
                categoryId: item.snippet.categoryId,
                liveBroadcastContent: item.snippet.liveBroadcastContent
              }
            }
          })
          
          return { success: true, videos }
        }
      }

      return { success: true, videos: [] }

    } catch (error) {
      console.error('Error getting YouTube channel videos:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene analytics del canal
   */
  async getChannelAnalytics(
    channelId: string,
    startDate: string,
    endDate: string,
    metrics: string[] = [
      'views',
      'estimatedMinutesWatched',
      'averageViewDuration',
      'averageViewPercentage',
      'subscribersGained',
      'subscribersLost',
      'likes',
      'dislikes',
      'comments',
      'shares',
      'estimatedRevenue'
    ]
  ): Promise<{ success: boolean; analytics?: YouTubeAnalytics; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const metricsParam = metrics.join(',')
      const url = `${this.analyticsBaseURL}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=${metricsParam}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener analytics del canal')
      }

      const data = await response.json()
      
      if (data.rows && data.rows.length > 0) {
        const row = data.rows[0]
        const analytics: YouTubeAnalytics = {
          views: row[0] || 0,
          estimatedMinutesWatched: row[1] || 0,
          averageViewDuration: row[2] || 0,
          averageViewPercentage: row[3] || 0,
          subscribersGained: row[4] || 0,
          subscribersLost: row[5] || 0,
          likes: row[6] || 0,
          dislikes: row[7] || 0,
          comments: row[8] || 0,
          shares: row[9] || 0,
          estimatedRevenue: row[10] || 0,
          engagedViews: 0,
          viewerPercentage: 0,
          playlistViews: 0,
          playlistStarts: 0,
          playlistEstimatedMinutesWatched: 0,
          annotationClickThroughRate: 0,
          annotationCloseRate: 0,
          cardClickRate: 0,
          estimatedAdRevenue: 0,
          estimatedRedPartnerRevenue: 0,
          adImpressions: 0,
          monetizedPlaybacks: 0,
          cpm: 0
        }

        return { success: true, analytics }
      }

      return { success: true, analytics: undefined }

    } catch (error) {
      console.error('Error getting YouTube channel analytics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene analytics de un video específico
   */
  async getVideoAnalytics(
    videoId: string,
    startDate: string,
    endDate: string
  ): Promise<{ success: boolean; analytics?: YouTubeAnalytics; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const metrics = [
        'views',
        'estimatedMinutesWatched',
        'averageViewDuration',
        'averageViewPercentage',
        'likes',
        'dislikes',
        'comments',
        'shares',
        'estimatedRevenue'
      ].join(',')

      const url = `${this.analyticsBaseURL}/reports?ids=channel==MINE&filters=video==${videoId}&startDate=${startDate}&endDate=${endDate}&metrics=${metrics}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener analytics del video')
      }

      const data = await response.json()
      
      if (data.rows && data.rows.length > 0) {
        const row = data.rows[0]
        const analytics: YouTubeAnalytics = {
          views: row[0] || 0,
          estimatedMinutesWatched: row[1] || 0,
          averageViewDuration: row[2] || 0,
          averageViewPercentage: row[3] || 0,
          subscribersGained: 0,
          subscribersLost: 0,
          likes: row[4] || 0,
          dislikes: row[5] || 0,
          comments: row[6] || 0,
          shares: row[7] || 0,
          estimatedRevenue: row[8] || 0,
          engagedViews: 0,
          viewerPercentage: 0,
          playlistViews: 0,
          playlistStarts: 0,
          playlistEstimatedMinutesWatched: 0,
          annotationClickThroughRate: 0,
          annotationCloseRate: 0,
          cardClickRate: 0,
          estimatedAdRevenue: 0,
          estimatedRedPartnerRevenue: 0,
          adImpressions: 0,
          monetizedPlaybacks: 0,
          cpm: 0
        }

        return { success: true, analytics }
      }

      return { success: true, analytics: undefined }

    } catch (error) {
      console.error('Error getting YouTube video analytics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene las listas de reproducción del canal
   */
  async getChannelPlaylists(
    channelId: string,
    maxResults: number = 25
  ): Promise<{ success: boolean; playlists?: YouTubePlaylist[]; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const response = await fetch(
        `${this.dataBaseURL}/playlists?part=snippet,contentDetails,statistics&channelId=${channelId}&maxResults=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener listas de reproducción')
      }

      const data = await response.json()
      
      return {
        success: true,
        playlists: data.items || []
      }

    } catch (error) {
      console.error('Error getting YouTube playlists:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Busca videos en YouTube
   */
  async searchVideos(
    query: string,
    maxResults: number = 25
  ): Promise<{ success: boolean; videos?: YouTubeVideo[]; error?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso de YouTube configurado')
      }

      const response = await fetch(
        `${this.dataBaseURL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=relevance`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al buscar videos')
      }

      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        // Obtener estadísticas detalladas de cada video
        const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
        const statsResponse = await fetch(
          `${this.dataBaseURL}/videos?part=statistics,contentDetails&id=${videoIds}`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          const videos = data.items.map((item: any) => {
            const stats = statsData.items.find((stat: any) => stat.id === item.id.videoId)
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              publishedAt: item.snippet.publishedAt,
              thumbnails: item.snippet.thumbnails,
              statistics: stats?.statistics || { viewCount: '0', likeCount: '0', commentCount: '0' },
              contentDetails: stats?.contentDetails || { duration: 'PT0S', dimension: '2d', definition: 'hd' },
              snippet: {
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                tags: item.snippet.tags,
                categoryId: item.snippet.categoryId,
                liveBroadcastContent: item.snippet.liveBroadcastContent
              }
            }
          })
          
          return { success: true, videos }
        }
      }

      return { success: true, videos: [] }

    } catch (error) {
      console.error('Error searching YouTube videos:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Verifica si las credenciales están configuradas
   */
  async isConfigured(): Promise<boolean> {
    try {
      await this.initializeCredentials()
      return !!(this.clientId && this.clientSecret && this.accessToken)
    } catch (error) {
      console.error('Error checking YouTube configuration:', error)
      return false
    }
  }

  /**
   * Obtiene la URL de autorización OAuth2
   */
  getAuthURL(redirectUri: string): string {
    if (!this.clientId) {
      throw new Error('Client ID no configurado')
    }

    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ].join(' ')

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: 'youtube_auth'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  /**
   * Intercambia el código de autorización por un token de acceso
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; error?: string }> {
    try {
      if (!this.clientId || !this.clientSecret) {
        throw new Error('Credenciales de YouTube no configuradas')
      }

      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || 'Error al intercambiar código por token')
      }

      const data = await response.json()
      
      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      }

    } catch (error) {
      console.error('Error exchanging code for token:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Refresca el token de acceso
   */
  async refreshAccessToken(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      if (!this.clientId || !this.clientSecret || !this.refreshToken) {
        throw new Error('Credenciales de YouTube no configuradas')
      }

      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      })

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || 'Error al refrescar token')
      }

      const data = await response.json()
      this.accessToken = data.access_token
      
      return {
        success: true,
        accessToken: data.access_token
      }

    } catch (error) {
      console.error('Error refreshing access token:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}

export const youtubeAPIService = new YouTubeAPIService()
