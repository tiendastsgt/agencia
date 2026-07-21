import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GoogleAnalytics4Service, GA4Property } from '@/lib/google-analytics-api'
import { useActiveClient } from '@/lib/client-context'
import { formatNumber, getDateDaysAgo, formatPercentage } from '../utils/formatters'
import { TRAFFIC_CHANNEL_COLORS, DEVICE_COLORS } from '../lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface GoogleAnalyticsManagerProps {
  className?: string
}

export default function GoogleAnalyticsManager({ className }: GoogleAnalyticsManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [ga4Service, setGa4Service] = useState<GoogleAnalytics4Service | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: getDateDaysAgo(30), // 30 días atrás
    endDate: new Date().toISOString().split('T')[0] // Hoy
  })

  // Inicializar servicio de Google Analytics 4
  useEffect(() => {
    const initGA4Service = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const accessToken = 'your_ga4_access_token'
        const propertyId = 'your_ga4_property_id'
        
        if (accessToken && propertyId) {
          const service = new GoogleAnalytics4Service(accessToken, propertyId)
          setGa4Service(service)
        }
      } catch (error) {
        console.error('Error inicializando Google Analytics 4 service:', error)
      }
    }

    initGA4Service()
  }, [activeClient])

  // Query para obtener información de la propiedad
  const { data: propertyInfo, isLoading: propertyLoading } = useQuery({
    queryKey: ['ga4-property-info'],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getProperty()
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener métricas básicas
  const { data: basicMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['ga4-basic-metrics', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getBasicMetrics(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener tráfico por canal
  const { data: trafficByChannel, isLoading: channelLoading } = useQuery({
    queryKey: ['ga4-traffic-by-channel', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getTrafficByChannel(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener métricas de dispositivos
  const { data: deviceMetrics, isLoading: deviceLoading } = useQuery({
    queryKey: ['ga4-device-metrics', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getDeviceMetrics(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener métricas de ubicación
  const { data: locationMetrics, isLoading: locationLoading } = useQuery({
    queryKey: ['ga4-location-metrics', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getLocationMetrics(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener páginas más visitadas
  const { data: topPages, isLoading: pagesLoading } = useQuery({
    queryKey: ['ga4-top-pages', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getTopPages(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  // Query para obtener eventos personalizados
  const { data: customEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['ga4-custom-events', dateRange],
    queryFn: async () => {
      if (!ga4Service) throw new Error('Servicio no disponible')
      return await ga4Service.getCustomEvents(dateRange)
    },
    enabled: !!ga4Service,
    retry: false
  })

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['ga4-'] })
    toast.success('Datos actualizados')
  }



  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    return TRAFFIC_CHANNEL_COLORS[channel as keyof typeof TRAFFIC_CHANNEL_COLORS] || 'bg-gray-100 text-gray-800'
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar Google Analytics 4
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Google Analytics 4</h2>
            <p className="text-muted-foreground">
              Analíticas web avanzadas para {activeClient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm"
          />
          <span className="text-muted-foreground">a</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm"
          />
          <Button onClick={handleRefresh} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!ga4Service ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de Google Analytics 4 no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="traffic">Tráfico</TabsTrigger>
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            {/* Información de la propiedad */}
            {propertyInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Propiedad de Google Analytics 4
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold">{propertyInfo.displayName}</h4>
                      <p className="text-sm text-muted-foreground">ID: {propertyInfo.propertyId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zona horaria</p>
                      <p className="font-medium">{propertyInfo.timeZone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Moneda</p>
                      <p className="font-medium">{propertyInfo.currencyCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Métricas básicas */}
            {metricsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : basicMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(basicMetrics.users)}</div>
                      <div className="text-sm text-muted-foreground">Usuarios</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(basicMetrics.sessions)}</div>
                      <div className="text-sm text-muted-foreground">Sesiones</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MousePointer className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(basicMetrics.pageViews)}</div>
                      <div className="text-sm text-muted-foreground">Vistas de página</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                      <div className="text-2xl font-bold">{formatDuration(basicMetrics.averageSessionDuration)}</div>
                      <div className="text-sm text-muted-foreground">Duración promedio</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {/* Métricas adicionales */}
            {basicMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(basicMetrics.newUsers)}</div>
                      <div className="text-sm text-muted-foreground">Usuarios nuevos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingDown className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(basicMetrics.returningUsers)}</div>
                      <div className="text-sm text-muted-foreground">Usuarios recurrentes</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold">{formatPercentage(basicMetrics.bounceRate)}</div>
                      <div className="text-sm text-muted-foreground">Tasa de rebote</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tab: Tráfico */}
          <TabsContent value="traffic" className="space-y-4">
            {channelLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : trafficByChannel && trafficByChannel.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tráfico por Canal</h3>
                <div className="grid gap-4">
                  {trafficByChannel.map((channel, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getChannelColor(channel.channel)}>
                              {channel.channel}
                            </Badge>
                            <div>
                              <div className="font-semibold">{formatNumber(channel.sessions)} sesiones</div>
                              <div className="text-sm text-muted-foreground">
                                {formatNumber(channel.users)} usuarios • {formatPercentage(channel.bounceRate)} rebote
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Duración promedio</div>
                            <div className="font-medium">{formatDuration(channel.averageSessionDuration)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de tráfico disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Dispositivos */}
          <TabsContent value="devices" className="space-y-4">
            {deviceLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : deviceMetrics && deviceMetrics.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tráfico por Dispositivo</h3>
                <div className="grid gap-4">
                  {deviceMetrics.map((device, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(device.device)}
                            <div>
                              <div className="font-semibold">{device.device}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatNumber(device.sessions)} sesiones • {formatNumber(device.users)} usuarios
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Tasa de rebote</div>
                            <div className="font-medium">{formatPercentage(device.bounceRate)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de dispositivos disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Contenido */}
          <TabsContent value="content" className="space-y-4">
            {pagesLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : topPages && topPages.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Páginas Más Visitadas</h3>
                <div className="grid gap-4">
                  {topPages.map((page, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="font-semibold truncate">{page.page}</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Vistas</div>
                              <div className="font-medium">{formatNumber(page.pageViews)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Vistas únicas</div>
                              <div className="font-medium">{formatNumber(page.uniquePageViews)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Tiempo promedio</div>
                              <div className="font-medium">{formatDuration(page.averageTimeOnPage)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Tasa de rebote</div>
                              <div className="font-medium">{formatPercentage(page.bounceRate)}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de contenido disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Eventos */}
          <TabsContent value="events" className="space-y-4">
            {eventsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : customEvents && customEvents.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Eventos Personalizados</h3>
                <div className="grid gap-4">
                  {customEvents.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{event.eventName}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatNumber(event.totalUsers)} usuarios únicos
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{formatNumber(event.eventCount)}</div>
                            <div className="text-sm text-muted-foreground">eventos</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay eventos personalizados disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
