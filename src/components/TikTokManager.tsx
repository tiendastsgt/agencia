import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TikTokBusinessService, TikTokAdAccount, TikTokCampaign, TikTokAdGroup, TikTokAd, TikTokVideo, TikTokAnalytics } from '@/lib/tiktok-api'
import { useActiveClient } from '@/lib/client-context'
import { formatNumber, getDateDaysAgo, formatCurrency, formatPercentage } from '../utils/formatters'
import { BADGE_COLORS } from '../lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Music, 
  Users, 
  Eye, 
  MousePointer,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Play,
  Target,
  Video,
  Image,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface TikTokManagerProps {
  className?: string
}

export default function TikTokManager({ className }: TikTokManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [tiktokService, setTiktokService] = useState<TikTokBusinessService | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: getDateDaysAgo(30), // 30 días atrás
    endDate: new Date().toISOString().split('T')[0] // Hoy
  })

  // Inicializar servicio de TikTok Business
  useEffect(() => {
    const initTikTokService = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const accessToken = 'your_tiktok_access_token'
        const advertiserId = 'your_tiktok_advertiser_id'
        
        if (accessToken && advertiserId) {
          const service = new TikTokBusinessService(accessToken, advertiserId)
          setTiktokService(service)
        }
      } catch (error) {
        console.error('Error inicializando TikTok Business service:', error)
      }
    }

    initTikTokService()
  }, [activeClient])

  // Query para obtener información de la cuenta
  const { data: accountInfo, isLoading: accountLoading } = useQuery({
    queryKey: ['tiktok-account-info'],
    queryFn: async () => {
      if (!tiktokService) throw new Error('Servicio no disponible')
      return await tiktokService.getAdAccount()
    },
    enabled: !!tiktokService,
    retry: false
  })

  // Query para obtener campañas
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['tiktok-campaigns'],
    queryFn: async () => {
      if (!tiktokService) throw new Error('Servicio no disponible')
      return await tiktokService.getCampaigns(1, 20)
    },
    enabled: !!tiktokService,
    retry: false
  })

  // Query para obtener videos
  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ['tiktok-videos'],
    queryFn: async () => {
      if (!tiktokService) throw new Error('Servicio no disponible')
      return await tiktokService.getVideos(1, 20)
    },
    enabled: !!tiktokService,
    retry: false
  })

  // Query para obtener analíticas de campañas
  const { data: campaignAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['tiktok-campaign-analytics', dateRange],
    queryFn: async () => {
      if (!tiktokService) throw new Error('Servicio no disponible')
      return await tiktokService.getCampaignAnalytics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!tiktokService,
    retry: false
  })

  // Query para obtener analíticas de anuncios
  const { data: adAnalytics, isLoading: adAnalyticsLoading } = useQuery({
    queryKey: ['tiktok-ad-analytics', dateRange],
    queryFn: async () => {
      if (!tiktokService) throw new Error('Servicio no disponible')
      return await tiktokService.getAdAnalytics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!tiktokService,
    retry: false
  })

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tiktok-'] })
    toast.success('Datos actualizados')
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENABLE':
      case 'ACTIVE':
        return BADGE_COLORS.SUCCESS
      case 'DISABLE':
      case 'INACTIVE':
        return BADGE_COLORS.WARNING
      case 'DELETE':
        return BADGE_COLORS.ERROR
      case 'AUDIT':
        return BADGE_COLORS.INFO
      case 'AUDIT_DENIED':
        return BADGE_COLORS.ERROR
      default:
        return BADGE_COLORS.SECONDARY
    }
  }

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'TRAFFIC':
        return <MousePointer className="h-4 w-4" />
      case 'CONVERSIONS':
        return <Target className="h-4 w-4" />
      case 'APP_INSTALL':
        return <Play className="h-4 w-4" />
      case 'REACH':
        return <Users className="h-4 w-4" />
      case 'VIDEO_VIEWS':
        return <Video className="h-4 w-4" />
      case 'LEAD_GENERATION':
        return <Users className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar TikTok Business
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
          <Music className="h-8 w-8 text-black" />
          <div>
            <h2 className="text-2xl font-bold">TikTok Business</h2>
            <p className="text-muted-foreground">
              Gestión de campañas y analíticas de TikTok para {activeClient.name}
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

      {!tiktokService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de TikTok Business no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="campaigns">Campañas</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="create">Crear</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            {/* Información de la cuenta */}
            {accountInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Información de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold">{accountInfo.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {accountInfo.advertiser_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Moneda</p>
                      <p className="font-medium">{accountInfo.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zona horaria</p>
                      <p className="font-medium">{accountInfo.timezone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Métricas principales */}
            {analyticsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : campaignAnalytics && campaignAnalytics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {formatNumber(campaignAnalytics.reduce((sum, item) => sum + item.impressions, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Impresiones</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MousePointer className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {formatNumber(campaignAnalytics.reduce((sum, item) => sum + item.clicks, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Clics</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {formatCurrency(campaignAnalytics.reduce((sum, item) => sum + item.cost, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Costo total</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Play className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                      <div className="text-2xl font-bold">
                        {formatNumber(campaignAnalytics.reduce((sum, item) => sum + item.video_views, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Vistas de video</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          {/* Tab: Campañas */}
          <TabsContent value="campaigns" className="space-y-4">
            {campaignsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : campaignsData && campaignsData.campaigns.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Campañas</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Campaña
                  </Button>
                </div>
                <div className="grid gap-4">
                  {campaignsData.campaigns.map((campaign) => (
                    <Card key={campaign.campaign_id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getObjectiveIcon(campaign.objective)}
                            <div>
                              <div className="font-semibold">{campaign.campaign_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {campaign.objective} • {formatCurrency(campaign.budget)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
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
                    <p className="text-muted-foreground">No hay campañas disponibles</p>
                    <Button className="mt-2" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera campaña
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Videos */}
          <TabsContent value="videos" className="space-y-4">
            {videosLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : videosData && videosData.videos.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Videos</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Video
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {videosData.videos.map((video) => (
                    <Card key={video.video_id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="relative">
                            <img
                              src={video.cover_image_url}
                              alt={video.video_name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                              {Math.floor(video.duration)}s
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold line-clamp-2">{video.video_name}</h4>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <span>{video.width}x{video.height}</span>
                              <span>{formatNumber(video.file_size)} bytes</span>
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
                    <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay videos disponibles</p>
                    <Button className="mt-2" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Subir primer video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Analíticas */}
          <TabsContent value="analytics" className="space-y-4">
            {analyticsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : campaignAnalytics && campaignAnalytics.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analíticas de Campañas</h3>
                <div className="grid gap-4">
                  {campaignAnalytics.slice(0, 10).map((analytics, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Fecha</div>
                            <div className="font-medium">{formatDate(analytics.date)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Impresiones</div>
                            <div className="font-medium">{formatNumber(analytics.impressions)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Clics</div>
                            <div className="font-medium">{formatNumber(analytics.clicks)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Costo</div>
                            <div className="font-medium">{formatCurrency(analytics.cost)}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-muted-foreground">CTR</div>
                            <div className="font-medium">{formatPercentage(analytics.ctr)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">CPM</div>
                            <div className="font-medium">{formatCurrency(analytics.cpm)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">CPC</div>
                            <div className="font-medium">{formatCurrency(analytics.cpc)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">ROAS</div>
                            <div className="font-medium">{analytics.roas.toFixed(2)}</div>
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
                    <p className="text-muted-foreground">No hay datos de analíticas disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Crear */}
          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Nueva Campaña
                  </CardTitle>
                  <CardDescription>
                    Crea una nueva campaña publicitaria en TikTok
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Nombre de la campaña" />
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Selecciona objetivo</option>
                    <option value="TRAFFIC">Tráfico</option>
                    <option value="CONVERSIONS">Conversiones</option>
                    <option value="APP_INSTALL">Instalación de app</option>
                    <option value="REACH">Alcance</option>
                    <option value="VIDEO_VIEWS">Vistas de video</option>
                    <option value="LEAD_GENERATION">Generación de leads</option>
                  </select>
                  <Input placeholder="Presupuesto" type="number" />
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Campaña
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Subir Video
                  </CardTitle>
                  <CardDescription>
                    Sube un nuevo video para usar en tus anuncios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Video className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Arrastra y suelta tu video aquí</p>
                    <p className="text-xs text-gray-500">MP4, MOV, MPEG, 3GP, AVI hasta 500MB</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Seleccionar Archivo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
