import { supabase } from './supabase'

// Tipos para el sistema de credenciales
export interface ApiProvider {
  id: string
  name: string
  display_name: string
  description: string
  auth_type: 'api_key' | 'oauth2' | 'service_account'
  base_url: string
  documentation_url: string
  validation_endpoint: string
  rate_limit_per_minute?: number
  rate_limit_per_hour?: number
  rate_limit_per_day?: number
  is_active: boolean
  is_available: boolean
}

export interface ApiCredential {
  id: string
  client_id: string
  user_id: string
  provider: string
  credential_name: string
  credential_type: 'api_key' | 'oauth_token' | 'service_account'
  is_active: boolean
  expires_at?: string
  last_used_at?: string
  usage_count: number
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CredentialUsageLog {
  id: string
  credential_id: string
  user_id: string
  action: 'validate' | 'use' | 'refresh' | 'error'
  endpoint?: string
  status_code?: number
  response_time_ms?: number
  error_message?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface CreateCredentialRequest {
  provider: string
  credential_name: string
  credential_type: 'api_key' | 'oauth_token' | 'service_account'
  credential_value: string
  client_id?: string
  expires_at?: string
  config?: Record<string, any>
}

export interface ValidationResult {
  valid: boolean
  error?: string
  provider?: string
  credential_name?: string
  last_used?: string
  usage_count?: number
}

// Clase principal del servicio de credenciales
export class CredentialsService {
  private encryptionKey: string

  constructor() {
    // En producción, esta clave debería venir de variables de entorno seguras
    this.encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'marketpro-gt-encryption-key-2025'
  }

  // ===== GESTIÓN DE PROVEEDORES =====

  /**
   * Obtiene todos los proveedores de API disponibles
   */
  async getProviders(): Promise<ApiProvider[]> {
    const { data, error } = await supabase
      .from('api_providers')
      .select('*')
      .eq('is_active', true)
      .order('display_name')

    if (error) throw new Error(`Error al obtener proveedores: ${error.message}`)
    return data || []
  }

  /**
   * Obtiene un proveedor específico por nombre
   */
  async getProvider(providerName: string): Promise<ApiProvider | null> {
    const { data, error } = await supabase
      .from('api_providers')
      .select('*')
      .eq('name', providerName)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No encontrado
      throw new Error(`Error al obtener proveedor: ${error.message}`)
    }
    return data
  }

  // ===== GESTIÓN DE CREDENCIALES =====

  /**
   * Obtiene todas las credenciales del usuario actual
   */
  async getCredentials(clientId?: string): Promise<ApiCredential[]> {
    let query = supabase
      .from('api_credentials')
      .select(`
        id,
        client_id,
        user_id,
        provider,
        credential_name,
        credential_type,
        is_active,
        expires_at,
        last_used_at,
        usage_count,
        config,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error) throw new Error(`Error al obtener credenciales: ${error.message}`)
    return data || []
  }

  /**
   * Obtiene una credencial específica por ID
   */
  async getCredential(credentialId: string): Promise<ApiCredential | null> {
    const { data, error } = await supabase
      .from('api_credentials')
      .select(`
        id,
        client_id,
        user_id,
        provider,
        credential_name,
        credential_type,
        is_active,
        expires_at,
        last_used_at,
        usage_count,
        config,
        created_at,
        updated_at
      `)
      .eq('id', credentialId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Error al obtener credencial: ${error.message}`)
    }
    return data
  }

  /**
   * Crea una nueva credencial (encriptada)
   */
  async createCredential(request: CreateCredentialRequest): Promise<ApiCredential> {
    // Validar que el proveedor existe
    const provider = await this.getProvider(request.provider)
    if (!provider) {
      throw new Error(`Proveedor '${request.provider}' no encontrado`)
    }

    // Encriptar la credencial usando la función de Supabase
    const { data: encryptedData, error: encryptError } = await supabase
      .rpc('encrypt_credential', {
        credential_value: request.credential_value,
        key_id: this.encryptionKey
      })

    if (encryptError) {
      throw new Error(`Error al encriptar credencial: ${encryptError.message}`)
    }

    // Crear la credencial en la base de datos
    const { data, error } = await supabase
      .from('api_credentials')
      .insert({
        client_id: request.client_id,
        provider: request.provider,
        credential_name: request.credential_name,
        credential_type: request.credential_type,
        encrypted_value: encryptedData,
        encryption_key_id: this.encryptionKey,
        expires_at: request.expires_at,
        config: request.config || {}
      })
      .select(`
        id,
        client_id,
        user_id,
        provider,
        credential_name,
        credential_type,
        is_active,
        expires_at,
        last_used_at,
        usage_count,
        config,
        created_at,
        updated_at
      `)
      .single()

    if (error) throw new Error(`Error al crear credencial: ${error.message}`)
    return data
  }

  /**
   * Actualiza una credencial existente
   */
  async updateCredential(
    credentialId: string, 
    updates: Partial<CreateCredentialRequest>
  ): Promise<ApiCredential> {
    const updateData: any = {
      credential_name: updates.credential_name,
      expires_at: updates.expires_at,
      config: updates.config
    }

    // Si se actualiza el valor de la credencial, encriptarlo
    if (updates.credential_value) {
      const { data: encryptedData, error: encryptError } = await supabase
        .rpc('encrypt_credential', {
          credential_value: updates.credential_value,
          key_id: this.encryptionKey
        })

      if (encryptError) {
        throw new Error(`Error al encriptar credencial: ${encryptError.message}`)
      }

      updateData.encrypted_value = encryptedData
      updateData.encryption_key_id = this.encryptionKey
    }

    const { data, error } = await supabase
      .from('api_credentials')
      .update(updateData)
      .eq('id', credentialId)
      .select(`
        id,
        client_id,
        user_id,
        provider,
        credential_name,
        credential_type,
        is_active,
        expires_at,
        last_used_at,
        usage_count,
        config,
        created_at,
        updated_at
      `)
      .single()

    if (error) throw new Error(`Error al actualizar credencial: ${error.message}`)
    return data
  }

  /**
   * Elimina una credencial
   */
  async deleteCredential(credentialId: string): Promise<void> {
    const { error } = await supabase
      .from('api_credentials')
      .delete()
      .eq('id', credentialId)

    if (error) throw new Error(`Error al eliminar credencial: ${error.message}`)
  }

  /**
   * Desactiva una credencial (soft delete)
   */
  async deactivateCredential(credentialId: string): Promise<void> {
    const { error } = await supabase
      .from('api_credentials')
      .update({ is_active: false })
      .eq('id', credentialId)

    if (error) throw new Error(`Error al desactivar credencial: ${error.message}`)
  }

  // ===== VALIDACIÓN Y USO =====

  /**
   * Valida una credencial usando la función de Supabase
   */
  async validateCredential(credentialId: string): Promise<ValidationResult> {
    const { data, error } = await supabase
      .rpc('validate_api_credential', { credential_id: credentialId })

    if (error) throw new Error(`Error al validar credencial: ${error.message}`)
    return data
  }

  /**
   * Obtiene el valor desencriptado de una credencial (solo para uso interno)
   */
  async getDecryptedCredential(credentialId: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('decrypt_credential', {
        encrypted_value: '', // Se obtiene internamente por ID
        key_id: this.encryptionKey
      })

    if (error) throw new Error(`Error al desencriptar credencial: ${error.message}`)
    return data
  }

  /**
   * Registra el uso de una credencial
   */
  async logCredentialUsage(
    credentialId: string,
    action: 'validate' | 'use' | 'refresh' | 'error',
    details?: {
      endpoint?: string
      status_code?: number
      response_time_ms?: number
      error_message?: string
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('credential_usage_logs')
      .insert({
        credential_id: credentialId,
        action,
        endpoint: details?.endpoint,
        status_code: details?.status_code,
        response_time_ms: details?.response_time_ms,
        error_message: details?.error_message,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      })

    if (error) throw new Error(`Error al registrar uso: ${error.message}`)
  }

  // ===== UTILIDADES =====

  /**
   * Obtiene los logs de uso de una credencial
   */
  async getCredentialUsageLogs(credentialId: string, limit = 50): Promise<CredentialUsageLog[]> {
    const { data, error } = await supabase
      .from('credential_usage_logs')
      .select('*')
      .eq('credential_id', credentialId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Error al obtener logs: ${error.message}`)
    return data || []
  }

  /**
   * Obtiene estadísticas de uso de credenciales
   */
  async getCredentialStats(credentialId: string): Promise<{
    total_uses: number
    last_used: string | null
    success_rate: number
    avg_response_time: number
  }> {
    const { data, error } = await supabase
      .from('credential_usage_logs')
      .select('action, status_code, response_time_ms, created_at')
      .eq('credential_id', credentialId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Error al obtener estadísticas: ${error.message}`)

    const logs = data || []
    const totalUses = logs.length
    const lastUsed = logs[0]?.created_at || null
    const successfulUses = logs.filter(log => 
      log.action !== 'error' && (!log.status_code || log.status_code < 400)
    ).length
    const successRate = totalUses > 0 ? (successfulUses / totalUses) * 100 : 0
    const avgResponseTime = logs
      .filter(log => log.response_time_ms)
      .reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / 
      logs.filter(log => log.response_time_ms).length || 0

    return {
      total_uses: totalUses,
      last_used: lastUsed,
      success_rate: Math.round(successRate * 100) / 100,
      avg_response_time: Math.round(avgResponseTime)
    }
  }

  /**
   * Verifica si una credencial está expirada
   */
  isCredentialExpired(credential: ApiCredential): boolean {
    if (!credential.expires_at) return false
    return new Date(credential.expires_at) < new Date()
  }

  /**
   * Obtiene la IP del cliente (simplificado)
   */
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  // ===== MÉTODOS DE CONVENIENCIA =====

  /**
   * Obtiene credenciales por proveedor
   */
  async getCredentialsByProvider(provider: string, clientId?: string): Promise<ApiCredential[]> {
    const credentials = await this.getCredentials(clientId)
    return credentials.filter(cred => cred.provider === provider)
  }

  /**
   * Obtiene la primera credencial activa de un proveedor
   */
  async getActiveCredential(provider: string, clientId?: string): Promise<ApiCredential | null> {
    const credentials = await this.getCredentialsByProvider(provider, clientId)
    return credentials.find(cred => 
      cred.is_active && 
      !this.isCredentialExpired(cred)
    ) || null
  }

  /**
   * Verifica si hay credenciales configuradas para un proveedor
   */
  async hasActiveCredentials(provider: string, clientId?: string): Promise<boolean> {
    const credential = await this.getActiveCredential(provider, clientId)
    return credential !== null
  }
}

// Instancia singleton del servicio
export const credentialsService = new CredentialsService()
