import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { contentGenerationAPIs } from '@/lib/content-generation-apis'
import { toast } from '@/components/ui/sonner'
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap, DollarSign, Clock } from 'lucide-react'

interface APIStatus {
  name: string
  configured: boolean
  cost: number
  quality: string
  speed: string
  description: string
}

export default function APIStatusChecker() {
  const [apiStatus, setApiStatus] = useState<APIStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const apis: APIStatus[] = [
    {
      name: 'OpenAI DALL-E 3',
      configured: false,
      cost: 0.04,
      quality: 'Premium',
      speed: 'Medium',
      description: 'Generación de imágenes de alta calidad con prompts naturales'
    },
    {
      name: 'Stable Diffusion',
      configured: false,
      cost: 0.01,
      quality: 'High',
      speed: 'Fast',
      description: 'Generación rápida y económica con control técnico avanzado'
    },
    {
      name: 'Google Imagen',
      configured: false,
      quality: 'High',
      cost: 0.02,
      speed: 'Fast',
      description: 'Generación balanceada con integración nativa de Google'
    },
    {
      name: 'RunwayML Gen-4',
      configured: false,
      cost: 0.05,
      quality: 'Premium',
      speed: 'Slow',
      description: 'Generación de videos cinematográficos de alta calidad'
    },
    {
      name: 'Pika Labs',
      configured: false,
      cost: 0.08,
      quality: 'High',
      speed: 'Medium',
      description: 'Generación de videos dinámicos con múltiples modelos'
    },
    {
      name: 'Luma AI Dream Machine',
      configured: false,
      cost: 0.10,
      quality: 'High',
      speed: 'Fast',
      description: 'Generación de videos realistas con IA avanzada'
    }
  ]

  useEffect(() => {
    checkAPIStatus()
  }, [])

  const checkAPIStatus = async () => {
    setIsChecking(true)
    try {
      const status = await contentGenerationAPIs.checkAPIStatus()
      
      const updatedAPIs = apis.map(api => {
        let configured = false
        switch (api.name) {
          case 'OpenAI DALL-E 3':
            configured = status.openai
            break
          case 'Stable Diffusion':
            configured = status.stability
            break
          case 'Google Imagen':
            configured = status.google
            break
          case 'RunwayML Gen-4':
            configured = status.runway
            break
          case 'Pika Labs':
            configured = status.pika
            break
          case 'Luma AI Dream Machine':
            configured = status.luma
            break
        }
        
        return { ...api, configured }
      })
      
      setApiStatus(updatedAPIs)
      
      const configuredCount = updatedAPIs.filter(api => api.configured).length
      if (configuredCount === 0) {
        toast.warning('No hay APIs configuradas. Configura al menos una API para generar contenido.')
      } else {
        toast.success(`${configuredCount} APIs configuradas y listas para usar`)
      }
      
    } catch (error) {
      console.error('Error checking API status:', error)
      toast.error('Error verificando estado de las APIs')
    } finally {
      setIsChecking(false)
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'Fast': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Slow': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Estado de APIs de Generación
        </CardTitle>
        <CardDescription>
          Verifica el estado y configuración de las APIs de generación de contenido visual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {apiStatus.filter(api => api.configured).length} de {apiStatus.length} APIs configuradas
          </p>
          <Button
            onClick={checkAPIStatus}
            disabled={isChecking}
            size="sm"
            variant="outline"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {apiStatus.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {api.configured ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{api.name}</p>
                  <p className="text-sm text-muted-foreground">{api.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getQualityColor(api.quality)}>
                  {api.quality}
                </Badge>
                <Badge variant="outline" className={getSpeedColor(api.speed)}>
                  {api.speed}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${api.cost}
                </div>
              </div>
            </div>
          ))}
        </div>

        {apiStatus.filter(api => !api.configured).length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  APIs no configuradas
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Para usar el generador de contenido, configura al menos una API en tu archivo de configuración.
                </p>
                <div className="mt-2">
                  <p className="text-xs text-yellow-600">
                    APIs no configuradas: {apiStatus.filter(api => !api.configured).map(api => api.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Costos Estimados por Generación:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">🖼️ Imágenes</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>DALL-E 3:</span>
                  <span className="text-muted-foreground">$0.04/imagen</span>
                </div>
                <div className="flex justify-between">
                  <span>Stable Diffusion:</span>
                  <span className="text-muted-foreground">$0.01/imagen</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Imagen:</span>
                  <span className="text-muted-foreground">$0.02/imagen</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">🎬 Videos</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>RunwayML Gen-4:</span>
                  <span className="text-muted-foreground">$0.05/seg</span>
                </div>
                <div className="flex justify-between">
                  <span>Pika Labs:</span>
                  <span className="text-muted-foreground">$0.08/seg</span>
                </div>
                <div className="flex justify-between">
                  <span>Luma AI:</span>
                  <span className="text-muted-foreground">$0.10/seg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
