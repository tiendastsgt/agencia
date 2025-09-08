import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Save,
  TestTube,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface APIConfig {
  platform: string
  name: string
  description: string
  fields: {
    key: string
    label: string
    type: 'text' | 'password'
    placeholder: string
    required: boolean
  }[]
  icon: string
  docsUrl: string
}

const API_CONFIGS: APIConfig[] = [
  {
    platform: 'meta',
    name: 'Meta (Facebook)',
    description: 'Conecta con Facebook e Instagram para obtener métricas de páginas y posts.',
    fields: [
      {
        key: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Tu access token de Facebook',
        required: true
      },
      {
        key: 'page_id',
        label: 'Page ID',
        type: 'text',
        placeholder: 'ID de la página de Facebook',
        required: true
      }
    ],
    icon: '📘',
    docsUrl: 'https://developers.facebook.com/docs/graph-api/'
  },
  {
    platform: 'twitter',
    name: 'Twitter (X)',
    description: 'Conecta con Twitter para obtener métricas de tweets y perfil.',
    fields: [
      {
        key: 'bearer_token',
        label: 'Bearer Token',
        type: 'password',
        placeholder: 'Tu bearer token de Twitter',
        required: true
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Nombre de usuario sin @',
        required: true
      }
    ],
    icon: '🐦',
    docsUrl: 'https://developer.twitter.com/en/docs/twitter-api'
  },
  {
    platform: 'linkedin',
    name: 'LinkedIn',
    description: 'Conecta con LinkedIn para obtener métricas de empresa y posts.',
    fields: [
      {
        key: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Tu access token de LinkedIn',
        required: true
      },
      {
        key: 'company_id',
        label: 'Company ID',
        type: 'text',
        placeholder: 'ID de la empresa en LinkedIn',
        required: true
      }
    ],
    icon: '💼',
    docsUrl: 'https://docs.microsoft.com/en-us/linkedin/'
  },
  {
    platform: 'tiktok',
    name: 'TikTok',
    description: 'Conecta con TikTok para obtener métricas de videos y perfil.',
    fields: [
      {
        key: 'access_token',
        label: 'Access Token',
        type: 'password',
        placeholder: 'Tu access token de TikTok',
        required: true
      },
      {
        key: 'user_id',
        label: 'User ID',
        type: 'text',
        placeholder: 'ID del usuario en TikTok',
        required: true
      }
    ],
    icon: '🎵',
    docsUrl: 'https://developers.tiktok.com/doc/'
  },
  {
    platform: 'google_analytics',
    name: 'Google Analytics',
    description: 'Conecta con Google Analytics para obtener métricas del sitio web.',
    fields: [
      {
        key: 'property_id',
        label: 'Property ID',
        type: 'text',
        placeholder: 'GA4 Property ID (ej: 123456789)',
        required: true
      },
      {
        key: 'service_account_key',
        label: 'Service Account Key (JSON)',
        type: 'password',
        placeholder: 'Clave de cuenta de servicio en formato JSON',
        required: true
      }
    ],
    icon: '📊',
    docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1'
  }
]

export default function APICredentialsManager() {
  const { activeClient, configuredAPIs, loadConfiguredAPIs } = useAuth()
  const [credentials, setCredentials] = useState<{[platform: string]: any}>({})
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({})
  const [testing, setTesting] = useState<{[platform: string]: boolean}>({})
  const [saving, setSaving] = useState<{[platform: string]: boolean}>({})
  const [testResults, setTestResults] = useState<{[platform: string]: any}>({})

  useEffect(() => {
    if (activeClient) {
      loadExistingCredentials()
    }
  }, [activeClient])

  const loadExistingCredentials = async () => {
    if (!activeClient) return

    try {
      // Obtener token de sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        console.error('No hay sesión activa para cargar credenciales')
        return
      }

      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'get',
          client_id: activeClient.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (error) {
        console.error('Error cargando credenciales:', error)
        return
      }

      if (!data?.data) {
        console.log('No hay credenciales existentes para este cliente')
        return
      }

      const existingCreds: {[platform: string]: any} = {}
      data.data.forEach((cred: any) => {
        existingCreds[cred.platform] = cred.credentials
      })
      
      setCredentials(existingCreds)
      console.log('Credenciales cargadas:', Object.keys(existingCreds))
    } catch (error) {
      console.error('Error cargando credenciales:', error)
    }
  }

  const handleInputChange = (platform: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }))
  }

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const testCredentials = async (platform: string) => {
    if (!activeClient || !credentials[platform]) {
      toast.error('Completa todos los campos requeridos antes de probar')
      return
    }

    setTesting(prev => ({ ...prev, [platform]: true }))
    setTestResults(prev => ({ ...prev, [platform]: null }))

    try {
      // Obtener token de sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }

      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'test',
          client_id: activeClient.id,
          platform,
          credentials: credentials[platform]
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (error) {
        console.error('Error probando credenciales:', error)
        throw new Error(error.message || 'Error probando credenciales')
      }

      if (!data?.data) {
        throw new Error('No se recibieron datos de respuesta del test')
      }

      setTestResults(prev => ({
        ...prev,
        [platform]: data.data
      }))

      if (data.data.success) {
        toast.success(`✅ Credenciales de ${API_CONFIGS.find(c => c.platform === platform)?.name} funcionan correctamente`)
      } else {
        toast.error(`❌ Error en credenciales de ${API_CONFIGS.find(c => c.platform === platform)?.name}: ${data.data.message}`)
      }
    } catch (error) {
      console.error('Error probando credenciales:', error)
      toast.error(`❌ Error probando credenciales: ${error.message || 'Error de conexión'}`)
      setTestResults(prev => ({
        ...prev,
        [platform]: {
          success: false,
          message: error.message || 'Error de conexión'
        }
      }))
    } finally {
      setTesting(prev => ({ ...prev, [platform]: false }))
    }
  }

  const saveCredentials = async (platform: string) => {
    if (!activeClient || !credentials[platform]) return

    setSaving(prev => ({ ...prev, [platform]: true }))

    try {
      // Obtener token de sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }
      
      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'set',
          client_id: activeClient.id,
          platform,
          credentials: credentials[platform]
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (error) {
        console.error('Error from Edge Function:', error)
        throw new Error(error.message || 'Error guardando credenciales')
      }

      if (!data?.data) {
        throw new Error('No se recibieron datos de respuesta')
      }

      console.log('Credenciales guardadas exitosamente:', data.data)
      toast.success(`✅ Credenciales de ${API_CONFIGS.find(c => c.platform === platform)?.name} guardadas correctamente`)
      
      // Recargar estado de APIs configuradas
      await loadConfiguredAPIs(activeClient.id)
      
      // 🎯 NUEVO: Probar automáticamente las credenciales después de guardar
      toast.info('🧪 Probando credenciales automáticamente...')
      await testCredentials(platform)
      
    } catch (error) {
      console.error('Error guardando credenciales:', error)
      toast.error(`❌ Error guardando credenciales: ${error.message || 'Error desconocido'}`)
    } finally {
      setSaving(prev => ({ ...prev, [platform]: false }))
    }
  }

  const deleteCredentials = async (platform: string) => {
    if (!activeClient) return

    if (!confirm(`¿Estás seguro de que quieres eliminar las credenciales de ${API_CONFIGS.find(c => c.platform === platform)?.name}?`)) {
      return
    }

    try {
      // Obtener token de sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }

      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'delete',
          client_id: activeClient.id,
          platform
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (error) throw error

      toast.success(`Credenciales de ${API_CONFIGS.find(c => c.platform === platform)?.name} eliminadas`)
      
      // Limpiar del estado local
      setCredentials(prev => {
        const newCreds = { ...prev }
        delete newCreds[platform]
        return newCreds
      })
      
      setTestResults(prev => {
        const newResults = { ...prev }
        delete newResults[platform]
        return newResults
      })
      
      // Recargar estado de APIs configuradas
      await loadConfiguredAPIs(activeClient.id)
    } catch (error) {
      console.error('Error eliminando credenciales:', error)
      toast.error('Error eliminando credenciales')
    }
  }

  if (!activeClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Selecciona un cliente para configurar las APIs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configuración de APIs</h2>
            <p className="text-sm text-gray-500">Cliente: {activeClient.name}</p>
          </div>
        </div>

        <div className="space-y-8">
          {API_CONFIGS.map((config) => {
            const isConfigured = configuredAPIs[config.platform]
            const platformCreds = credentials[config.platform] || {}
            const hasAllRequiredFields = config.fields.filter(f => f.required).every(f => platformCreds[f.key])
            const testResult = testResults[config.platform]

            return (
              <div key={config.platform} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <span>{config.name}</span>
                        {isConfigured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Configurado
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  
                  <a
                    href={config.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <span>Documentación</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {config.fields.map((field) => {
                    const fieldKey = `${config.platform}_${field.key}`
                    const isPassword = field.type === 'password'
                    const showPassword = showPasswords[fieldKey]

                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="relative">
                          <input
                            type={isPassword && !showPassword ? 'password' : 'text'}
                            value={platformCreds[field.key] || ''}
                            onChange={(e) => handleInputChange(config.platform, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {isPassword && (
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(fieldKey)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Test result */}
                {testResult && (
                  <div className={`mb-4 p-3 rounded-md ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center space-x-2">
                      {testResult.success ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        {testResult.message}
                      </span>
                    </div>
                    {testResult.details && Object.keys(testResult.details).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => testCredentials(config.platform)}
                    disabled={!hasAllRequiredFields || testing[config.platform]}
                    variant="outline"
                    size="sm"
                  >
                    {testing[config.platform] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    <span className="ml-2">Probar</span>
                  </Button>
                  
                  <Button
                    onClick={() => saveCredentials(config.platform)}
                    disabled={!hasAllRequiredFields || saving[config.platform]}
                    size="sm"
                  >
                    {saving[config.platform] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="ml-2">Guardar</span>
                  </Button>
                  
                  {isConfigured && (
                    <Button
                      onClick={() => deleteCredentials(config.platform)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-2">Eliminar</span>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}