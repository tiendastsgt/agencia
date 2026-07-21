import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { YouTubeAnalyticsService, YouTubeChannel, YouTubeVideo, YouTubeAnalyticsMetrics } from '@/lib/youtube-analytics-api'
import { useActiveClient } from '@/lib/client-context'
import { formatNumber, getDateDaysAgo, formatCurrency, formatPercentage } from '../utils/formatters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Youtube, 
  Users, 
  Eye, 
  Clock,
  ThumbsUp,
  MessageSquare,
  Share2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Play,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Target,
  MousePointer,
  Heart
} from 'lucide-react'

interface YouTubeAnalyticsManagerProps {
  className?: string
}

export default function YouTubeAnalyticsManager({ className }: YouTubeAnalyticsManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [youtubeService, setYoutubeService] = useState<YouTubeAnalyticsService | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: getDateDaysAgo(30), // 30 días atrás
    endDate: new Date().toISOString().split('T')[0] // Hoy
  })

  // Inicializar servicio de YouTube Analytics
  useEffect(() => {
    const initYouTubeService = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const accessToken = 'your_youtube_access_token'
        const channelId = 'your_youtube_channel_id'
        
        if (accessToken && channelId) {
          const service = new YouTubeAnalyticsService(accessToken, channelId)
          setYoutubeService(service)
        }
      } catch (error) {
        console.error('Error inicializando YouTube Analytics service:', error)
      }
    }

    initYouTubeService()
  }, [activeClient])

  // Query para obtener información del canal
  const { data: channelInfo, isLoading: channelLoading } = useQuery({
    queryKey: ['youtube-channel-info'],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getChannelInfo()
    },
    enabled: !!youtubeService,
    retry: false
  })

  // Query para obtener videos del canal
  const { data: channelVideos, isLoading: videosLoading } = useQuery({
    queryKey: ['youtube-channel-videos'],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getChannelVideos(20)
    },
    enabled: !!youtubeService,
    retry: false
  })

  // Query para obtener métricas del canal
  const { data: channelMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['youtube-channel-metrics', dateRange],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getChannelMetrics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!youtubeService,
    retry: false
  })

  // Query para obtener métricas de ingresos
  const { data: revenueMetrics, isLoading: revenueLoading } = useQuery({
    queryKey: ['youtube-revenue-metrics', dateRange],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getRevenueMetrics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!youtubeService,
    retry: false
  })

  // Query para obtener métricas de anuncios
  const { data: adMetrics, isLoading: adLoading } = useQuery({
    queryKey: ['youtube-ad-metrics', dateRange],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getAdMetrics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!youtubeService,
    retry: false
  })

  // Query para obtener métricas de listas de reproducción
  const { data: playlistMetrics, isLoading: playlistLoading } = useQuery({
    queryKey: ['youtube-playlist-metrics', dateRange],
    queryFn: async () => {
      if (!youtubeService) throw new Error('Servicio no disponible')
      return await youtubeService.getPlaylistMetrics(dateRange.startDate, dateRange.endDate)
    },
    enabled: !!youtubeService,
    retry: false
  })

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['youtube-'] })
    toast.success('Datos actualizados')
  }




  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar YouTube Analytics
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
          <Youtube className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold">YouTube Analytics</h2>
            <p className="text-muted-foreground">
              Analíticas de canal y videos para {activeClient.name}
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

      {!youtubeService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de YouTube Analytics no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
            <TabsTrigger value="ads">Anuncios</TabsTrigger>
            <TabsTrigger value="playlists">Listas</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            {/* Información del canal */}
            {channelInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    Información del Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img
                      src={channelInfo.thumbnails.high.url}
                      alt={channelInfo.title}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{channelInfo.title}</h3>
                      <p className="text-sm text-muted-foreground">{channelInfo.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{formatNumber(parseInt(channelInfo.subscriberCount))} suscriptores</span>
                        <span>{formatNumber(parseInt(channelInfo.videoCount))} videos</span>
                        <span>{formatNumber(parseInt(channelInfo.viewCount))} vistas totales</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Métricas principales */}
            {metricsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : channelMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.views)}</div>
                      <div className="text-sm text-muted-foreground">Vistas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.estimatedMinutesWatched)}</div>
                      <div className="text-sm text-muted-foreground">Minutos vistos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Play className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatDuration(channelMetrics.averageViewDuration)}</div>
                      <div className="text-sm text-muted-foreground">Duración promedio</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.engagedViews)}</div>
                      <div className="text-sm text-muted-foreground">Vistas comprometidas</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {/* Métricas de engagement */}
            {channelMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <ThumbsUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.likes)}</div>
                      <div className="text-sm text-muted-foreground">Me gusta</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.comments)}</div>
                      <div className="text-sm text-muted-foreground">Comentarios</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Share2 className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.shares)}</div>
                      <div className="text-sm text-muted-foreground">Compartidos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(channelMetrics.subscribersGained)}</div>
                      <div className="text-sm text-muted-foreground">Suscriptores ganados</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
            ) : channelVideos && channelVideos.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Videos Recientes</h3>
                <div className="grid gap-4">
                  {channelVideos.map((video) => (
                    <Card key={video.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <img
                            src={video.thumbnails.medium.url}
                            alt={video.title}
                            className="w-24 h-18 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold line-clamp-2">{video.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{formatNumber(parseInt(video.viewCount))}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{formatNumber(parseInt(video.likeCount))}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{formatNumber(parseInt(video.commentCount))}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(video.publishedAt)}</span>
                              </div>
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
                    <Youtube className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay videos disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Ingresos */}
          <TabsContent value="revenue" className="space-y-4">
            {revenueLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : revenueMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.estimatedRevenue)}</div>
                      <div className="text-sm text-muted-foreground">Ingresos estimados</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.estimatedAdRevenue)}</div>
                      <div className="text-sm text-muted-foreground">Ingresos por anuncios</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.estimatedRedPartnerRevenue)}</div>
                      <div className="text-sm text-muted-foreground">YouTube Premium</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de ingresos disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Anuncios */}
          <TabsContent value="ads" className="space-y-4">
            {adLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : adMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(adMetrics.adImpressions)}</div>
                      <div className="text-sm text-muted-foreground">Impresiones de anuncios</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Play className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(adMetrics.monetizedPlaybacks)}</div>
                      <div className="text-sm text-muted-foreground">Reproducciones monetizadas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatCurrency(adMetrics.cpm)}</div>
                      <div className="text-sm text-muted-foreground">CPM</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de anuncios disponibles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Listas de reproducción */}
          <TabsContent value="playlists" className="space-y-4">
            {playlistLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : playlistMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(playlistMetrics.playlistViews)}</div>
                      <div className="text-sm text-muted-foreground">Vistas de listas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Play className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(playlistMetrics.playlistStarts)}</div>
                      <div className="text-sm text-muted-foreground">Inicios de lista</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(playlistMetrics.playlistSaves)}</div>
                      <div className="text-sm text-muted-foreground">Listas guardadas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatDuration(playlistMetrics.averageTimeInPlaylist * 60)}</div>
                      <div className="text-sm text-muted-foreground">Tiempo promedio</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Play className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay datos de listas de reproducción disponibles</p>
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
