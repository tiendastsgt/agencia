import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  credentialsService, 
  ApiProvider, 
  ApiCredential, 
  CreateCredentialRequest 
} from '../lib/credentials-service'
import { useActiveClient } from '../lib/client-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  ExternalLink,
  AlertTriangle,
  Shield,
  Lock
} from 'lucide-react'

export default function CredentialsPage() {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showValue, setShowValue] = useState<Record<string, boolean>>({})

  // Queries
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ['api-providers'],
    queryFn: () => credentialsService.getProviders()
  })

  const { data: credentials = [], isLoading: credentialsLoading } = useQuery({
    queryKey: ['api-credentials', activeClient?.id],
    queryFn: () => credentialsService.getCredentials(activeClient?.id),
    enabled: !!activeClient
  })

  // Mutations
  const createCredentialMutation = useMutation({
    mutationFn: (request: CreateCredentialRequest) => 
      credentialsService.createCredential(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-credentials'] })
      setShowCreateDialog(false)
      toast.success('Credencial creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al crear credencial: ${error.message}`)
    }
  })

  const deleteCredentialMutation = useMutation({
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

  const validateCredentialMutation = useMutation({
    mutationFn: (credentialId: string) => 
      credentialsService.validateCredential(credentialId),
    onSuccess: (result) => {
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

  // Agrupar credenciales por proveedor
  const credentialsByProvider = credentials.reduce((acc, cred) => {
    if (!acc[cred.provider]) acc[cred.provider] = []
    acc[cred.provider].push(cred)
    return acc
  }, {} as Record<string, ApiCredential[]>)

  // Obtener proveedores con credenciales
  const providersWithCredentials = providers.filter(provider => 
    credentialsByProvider[provider.name]?.length > 0
  )

  // Obtener proveedores sin credenciales
  const providersWithoutCredentials = providers.filter(provider => 
    !credentialsByProvider[provider.name]?.length
  )

  const handleCreateCredential = (formData: FormData) => {
    const request: CreateCredentialRequest = {
      provider: formData.get('provider') as string,
      credential_name: formData.get('credential_name') as string,
      credential_type: formData.get('credential_type') as 'api_key' | 'oauth_token' | 'service_account',
      credential_value: formData.get('credential_value') as string,
      client_id: activeClient?.id,
      expires_at: formData.get('expires_at') as string || undefined,
      config: {}
    }

    createCredentialMutation.mutate(request)
  }

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

  const getAuthTypeColor = (authType: string) => {
    const colors: Record<string, string> = {
      api_key: 'bg-blue-100 text-blue-800',
      oauth2: 'bg-green-100 text-green-800',
      service_account: 'bg-purple-100 text-purple-800'
    }
    return colors[authType] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (credential: ApiCredential) => {
    if (!credential.is_active) return <XCircle className="h-4 w-4 text-red-500" />
    if (credentialsService.isCredentialExpired(credential)) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  if (!activeClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Selecciona un cliente para gestionar las credenciales de API
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Credenciales</h1>
          <p className="text-muted-foreground">
            Administra las credenciales de API para {activeClient.name}
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Credencial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Credencial de API</DialogTitle>
              <DialogDescription>
                Configura una nueva credencial para acceder a APIs externas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleCreateCredential(new FormData(e.currentTarget))
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor</Label>
                <Select name="provider" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        <div className="flex items-center gap-2">
                          <span>{getProviderIcon(provider.name)}</span>
                          <span>{provider.display_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_name">Nombre de la Credencial</Label>
                <Input
                  name="credential_name"
                  placeholder="Ej: OpenAI Production Key"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_type">Tipo de Credencial</Label>
                <Select name="credential_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="oauth_token">OAuth Token</SelectItem>
                    <SelectItem value="service_account">Service Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_value">Valor de la Credencial</Label>
                <Textarea
                  name="credential_value"
                  placeholder="Pega aquí tu API key o token"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Fecha de Expiración (Opcional)</Label>
                <Input
                  name="expires_at"
                  type="datetime-local"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCredentialMutation.isPending}
                >
                  {createCredentialMutation.isPending ? 'Creando...' : 'Crear Credencial'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="configured" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configured">
            Configuradas ({providersWithCredentials.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Disponibles ({providersWithoutCredentials.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configured" className="space-y-4">
          {providersWithCredentials.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Key className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No hay credenciales configuradas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {providersWithCredentials.map((provider) => (
                <Card key={provider.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getProviderIcon(provider.name)}</span>
                        <div>
                          <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                          <CardDescription>{provider.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAuthTypeColor(provider.auth_type)}>
                          {provider.auth_type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(provider.documentation_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {credentialsByProvider[provider.name].map((credential) => (
                        <div
                          key={credential.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(credential)}
                            <div>
                              <p className="font-medium">{credential.credential_name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {credential.credential_type}
                                </Badge>
                                {credential.last_used_at && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      Usado: {new Date(credential.last_used_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  <span>{credential.usage_count} usos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => validateCredentialMutation.mutate(credential.id)}
                              disabled={validateCredentialMutation.isPending}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowValue(prev => ({
                                ...prev,
                                [credential.id]: !prev[credential.id]
                              }))}
                            >
                              {showValue[credential.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCredentialMutation.mutate(credential.id)}
                              disabled={deleteCredentialMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {providersWithoutCredentials.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="text-muted-foreground">
                    Todas las APIs disponibles están configuradas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {providersWithoutCredentials.map((provider) => (
                <Card key={provider.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getProviderIcon(provider.name)}</span>
                      <div>
                        <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                        <CardDescription className="text-sm">
                          {provider.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge className={getAuthTypeColor(provider.auth_type)}>
                        {provider.auth_type}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider.name)
                            setShowCreateDialog(true)
                          }}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(provider.documentation_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Información de Seguridad */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Lock className="h-5 w-5" />
            Seguridad de Credenciales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Todas las credenciales se almacenan encriptadas usando AES-256</p>
            <p>• Solo tú puedes ver y usar tus credenciales</p>
            <p>• Se registra el uso de cada credencial para auditoría</p>
            <p>• Las credenciales expiradas se marcan automáticamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
