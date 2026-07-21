import { supabase } from './supabase'

// Interfaces
export interface FacebookPage {
  id: string
  name: string
  access_token: string
  category: string
  tasks: string[]
}

export interface FacebookPost {
  id: string
  message: string
  created_time: string
  permalink_url: string
  full_picture?: string
}

export interface FacebookPostRequest {
  message: string
  link?: string
  picture?: string
}

export interface FacebookInsights {
  page_impressions: number
  page_reach: number
  page_engaged_users: number
  post_impressions: number
  post_reach: number
  post_engaged_users: number
}

// Clase principal del servicio de Facebook Graph API
export class FacebookGraphService {
  private accessToken: string
  private baseURL = `https://graph.facebook.com/${import.meta.env.VITE_FACEBOOK_API_VERSION || 'v23.0'}`

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // Método genérico para hacer peticiones a la API
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    const url = `${this.baseURL}${endpoint}`
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    }

    if (method === 'POST' && data) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Facebook API Error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en petición a Facebook Graph API:', error)
      throw error
    }
  }

  // Obtener páginas del usuario
  async getPages(): Promise<FacebookPage[]> {
    try {
      const response = await this.makeRequest('/me/accounts')
      return response.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        access_token: page.access_token,
        category: page.category,
        tasks: page.tasks || []
      }))
    } catch (error) {
      console.error('Error obteniendo páginas de Facebook:', error)
      throw error
    }
  }

  // Obtener posts de una página
  async getPagePosts(pageId: string, limit: number = 10): Promise<FacebookPost[]> {
    try {
      const response = await this.makeRequest(`/${pageId}/posts?limit=${limit}&fields=id,message,created_time,permalink_url,full_picture`)
      return response.data.map((post: any) => ({
        id: post.id,
        message: post.message || '',
        created_time: post.created_time,
        permalink_url: post.permalink_url,
        full_picture: post.full_picture
      }))
    } catch (error) {
      console.error('Error obteniendo posts de Facebook:', error)
      throw error
    }
  }

  // Obtener insights de una página
  async getPageInsights(pageId: string, period: string = 'day'): Promise<FacebookInsights> {
    try {
      const response = await this.makeRequest(`/${pageId}/insights?metric=page_impressions,page_reach,page_engaged_users,post_impressions,post_reach,post_engaged_users&period=${period}`)
      
      const insights: FacebookInsights = {
        page_impressions: 0,
        page_reach: 0,
        page_engaged_users: 0,
        post_impressions: 0,
        post_reach: 0,
        post_engaged_users: 0
      }

      response.data.forEach((metric: any) => {
        const value = metric.values?.[0]?.value || 0
        switch (metric.name) {
          case 'page_impressions':
            insights.page_impressions = value
            break
          case 'page_reach':
            insights.page_reach = value
            break
          case 'page_engaged_users':
            insights.page_engaged_users = value
            break
          case 'post_impressions':
            insights.post_impressions = value
            break
          case 'post_reach':
            insights.post_reach = value
            break
          case 'post_engaged_users':
            insights.post_engaged_users = value
            break
        }
      })

      return insights
    } catch (error) {
      console.error('Error obteniendo insights de Facebook:', error)
      throw error
    }
  }

  // Publicar en una página
  async postToPage(pageId: string, post: FacebookPostRequest): Promise<{ id: string }> {
    try {
      const response = await this.makeRequest(`/${pageId}/feed`, 'POST', post)
      return { id: response.id }
    } catch (error) {
      console.error('Error publicando en Facebook:', error)
      throw error
    }
  }
}

// Función para obtener credenciales de Facebook desde la base de datos
export async function getFacebookCredentials(clientId?: string): Promise<string | null> {
  try {
    // Importar el servicio de credenciales dinámicamente para evitar dependencias circulares
    const { credentialsService } = await import('./credentials-service')
    
    const credential = await credentialsService.getActiveCredential('facebook', clientId)
    if (!credential) {
      return null
    }

    // Desencriptar el valor (temporal con Base64)
    if (credential.encryption_key_id === 'temp-base64') {
      return atob(credential.encrypted_value)
    }

    // Si está encriptado con Edge Functions, necesitaríamos llamar a una función de desencriptación
    console.warn('Credencial encriptada con Edge Functions - no se puede desencriptar en el cliente')
    return null
  } catch (error) {
    console.error('Error obteniendo credenciales de Facebook:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Facebook
export async function createFacebookService(clientId?: string): Promise<FacebookGraphService | null> {
  const accessToken = await getFacebookCredentials(clientId)
  
  if (!accessToken) {
    console.warn('No se pudieron obtener las credenciales de Facebook')
    return null
  }

  return new FacebookGraphService(accessToken)
}

// Función para validar credenciales de Facebook
export async function validateFacebookCredentials(accessToken: string): Promise<{ valid: boolean; user?: any; error?: string }> {
  try {
    const service = new FacebookGraphService(accessToken)
    const user = await service.makeRequest('/me')
    return { valid: true, user }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}

// Función para obtener páginas de Facebook
export async function getFacebookPages(clientId?: string): Promise<FacebookPage[]> {
  try {
    const service = await createFacebookService(clientId)
    if (!service) {
      return []
    }
    
    const pages = await service.getPages()
    return pages
  } catch (error) {
    console.error('Error obteniendo páginas de Facebook:', error)
    return []
  }
}

// Función para publicar posts en Facebook
export async function publishPost(pageId: string, message: string): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}> {
  try {
    const service = await createFacebookService()
    if (!service) {
      return { success: false, error: 'No se pudo crear el servicio de Facebook' }
    }
    
    const result = await service.postToPage(pageId, { message })
    return { success: true, postId: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Función para verificar si Facebook está configurado
export async function isFacebookConfigured(clientId?: string): Promise<boolean> {
  try {
    const credentials = await getFacebookCredentials(clientId)
    return !!credentials
  } catch (error) {
    return false
  }
}

// Función para intercambiar código de autorización por token
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
  success: boolean;
  accessToken?: string;
  error?: string;
}> {
  try {
    // Esta función debería hacer una llamada a tu backend para intercambiar el código
    // Por ahora retornamos un error ya que necesitamos el client_secret
    return {
      success: false,
      error: 'Esta función requiere configuración del backend con client_secret'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Instancia por defecto del servicio de Facebook
export const facebookAPIService = {
  createService: createFacebookService,
  validateCredentials: validateFacebookCredentials,
  getCredentials: getFacebookCredentials,
  getPages: getFacebookPages,
  publishPost: publishPost,
  isConfigured: isFacebookConfigured,
  exchangeCodeForToken: exchangeCodeForToken
}