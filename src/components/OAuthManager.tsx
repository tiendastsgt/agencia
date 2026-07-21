import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { facebookAPIService } from '@/lib/facebook-api'
import { instagramAPIService } from '@/lib/instagram-api'
import { credentialsService } from '@/lib/credentials-service'
import { useActiveClient } from '@/lib/client-context'
import { Facebook, Instagram, ExternalLink, CheckCircle, AlertCircle, Key, RefreshCw } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface OAuthStatus {
  platform: string
  isConnected: boolean
  expiresAt?: string
  scopes?: string[]
  error?: string
}

export default function OAuthManager() {
  const { activeClient } = useActiveClient()
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [authCode, setAuthCode] = useState('')

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      description: 'Conecta tu cuenta de Facebook para gestionar páginas y publicar contenido'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      description: 'Conecta tu cuenta de Instagram para gestionar contenido y ver métricas'
    }
  ]

  useEffect(() => {
    checkOAuthStatus()
  }, [])

  const checkOAuthStatus = async () => {
    if (!activeClient) return

    setIsLoading(true)
    const statuses: OAuthStatus[] = []

    try {
      // Verificar Facebook
      const facebookConfigured = await facebookAPIService.isConfigured()
      statuses.push({
        platform: 'facebook',
        isConnected: facebookConfigured,
        scopes: ['pages_read_engagement', 'pages_manage_posts', 'pages_show_list', 'read_insights']
      })

      // Verificar Instagram
      const instagramConfigured = await instagramAPIService.isConfigured()
      statuses.push({
        platform: 'instagram',
        isConnected: instagramConfigured,
        scopes: ['instagram_basic', 'instagram_manage_insights', 'pages_show_list']
      })

      setOauthStatus(statuses)
    } catch (error) {
      console.error('Error checking OAuth status:', error)
      toast.error('Error al verificar estado de conexiones')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = (platformId: string) => {
    setSelectedPlatform(platformId)
    setIsDialogOpen(true)
  }

  const handleAuthCodeSubmit = async () => {
    if (!authCode.trim()) {
      toast.error('Ingresa el código de autorización')
      return
    }

    if (!activeClient) {
      toast.error('No hay cliente activo')
      return
    }

    try {
      setIsLoading(true)
      const redirectUri = `${window.location.origin}/oauth/callback`

      let result
      if (selectedPlatform === 'facebook') {
        result = await facebookAPIService.exchangeCodeForToken(authCode, redirectUri)
      } else if (selectedPlatform === 'instagram') {
        result = await instagramAPIService.exchangeCodeForToken(authCode, redirectUri)
      } else {
        throw new Error('Plataforma no soportada')
      }

      if (result.success && result.accessToken) {
        // Guardar las credenciales
        await credentialsService.saveCredential({
          provider: selectedPlatform,
          api_key: 'oauth_token',
          api_secret: 'oauth_secret',
          access_token: result.accessToken,
          client_id: activeClient.id,
          user_id: activeClient.user_id,
          is_active: true
        })

        toast.success(`Conectado exitosamente a ${selectedPlatform}`)
        setIsDialogOpen(false)
        setAuthCode('')
        await checkOAuthStatus()
      } else {
        throw new Error(result.error || 'Error al conectar')
      }
    } catch (error) {
      console.error('Error connecting OAuth:', error)
      toast.error('Error al conectar: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async (platformId: string) => {
    if (!activeClient) {
      toast.error('No hay cliente activo')
      return
    }

    try {
      setIsLoading(true)
      
      // Eliminar credenciales
      await credentialsService.deleteCredential(platformId, activeClient.id)
      
      toast.success(`Desconectado de ${platformId}`)
      await checkOAuthStatus()
    } catch (error) {
      console.error('Error disconnecting OAuth:', error)
      toast.error('Error al desconectar: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthURL = (platformId: string) => {
    const redirectUri = `${window.location.origin}/oauth/callback`
    
    if (platformId === 'facebook') {
      return facebookAPIService.getAuthURL(redirectUri)
    } else if (platformId === 'instagram') {
      return instagramAPIService.getAuthURL(redirectUri)
    }
    
    return ''
  }

  const getStatus = (platformId: string) => {
    return oauthStatus.find(s => s.platform === platformId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Conexiones OAuth2</h2>
          <p className="text-gray-600">Gestiona las conexiones con redes sociales</p>
        </div>
        <Button onClick={checkOAuthStatus} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Lista de plataformas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon
          const status = getStatus(platform.id)
          const isConnected = status?.isConnected || false

          return (
            <Card key={platform.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${platform.color}`} />
                    <span>{platform.name}</span>
                  </div>
                  <Badge variant={isConnected ? "default" : "outline"}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Estado de conexión */}
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-sm">
                      {isConnected ? 'Conectado y listo para usar' : 'No conectado'}
                    </span>
                  </div>

                  {/* Permisos */}
                  {status?.scopes && (
                    <div>
                      <Label className="text-sm font-medium">Permisos:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {status.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {isConnected ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(platform.id)}
                          disabled={isLoading}
                        >
                          Desconectar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(getAuthURL(platform.id), '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Reautorizar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleConnect(platform.id)}
                        disabled={isLoading}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog para código de autorización */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar con {selectedPlatform}</DialogTitle>
            <DialogDescription>
              Sigue estos pasos para conectar tu cuenta:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pasos para conectar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Haz clic en "Abrir Autorización" para ir a {selectedPlatform}</li>
                <li>Inicia sesión y autoriza la aplicación</li>
                <li>Copia el código de autorización que aparece</li>
                <li>Pega el código aquí y haz clic en "Conectar"</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => window.open(getAuthURL(selectedPlatform), '_blank')}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir Autorización
              </Button>
            </div>

            <div>
              <Label htmlFor="auth-code">Código de Autorización</Label>
              <Input
                id="auth-code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Pega aquí el código de autorización"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAuthCodeSubmit}
                disabled={isLoading || !authCode.trim()}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Conectar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
