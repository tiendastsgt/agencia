import React, { useEffect, useState } from 'react'
import { useAuth } from '../lib/authSimple'
import { testSupabaseConnection, checkAuthStatus } from '../lib/supabase-test'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

export default function AuthDiagnostic() {
  const { user, session, loading } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testConnection = async () => {
    setIsTesting(true)
    try {
      const result = await testSupabaseConnection()
      setConnectionStatus(result)
    } catch (error) {
      console.error('Error testing connection:', error)
      setConnectionStatus(false)
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Verificando...</Badge>
    return status ? <Badge className="bg-green-100 text-green-800">Conectado</Badge> : <Badge className="bg-red-100 text-red-800">Desconectado</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Diagnóstico de Autenticación
          </CardTitle>
          <CardDescription>
            Estado actual de la conexión a Supabase y autenticación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Variables de entorno */}
          <div className="space-y-2">
            <h4 className="font-medium">Variables de Entorno</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(!!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_project_url_here'))}
                <span>VITE_SUPABASE_URL</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(!!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your_supabase_anon_key_here'))}
                <span>VITE_SUPABASE_ANON_KEY</span>
              </div>
            </div>
          </div>

          {/* Estado de conexión */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Conexión a Supabase</h4>
              <div className="flex items-center gap-2">
                {getStatusBadge(connectionStatus)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={testConnection}
                  disabled={isTesting}
                >
                  {isTesting ? 'Probando...' : 'Probar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Estado de autenticación */}
          <div className="space-y-2">
            <h4 className="font-medium">Estado de Autenticación</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Usuario autenticado:</span>
                {getStatusBadge(!!user)}
              </div>
              {user && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="font-mono text-xs">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Alertas */}
          {!user && !loading && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No hay usuario autenticado. Debes iniciar sesión para acceder a las funcionalidades del sistema.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === false && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                No se puede conectar a Supabase. Verifica que las variables de entorno estén configuradas correctamente.
              </AlertDescription>
            </Alert>
          )}

          {loading && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Verificando autenticación...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
