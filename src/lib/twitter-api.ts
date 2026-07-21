import { supabase } from './supabase'

// Interfaces para Twitter API
export interface TwitterCredentials {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics?: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  author_id?: string
}

export interface TwitterUser {
  id: string
  username: string
  name: string
  public_metrics?: {
    followers_count: number
    following_count: number
    tweet_count: number
  }
}

export interface TwitterTimeline {
  data: TwitterTweet[]
  meta: {
    result_count: number
    next_token?: string
  }
}

export interface TwitterPostResult {
  success: boolean
  tweetId?: string
  error?: string
}

export class TwitterAPIService {
  private accessToken: string
  private apiUrl = 'https://api.twitter.com/2'
  private clientId: string

  constructor(accessToken: string, clientId?: string) {
    this.accessToken = accessToken
    this.clientId = clientId || ''
  }

  // Crear un tweet
  async createTweet(text: string, mediaIds?: string[]): Promise<TwitterPostResult> {
    try {
      const payload: any = {
        text: text.substring(0, 280) // Límite de caracteres de Twitter
      }

      if (mediaIds && mediaIds.length > 0) {
        payload.media = {
          media_ids: mediaIds
        }
      }

      const response = await fetch(`${this.apiUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error al crear tweet')
      }

      return {
        success: true,
        tweetId: data.data.id
      }
    } catch (error) {
      console.error('Error creando tweet:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Obtener timeline del usuario
  async getTimeline(userId: string, maxResults = 10): Promise<TwitterTimeline | null> {
    try {
      const params = new URLSearchParams({
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'username,name,public_metrics',
        'max_results': maxResults.toString()
      })

      const response = await fetch(`${this.apiUrl}/users/${userId}/tweets?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener timeline')
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo timeline:', error)
      return null
    }
  }

  // Obtener métricas de un tweet
  async getTweetMetrics(tweetId: string) {
    try {
      const params = new URLSearchParams({
        'tweet.fields': 'public_metrics'
      })

      const response = await fetch(`${this.apiUrl}/tweets/${tweetId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener métricas')
      }

      const data = await response.json()
      return data.data?.public_metrics || null
    } catch (error) {
      console.error('Error obteniendo métricas:', error)
      return null
    }
  }

  // Buscar tweets por hashtag o palabra clave
  async searchTweets(query: string, maxResults = 10) {
    try {
      const params = new URLSearchParams({
        'query': query,
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'username,name',
        'max_results': maxResults.toString()
      })

      const response = await fetch(`${this.apiUrl}/tweets/search/recent?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al buscar tweets')
      }

      return await response.json()
    } catch (error) {
      console.error('Error buscando tweets:', error)
      return null
    }
  }

  // Obtener información del usuario
  async getUserInfo(username: string): Promise<TwitterUser | null> {
    try {
      const params = new URLSearchParams({
        'user.fields': 'public_metrics,created_at'
      })

      const response = await fetch(`${this.apiUrl}/users/by/username/${username}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario')
      }

      const data = await response.json()
      return data.data || null
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error)
      return null
    }
  }

  // Obtener trending topics
  async getTrendingTopics(woeid = 1) { // 1 = Worldwide
    try {
      const response = await fetch(`https://api.twitter.com/1.1/trends/place.json?id=${woeid}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener trending topics')
      }

      const data = await response.json()
      return data[0]?.trends || []
    } catch (error) {
      console.error('Error obteniendo trending topics:', error)
      return []
    }
  }
}

// Función para obtener credenciales de Twitter desde Supabase
export async function getTwitterCredentials(clientId?: string): Promise<TwitterCredentials | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('provider', 'twitter')
      .eq('is_active', true)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      console.warn('No se encontraron credenciales de Twitter:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const credentials = JSON.parse(data[0].encrypted_value)
    return credentials
  } catch (error) {
    console.warn('Error al obtener credenciales de Twitter:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Twitter
export async function createTwitterService(clientId?: string): Promise<TwitterAPIService | null> {
  const credentials = await getTwitterCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de Twitter')
    return null
  }

  return new TwitterAPIService(credentials.accessToken, clientId)
}

// Función para validar credenciales de Twitter
export async function validateTwitterCredentials(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return response.ok
  } catch (error) {
    console.error('Error validando credenciales de Twitter:', error)
    return false
  }
}

// Exportar servicio como objeto
export const twitterAPIService = {
  createService: createTwitterService,
  validateCredentials: validateTwitterCredentials,
  getCredentials: getTwitterCredentials
}