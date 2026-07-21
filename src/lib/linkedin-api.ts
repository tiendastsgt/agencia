import { supabase } from './supabase'

// Interfaces para LinkedIn API
export interface LinkedInCredentials {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface LinkedInPost {
  id: string
  text: string
  created_at: string
  author: string
  metrics?: {
    likes: number
    comments: number
    shares: number
    views: number
  }
}

export interface LinkedInUser {
  id: string
  firstName: string
  lastName: string
  headline?: string
  profilePicture?: string
  connectionsCount?: number
}

export interface LinkedInPostResult {
  success: boolean
  postId?: string
  error?: string
}

export interface LinkedInAnalytics {
  impressions: number
  clicks: number
  likes: number
  comments: number
  shares: number
  engagement: number
}

export class LinkedInAPIService {
  private accessToken: string
  private apiUrl = 'https://api.linkedin.com/v2'
  private clientId: string

  constructor(accessToken: string, clientId?: string) {
    this.accessToken = accessToken
    this.clientId = clientId || ''
  }

  // Crear un post en LinkedIn
  async createPost(text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'): Promise<LinkedInPostResult> {
    try {
      // Obtener el URN del usuario
      const userInfo = await this.getUserInfo()
      if (!userInfo) {
        throw new Error('No se pudo obtener información del usuario')
      }

      const payload = {
        author: `urn:li:person:${userInfo.id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      }

      const response = await fetch(`${this.apiUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear post')
      }

      return {
        success: true,
        postId: data.id
      }
    } catch (error) {
      console.error('Error creando post en LinkedIn:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  // Obtener posts del usuario
  async getPosts(maxResults = 10): Promise<LinkedInPost[]> {
    try {
      const userInfo = await this.getUserInfo()
      if (!userInfo) {
        throw new Error('No se pudo obtener información del usuario')
      }

      const params = new URLSearchParams({
        'q': 'authors',
        'authors': `List(urn:li:person:${userInfo.id})`,
        'count': maxResults.toString()
      })

      const response = await fetch(`${this.apiUrl}/ugcPosts?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener posts')
      }

      const data = await response.json()
      return data.elements || []
    } catch (error) {
      console.error('Error obteniendo posts de LinkedIn:', error)
      return []
    }
  }

  // Obtener información del usuario
  async getUserInfo(): Promise<LinkedInUser | null> {
    try {
      const params = new URLSearchParams({
        'projection': '(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))'
      })

      const response = await fetch(`${this.apiUrl}/me?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario')
      }

      const data = await response.json()
      return {
        id: data.id,
        firstName: data.firstName?.localized?.en_US || '',
        lastName: data.lastName?.localized?.en_US || '',
        headline: data.headline?.localized?.en_US,
        profilePicture: data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier
      }
    } catch (error) {
      console.error('Error obteniendo información del usuario de LinkedIn:', error)
      return null
    }
  }

  // Obtener analytics de un post
  async getPostAnalytics(postId: string): Promise<LinkedInAnalytics | null> {
    try {
      const response = await fetch(`${this.apiUrl}/socialActions/${postId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener analytics')
      }

      const data = await response.json()
      return {
        impressions: data.impressionCount || 0,
        clicks: data.clickCount || 0,
        likes: data.likeCount || 0,
        comments: data.commentCount || 0,
        shares: data.shareCount || 0,
        engagement: (data.likeCount + data.commentCount + data.shareCount) / (data.impressionCount || 1) * 100
      }
    } catch (error) {
      console.error('Error obteniendo analytics de LinkedIn:', error)
      return null
    }
  }

  // Obtener conexiones del usuario
  async getConnections(): Promise<LinkedInUser[]> {
    try {
      const params = new URLSearchParams({
        'projection': '(elements*(id,firstName,lastName,headline))'
      })

      const response = await fetch(`${this.apiUrl}/networkSizes/me?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener conexiones')
      }

      const data = await response.json()
      return data.elements || []
    } catch (error) {
      console.error('Error obteniendo conexiones de LinkedIn:', error)
      return []
    }
  }

  // Buscar contenido por hashtag
  async searchContent(query: string, maxResults = 10): Promise<LinkedInPost[]> {
    try {
      const params = new URLSearchParams({
        'q': 'keywords',
        'keywords': query,
        'count': maxResults.toString()
      })

      const response = await fetch(`${this.apiUrl}/ugcPosts?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })

      if (!response.ok) {
        throw new Error('Error al buscar contenido')
      }

      const data = await response.json()
      return data.elements || []
    } catch (error) {
      console.error('Error buscando contenido en LinkedIn:', error)
      return []
    }
  }

  // Obtener trending topics en LinkedIn
  async getTrendingTopics(): Promise<string[]> {
    try {
      // LinkedIn no tiene una API específica para trending topics
      // Podemos usar la búsqueda de contenido popular como alternativa
      const popularPosts = await this.searchContent('marketing', 20)
      
      // Extraer hashtags de los posts populares
      const hashtags = new Set<string>()
      popularPosts.forEach(post => {
        const matches = post.text.match(/#\w+/g)
        if (matches) {
          matches.forEach(hashtag => hashtags.add(hashtag))
        }
      })

      return Array.from(hashtags).slice(0, 10)
    } catch (error) {
      console.error('Error obteniendo trending topics de LinkedIn:', error)
      return []
    }
  }
}

// Función para obtener credenciales de LinkedIn desde Supabase
export async function getLinkedInCredentials(clientId?: string): Promise<LinkedInCredentials | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('provider', 'linkedin')
      .eq('is_active', true)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      console.warn('No se encontraron credenciales de LinkedIn:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const credentials = JSON.parse(data[0].encrypted_value)
    return credentials
  } catch (error) {
    console.warn('Error al obtener credenciales de LinkedIn:', error)
    return null
  }
}

// Función para crear una instancia del servicio de LinkedIn
export async function createLinkedInService(clientId?: string): Promise<LinkedInAPIService | null> {
  const credentials = await getLinkedInCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de LinkedIn')
    return null
  }

  return new LinkedInAPIService(credentials.accessToken, clientId)
}

// Función para validar credenciales de LinkedIn
export async function validateLinkedInCredentials(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return response.ok
  } catch (error) {
    console.error('Error validando credenciales de LinkedIn:', error)
    return false
  }
}

// Exportar servicio como objeto
export const linkedinAPIService = {
  createService: createLinkedInService,
  validateCredentials: validateLinkedInCredentials,
  getCredentials: getLinkedInCredentials
}