import React from 'react'
import { useCredentials, useProviders } from '../lib/hooks/useCredentials'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface CredentialsStatusProps {
  showAll?: boolean
  maxItems?: number
}

export function CredentialsStatus({ showAll = false, maxItems = 6 }: CredentialsStatusProps) {
  const { credentials, isLoading } = useCredentials()
  const { data: providers = [] } = useProviders()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Estado de Credenciales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Agrupar credenciales por proveedor
  const credentialsByProvider = credentials.reduce((acc, cred) => {
    if (!acc[cred.provider]) acc[cred.provider] = []
    acc[cred.provider].push(cred)
    return acc
  }, {} as Record<string, typeof credentials>)

  // Obtener proveedores con credenciales
  const providersWithCredentials = providers.filter(provider => 
    credentialsByProvider[provider.name]?.length > 0
  )

  // Obtener proveedores sin credenciales
  const providersWithoutCredentials = providers.filter(provider => 
    !credentialsByProvider[provider.name]?.length
  )

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      openai: '🤖',
      facebook: '📘',
      instagram: '📷',
      google: '🔍',
      linkedin: '💼',
      twitter: '🐦',
      tiktok: '🎵',
      youtube: '📺',
      stability: '🎨',
      runway: '🎬'
    }
    return icons[provider] || '🔑'
  }

  const getStatusIcon = (credential: any) => {
    if (!credential.is_active) return <XCircle className="h-4 w-4 text-red-500" />
    
    // Verificar si está expirada
    const isExpired = credential.expires_at && new Date(credential.expires_at) < new Date()
    if (isExpired) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusColor = (credential: any) => {
    if (!credential.is_active) return 'bg-red-100 text-red-800'
    
    const isExpired = credential.expires_at && new Date(credential.expires_at) < new Date()
    if (isExpired) return 'bg-yellow-100 text-yellow-800'
    
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (credential: any) => {
    if (!credential.is_active) return 'Inactiva'
    
    const isExpired = credential.expires_at && new Date(credential.expires_at) < new Date()
    if (isExpired) return 'Expirada'
    
    return 'Activa'
  }

  // Calcular estadísticas
  const totalCredentials = credentials.length
  const activeCredentials = credentials.filter(cred => 
    cred.is_active && (!cred.expires_at || new Date(cred.expires_at) >= new Date())
  ).length
  const expiredCredentials = credentials.filter(cred => 
    cred.expires_at && new Date(cred.expires_at) < new Date()
  ).length

  const displayProviders = showAll 
    ? [...providersWithCredentials, ...providersWithoutCredentials]
    : providersWithCredentials.slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Estado de Credenciales
            </CardTitle>
            <CardDescription>
              {totalCredentials} credenciales configuradas • {activeCredentials} activas
            </CardDescription>
          </div>
          <Link to="/credentials">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Gestionar
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeCredentials}</div>
            <div className="text-sm text-muted-foreground">Activas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{expiredCredentials}</div>
            <div className="text-sm text-muted-foreground">Expiradas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{providersWithoutCredentials.length}</div>
            <div className="text-sm text-muted-foreground">Sin configurar</div>
          </div>
        </div>

        {/* Lista de proveedores */}
        {displayProviders.length === 0 ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              No hay credenciales configuradas. Configura al menos una para comenzar.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {displayProviders.map((provider) => {
              const providerCredentials = credentialsByProvider[provider.name] || []
              const hasCredentials = providerCredentials.length > 0
              
              return (
                <div
                  key={provider.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getProviderIcon(provider.name)}</span>
                    <div>
                      <div className="font-medium">{provider.display_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {hasCredentials 
                          ? `${providerCredentials.length} credencial${providerCredentials.length > 1 ? 'es' : ''}`
                          : 'Sin configurar'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasCredentials ? (
                      <div className="flex items-center gap-1">
                        {providerCredentials.map((credential) => (
                          <Badge
                            key={credential.id}
                            className={`${getStatusColor(credential)} text-xs`}
                          >
                            {getStatusIcon(credential)}
                            <span className="ml-1">{getStatusText(credential)}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <XCircle className="h-3 w-3 mr-1" />
                        Sin configurar
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Alertas importantes */}
        {expiredCredentials > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Tienes {expiredCredentials} credencial{expiredCredentials > 1 ? 'es' : ''} expirada{expiredCredentials > 1 ? 's' : ''}. 
              Actualízalas para mantener el acceso a las APIs.
            </AlertDescription>
          </Alert>
        )}

        {providersWithoutCredentials.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Hay {providersWithoutCredentials.length} API{providersWithoutCredentials.length > 1 ? 's' : ''} disponible{providersWithoutCredentials.length > 1 ? 's' : ''} 
              sin configurar. Configúralas para acceder a más funcionalidades.
            </AlertDescription>
          </Alert>
        )}

        {!showAll && providersWithCredentials.length > maxItems && (
          <div className="text-center">
            <Link to="/credentials">
              <Button variant="outline" size="sm">
                Ver todas las credenciales ({providersWithCredentials.length})
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
