import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  credentialsService, 
  ApiCredential, 
  CreateCredentialRequest,
  ValidationResult 
} from '../credentials-service'
import { useActiveClient } from '../client-context'

// Hook para gestionar credenciales de un proveedor específico
export function useCredentials(provider?: string) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['api-credentials', activeClient?.id, provider],
    queryFn: () => credentialsService.getCredentials(activeClient?.id),
    enabled: !!activeClient,
    select: (credentials) => {
      if (!provider) return credentials
      return credentials.filter(cred => cred.provider === provider)
    }
  })

  const createMutation = useMutation({
    mutationFn: (request: CreateCredentialRequest) => 
      credentialsService.createCredential(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] })
      toast.success('Credencial creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al crear credencial: ${error.message}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (credentialId: string) => 
      credentialsService.deleteCredential(credentialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] })
      toast.success('Credencial eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar credencial: ${error.message}`)
    }
  })

  const validateMutation = useMutation({
    mutationFn: (credentialId: string) => 
      credentialsService.validateCredential(credentialId),
    onSuccess: (result: ValidationResult) => {
      if (result.valid) {
        toast.success('Credencial válida')
      } else {
        toast.error(`Credencial inválida: ${result.error}`)
      }
    },
    onError: (error: any) => {
      toast.error(`Error al validar credencial: ${error.message}`)
    }
  })

  return {
    credentials: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createCredential: createMutation.mutate,
    deleteCredential: deleteMutation.mutate,
    validateCredential: validateMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isValidating: validateMutation.isPending
  }
}

// Hook para obtener una credencial activa específica
export function useActiveCredential(provider: string) {
  const { activeClient } = useActiveClient()

  return useQuery({
    queryKey: ['active-credential', provider, activeClient?.id],
    queryFn: () => credentialsService.getActiveCredential(provider, activeClient?.id),
    enabled: !!activeClient && !!provider,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false
  })
}

// Hook para verificar si hay credenciales configuradas
export function useHasCredentials(provider: string) {
  const { activeClient } = useActiveClient()

  return useQuery({
    queryKey: ['has-credentials', provider, activeClient?.id],
    queryFn: () => credentialsService.hasActiveCredentials(provider, activeClient?.id),
    enabled: !!activeClient && !!provider,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false
  })
}

// Hook para obtener proveedores disponibles
export function useProviders() {
  return useQuery({
    queryKey: ['api-providers'],
    queryFn: () => credentialsService.getProviders(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para obtener estadísticas de uso de una credencial
export function useCredentialStats(credentialId: string) {
  return useQuery({
    queryKey: ['credential-stats', credentialId],
    queryFn: () => credentialsService.getCredentialStats(credentialId),
    enabled: !!credentialId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Hook para obtener logs de uso de una credencial
export function useCredentialLogs(credentialId: string, limit = 50) {
  return useQuery({
    queryKey: ['credential-logs', credentialId, limit],
    queryFn: () => credentialsService.getCredentialUsageLogs(credentialId, limit),
    enabled: !!credentialId,
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

// Hook para hacer llamadas a APIs usando credenciales
export function useApiCall() {
  const { activeClient } = useActiveClient()

  const makeApiCall = async (
    provider: string,
    endpoint: string,
    options: RequestInit = {}
  ) => {
    if (!activeClient) {
      throw new Error('No hay cliente activo')
    }

    // Obtener credencial activa
    const credential = await credentialsService.getActiveCredential(provider, activeClient.id)
    if (!credential) {
      throw new Error(`No hay credencial configurada para ${provider}`)
    }

    // Verificar si está expirada
    if (credentialsService.isCredentialExpired(credential)) {
      throw new Error(`La credencial de ${provider} ha expirado`)
    }

    const startTime = Date.now()

    try {
      // Rutea la llamada vía Edge Function provider-proxy
      const { data: sessionData } = await credentialsService['supabase']?.auth.getSession?.() || { data: null }
      // Nota: Acceso al token mediante el cliente compartido de supabase utilizado por el servicio
      const anyCredSvc = credentialsService as any
      const supabase: any = anyCredSvc?.constructor?.prototype?.supabase || anyCredSvc?.supabase || null
      const { data: sess } = supabase?.auth ? await supabase.auth.getSession() : { data: null }
      const accessToken = sess?.session?.access_token

      if (!accessToken) throw new Error('No autenticado')

      const functionsUrl = `${supabase.functionsUrl || ''}` || (typeof window !== 'undefined' ? `${window.location.origin.replace(/:\\d+$/, '')}` : '')
      const baseUrl = functionsUrl || (supabase['rest']?.url?.replace('rest', 'functions') || '')
      const url = `${baseUrl}/v1/provider-proxy`

      // Obtener credencial activa sin exponer secreto
      const credential = await credentialsService.getActiveCredential(provider, activeClient.id)
      if (!credential) throw new Error(`No hay credencial configurada para ${provider}`)

      const proxyRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          provider,
          credential_id: credential.id,
          url: endpoint,
          method: options.method || 'GET',
          headers: options.headers || {},
          body: (options as any).body || undefined
        })
      })

      if (!proxyRes.ok) {
        throw new Error(`Proxy error: ${proxyRes.status}`)
      }

      const contentType = proxyRes.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
        return await proxyRes.json()
      }
      return await proxyRes.text()

      const responseTime = Date.now() - startTime

      // Registrar el uso
      await credentialsService.logCredentialUsage(
        credential.id,
        response.ok ? 'use' : 'error',
        {
          endpoint,
          status_code: response.status,
          response_time_ms: responseTime,
          error_message: response.ok ? undefined : `HTTP ${response.status}`
        }
      )

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      const responseTime = Date.now() - startTime

      // Registrar el error
      await credentialsService.logCredentialUsage(
        credential.id,
        'error',
        {
          endpoint,
          response_time_ms: responseTime,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }
      )

      throw error
    }
  }

  return { makeApiCall }
}

// Hook para validar múltiples credenciales
export function useValidateCredentials() {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()

  const validateAllMutation = useMutation({
    mutationFn: async () => {
      if (!activeClient) throw new Error('No hay cliente activo')

      const credentials = await credentialsService.getCredentials(activeClient.id)
      const results = await Promise.allSettled(
        credentials.map(cred => credentialsService.validateCredential(cred.id))
      )

      return results.map((result, index) => ({
        credential: credentials[index],
        result: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
    },
    onSuccess: (results) => {
      const validCount = results.filter(r => r.result?.valid).length
      const totalCount = results.length
      
      if (validCount === totalCount) {
        toast.success(`Todas las credenciales (${totalCount}) son válidas`)
      } else {
        toast.warning(`${validCount}/${totalCount} credenciales son válidas`)
      }

      queryClient.invalidateQueries({ queryKey: ['api-credentials'] })
    },
    onError: (error: any) => {
      toast.error(`Error al validar credenciales: ${error.message}`)
    }
  })

  return {
    validateAll: validateAllMutation.mutate,
    isValidating: validateAllMutation.isPending
  }
}
