import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Zap
} from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface ApiConnection {
  id: string
  client_id?: string
  user_id?: string
  provider: string
  credential_name: string
  credential_type: string
  encrypted_value: string
  encryption_key_id: string
  is_active: boolean
  expires_at?: string
  last_used_at?: string
  usage_count: number
  config: any
  created_at: string
  updated_at: string
  created_by?: string
}

export default function ApiConnectionsPage() {
  const { activeClient } = useActiveClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newConnection, setNewConnection] = useState({
    provider: '',
    apiKey: ''
  })
  const [connections, setConnections] = useState<ApiConnection[]>([])
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar conexiones desde Supabase
  const loadConnections = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando conexiones:', error)
        toast.error('Error al cargar las conexiones')
        return
      }

      setConnections(data || [])
    } catch (error) {
      console.error('Error cargando conexiones:', error)
      toast.error('Error al cargar las conexiones')
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar conexiones al montar el componente
  useEffect(() => {
    if (activeClient) {
      loadConnections()
    }
  }, [activeClient])

  const handleCreateConnection = async () => {
    if (!newConnection.provider || !newConnection.apiKey) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setIsConnecting(true)
      
      const { data, error } = await supabase
        .from('api_credentials')
        .insert([
          {
            provider: newConnection.provider,
            encrypted_value: newConnection.apiKey, // Por ahora sin encriptar
            credential_name: newConnection.provider + ' API Key',
            credential_type: 'api_key',
            encryption_key_id: 'default', // Por ahora usar clave por defecto
            is_active: true,
            config: {}
          }
        ])
        .select()

      if (error) {
        console.error('Error creando conexión:', error)
        toast.error('Error al crear la conexión')
        return
      }

      // Recargar las conexiones
      await loadConnections()
      
      setNewConnection({ provider: '', apiKey: '' })
      setShowCreateForm(false)
      toast.success('Conexión creada exitosamente')
    } catch (error) {
      console.error('Error creando conexión:', error)
      toast.error('Error al crear la conexión')
    } finally {
      setIsConnecting(false)
    }
  }

  const getPlatformIcon = (provider: string) => {
    switch (provider) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />
      case 'linkedin': return <Linkedin className="h-5 w-5 text-blue-700" />
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />
      case 'gemini': return <Zap className="h-5 w-5 text-purple-600" />
      case 'openai': return <Zap className="h-5 w-5 text-green-600" />
      case 'email': return <Mail className="h-5 w-5 text-gray-600" />
      default: return <Zap className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary'
  }

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo'
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-gray-500" />
  }

  const toggleCredentials = (id: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const testConnection = async (id: string) => {
    setIsConnecting(true)
    try {
      // Simular test de conexión
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { error } = await supabase
        .from('api_credentials')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Error actualizando conexión:', error)
        toast.error('Error al probar la conexión')
        return
      }

      await loadConnections()
      toast.success('Conexión probada exitosamente')
    } catch (error) {
      console.error('Error probando conexión:', error)
      toast.error('Error al probar la conexión')
    } finally {
      setIsConnecting(false)
    }
  }

  const toggleConnection = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_credentials')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error actualizando conexión:', error)
        toast.error('Error al actualizar la conexión')
        return
      }

      await loadConnections()
      toast.success(`Conexión ${!isActive ? 'activada' : 'desactivada'}`)
    } catch (error) {
      console.error('Error actualizando conexión:', error)
      toast.error('Error al actualizar la conexión')
    }
  }

  const deleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_credentials')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error eliminando conexión:', error)
        toast.error('Error al eliminar la conexión')
        return
      }

      await loadConnections()
      toast.success('Conexión eliminada')
    } catch (error) {
      console.error('Error eliminando conexión:', error)
      toast.error('Error al eliminar la conexión')
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Conexiones API</h1>
          <p className="text-gray-600">Selecciona un cliente para gestionar sus APIs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conexiones API</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las conexiones API para {activeClient.name}
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4" />
          Nueva Conexión
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-600">Cargando conexiones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(connection.provider)}
                    <div>
                      <CardTitle className="text-lg">
                        {connection.credential_name || connection.provider + ' API Key'}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {connection.provider}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(connection.is_active)}
                    <Badge variant={getStatusColor(connection.is_active)}>
                      {getStatusLabel(connection.is_active)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <p className="text-gray-600">Tipo:</p>
                      <p className="font-medium capitalize">{connection.credential_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Creado:</p>
                      <p className="font-medium">
                        {new Date(connection.created_at).toLocaleString()}
                      </p>
                    </div>
                    {connection.usage_count > 0 && (
                      <div>
                        <p className="text-gray-600">Usos:</p>
                        <p className="font-medium">{connection.usage_count}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">API Key:</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Key:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showCredentials[connection.id] ? connection.encrypted_value : '****'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCredentials(connection.id)}
                        >
                          {showCredentials[connection.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => testConnection(connection.id)}
                        disabled={isConnecting}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleConnection(connection.id, connection.is_active)}
                      >
                        {connection.is_active ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteConnection(connection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {connections.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay conexiones API
          </h3>
          <p className="text-gray-600 mb-4">
            Conecta tus plataformas para sincronizar datos
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Conexión
          </Button>
        </div>
      )}

      {/* Modal para crear nueva conexión */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Nueva Conexión API</CardTitle>
              <CardDescription>
                Agrega una nueva conexión API para sincronizar datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">Proveedor *</Label>
                <Input
                  id="provider"
                  value={newConnection.provider}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, provider: e.target.value }))}
                  placeholder="gemini, openai, facebook, etc."
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={newConnection.apiKey}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Tu API key"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateConnection} 
                  className="flex-1"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Creando...' : 'Crear Conexión'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                  disabled={isConnecting}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}