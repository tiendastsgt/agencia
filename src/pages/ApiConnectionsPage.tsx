import React, { useState } from 'react'
import { useActiveClient } from '@/lib/client-context'
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
  name: string
  platform: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  credentials: {
    apiKey?: string
    secret?: string
    token?: string
  }
}

export default function ApiConnectionsPage() {
  const { activeClient } = useActiveClient()
  const [connections, setConnections] = useState<ApiConnection[]>([
    {
      id: '1',
      name: 'Facebook Business',
      platform: 'facebook',
      status: 'connected',
      lastSync: '2025-01-10T10:30:00Z',
      credentials: { apiKey: 'fb_****1234', secret: '****5678' }
    },
    {
      id: '2',
      name: 'Instagram Business',
      platform: 'instagram',
      status: 'connected',
      lastSync: '2025-01-10T09:15:00Z',
      credentials: { token: 'ig_****abcd' }
    },
    {
      id: '3',
      name: 'LinkedIn Marketing',
      platform: 'linkedin',
      status: 'disconnected',
      lastSync: '2025-01-08T14:20:00Z',
      credentials: { apiKey: 'li_****efgh' }
    },
    {
      id: '4',
      name: 'Twitter API',
      platform: 'twitter',
      status: 'error',
      lastSync: '2025-01-09T16:45:00Z',
      credentials: { apiKey: 'tw_****ijkl' }
    }
  ])
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [isConnecting, setIsConnecting] = useState(false)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />
      case 'linkedin': return <Linkedin className="h-5 w-5 text-blue-700" />
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />
      case 'email': return <Mail className="h-5 w-5 text-gray-600" />
      default: return <Zap className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default'
      case 'disconnected': return 'secondary'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado'
      case 'disconnected': return 'Desconectado'
      case 'error': return 'Error'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <XCircle className="h-4 w-4 text-gray-500" />
    }
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
      
      setConnections(prev => prev.map(conn => 
        conn.id === id 
          ? { ...conn, status: 'connected' as const, lastSync: new Date().toISOString() }
          : conn
      ))
      
      toast.success('Conexión probada exitosamente')
    } catch (error) {
      toast.error('Error al probar la conexión')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectConnection = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'disconnected' as const }
        : conn
    ))
    toast.success('Conexión desconectada')
  }

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id))
    toast.success('Conexión eliminada')
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
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Conexión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <Card key={connection.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getPlatformIcon(connection.platform)}
                  <div>
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {connection.platform}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(connection.status)}
                  <Badge variant={getStatusColor(connection.status)}>
                    {getStatusLabel(connection.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-600">Última sincronización:</p>
                  <p className="font-medium">
                    {new Date(connection.lastSync).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Credenciales:</p>
                  <div className="space-y-1">
                    {Object.entries(connection.credentials).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {showCredentials[connection.id] ? value : '****'}
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
                    ))}
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
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectConnection(connection.id)}
                    >
                      <XCircle className="h-4 w-4" />
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

      {connections.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay conexiones API
          </h3>
          <p className="text-gray-600 mb-4">
            Conecta tus plataformas para sincronizar datos
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Conexión
          </Button>
        </div>
      )}
    </div>
  )
}