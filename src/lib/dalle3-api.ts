/**
 * DALL-E 3 API Service
 * Implementación completa de la API de DALL-E 3 para MarketPro GT
 * Basado en: mejoras/media/ai_image_apis_comparison.json
 */

import { supabase } from './supabase'






// Tipos para la API de DALL-E 3
export interface Dalle3Request {
  model: 'dall-e-3'
  prompt: string
  n?: number
  quality?: 'standard' | 'hd'
  size?: '1024x1024' | '1024x1792' | '1792x1024'
  style?: 'vivid' | 'natural'
  user?: string
}

export interface Dalle3Response {
  created: number
  data: Array<{
    revised_prompt: string
    url: string
  }>
}

export interface Dalle3ImageResult {
  image_url: string
  revised_prompt: string
  created_at: number
  size: string
  quality: string
  style: string
  model: string
}

// Clase principal del servicio de DALL-E 3
export class Dalle3Service {
  private baseURL = 'https://api.openai.com/v1'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera una imagen usando DALL-E 3
   */
  async generateImage(request: {
    prompt: string
    size?: '1024x1024' | '1024x1792' | '1792x1024'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
  }): Promise<Dalle3ImageResult> {
    const dalleRequest: Dalle3Request = {
      model: 'dall-e-3',
      prompt: request.prompt,
      n: 1,
      quality: request.quality || 'standard',
      size: request.size || '1024x1024',
      style: request.style || 'vivid'
    }

    const response = await this.makeRequest('/images/generations', dalleRequest)
    
    if (!response.data || response.data.length === 0) {
      throw new Error('No se pudo generar la imagen')
    }

    const imageData = response.data[0]

    return {
      image_url: imageData.url,
      revised_prompt: imageData.revised_prompt,
      created_at: response.created,
      size: dalleRequest.size,
      quality: dalleRequest.quality,
      style: dalleRequest.style,
      model: 'dall-e-3'
    }
  }

  /**
   * Genera múltiples variaciones de una imagen
   */
  async generateVariations(
    prompt: string, 
    count: number = 4,
    options: {
      size?: '1024x1024' | '1024x1792' | '1792x1024'
      quality?: 'standard' | 'hd'
      style?: 'vivid' | 'natural'
    } = {}
  ): Promise<Dalle3ImageResult[]> {
    const variations: Dalle3ImageResult[] = []
    
    // DALL-E 3 solo permite 1 imagen por request, así que hacemos múltiples requests
    for (let i = 0; i < count; i++) {
      const result = await this.generateImage({
        prompt: `${prompt} (variation ${i + 1})`,
        ...options
      })
      variations.push(result)
    }
    
    return variations
  }

  /**
   * Optimiza un prompt para DALL-E 3
   */
  async optimizePrompt(originalPrompt: string): Promise<string> {
    // DALL-E 3 tiene su propio sistema de optimización de prompts
    // Simulamos una optimización básica
    const optimizedPrompt = originalPrompt
      .replace(/\b(low quality|blurry|pixelated)\b/gi, '')
      .replace(/\b(high quality|detailed|sharp|clear)\b/gi, 'high quality, detailed, sharp, clear')
      .trim()

    return optimizedPrompt || originalPrompt
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      // Intentamos hacer una request simple para validar
      await this.makeRequest('/models', {})
      return true
    } catch (error) {
      console.error('Error validando credenciales de DALL-E 3:', error)
      return false
    }
  }

  /**
   * Obtiene información de la cuenta
   */
  async getAccountInfo(): Promise<{
    usage: any
    limits: any
  }> {
    try {
      const response = await this.makeRequest('/usage', {})
      return {
        usage: response,
        limits: {
          monthly_limit: 'Depende del plan',
          current_usage: response.total_usage || 0
        }
      }
    } catch (error) {
      console.error('Error obteniendo información de cuenta:', error)
      return {
        usage: {},
        limits: {}
      }
    }
  }

  /**
   * Realiza una petición a la API de OpenAI
   */
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`DALL-E 3 API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de DALL-E 3 desde Supabase
export async function getDalle3Credentials(clientId?: string): Promise<{ apiKey: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'dalle3')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de DALL-E 3:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const apiKey = data.encrypted_value

    if (!apiKey) {
      console.warn('Credenciales de DALL-E 3 incompletas')
      return null
    }

    return { apiKey }
  } catch (error) {
    console.warn('Error al obtener credenciales de DALL-E 3:', error)
    return null
  }
}

// Función para crear una instancia del servicio de DALL-E 3
export async function createDalle3Service(clientId?: string): Promise<Dalle3Service | null> {
  const credentials = await getDalle3Credentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de DALL-E 3')
    return null
  }

  return new Dalle3Service(credentials.apiKey)
}

// Función para validar credenciales de DALL-E 3
export async function validateDalle3Credentials(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const service = new Dalle3Service(apiKey)
    const isValid = await service.validateCredentials()
    return { valid: isValid }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
