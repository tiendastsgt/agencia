import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { youtubeAPIService, YouTubeChannel, YouTubeVideo, YouTubeAnalytics, YouTubePlaylist } from '@/lib/youtube-api'
import { formatNumber, formatDuration, getDateDaysAgo } from '../utils/formatters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Youtube, Users, Eye, Clock, ThumbsUp, MessageCircle, Share, TrendingUp, RefreshCw, Search, Play, Calendar, DollarSign, BarChart3 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export default function YouTubeManager() {
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([])
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [videoAnalytics, setVideoAnalytics] = useState<YouTubeAnalytics | null>(null)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dateRange, setDateRange] = useState('last_7d')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dateRanges = [
    { value: 'last_7d', label: 'Últimos 7 días' },
    { value: 'last_30d', label: 'Últimos 30 días' },
    { value: 'last_90d', label: 'Últimos 90 días' },
    { value: 'this_year', label: 'Este año' }
  ]

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const configured = await youtubeAPIService.isConfigured()
      setIsConfigured(configured)
      if (configured) {
        await loadChannelData()
      }
    } catch (error) {
      console.error('Error checking YouTube configuration:', error)
    }
  }

  const loadChannelData = async () => {
    try {
      setIsLoading(true)
      
      // Cargar información del canal
      const channelResult = await youtubeAPIService.getMyChannel()
      if (channelResult.success && channelResult.channel) {
        setChannel(channelResult.channel)
        
        // Cargar videos del canal
        const videosResult = await youtubeAPIService.getChannelVideos(channelResult.channel.id, 10)
        if (videosResult.success && videosResult.videos) {
          setVideos(videosResult.videos)
        }

        // Cargar listas de reproducción
        const playlistsResult = await youtubeAPIService.getChannelPlaylists(channelResult.channel.id, 10)
        if (playlistsResult.success && playlistsResult.playlists) {
          setPlaylists(playlistsResult.playlists)
        }

        // Cargar analytics del canal
        await loadChannelAnalytics(channelResult.channel.id)
      }

    } catch (error) {
      console.error('Error loading YouTube data:', error)
      toast.error('Error al cargar datos de YouTube: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const loadChannelAnalytics = async (channelId: string) => {
    try {
      const endDate = new Date().toISOString().split('T')[0]
      let startDate = ''
      
      switch (dateRange) {
        case 'last_7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        case 'last_30d':
          startDate = getDateDaysAgo(30)
          break
        case 'last_90d':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        case 'this_year':
          startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
          break
      }

      const result = await youtubeAPIService.getChannelAnalytics(channelId, startDate, endDate)
      if (result.success && result.analytics) {
        setAnalytics(result.analytics)
      }
    } catch (error) {
      console.error('Error loading channel analytics:', error)
    }
  }

  const handleSearchVideos = async () => {
    if (!searchQuery.trim()) {
      toast.error('Ingresa un término de búsqueda')
      return
    }

    setIsSearching(true)
    try {
      const result = await youtubeAPIService.searchVideos(searchQuery.trim(), 20)
      
      if (result.success && result.videos) {
        setSearchResults(result.videos)
        toast.success(`Se encontraron ${result.videos.length} videos`)
      } else {
        throw new Error(result.error || 'Error en la búsqueda')
      }
    } catch (error) {
      console.error('Error searching videos:', error)
      toast.error('Error en la búsqueda: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewVideoAnalytics = async (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsAnalyticsLoading(true)
    
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = getDateDaysAgo(30)

      const result = await youtubeAPIService.getVideoAnalytics(video.id, startDate, endDate)
      
      if (result.success && result.analytics) {
        setVideoAnalytics(result.analytics)
      } else {
        throw new Error(result.error || 'Error al cargar analytics')
      }
    } catch (error) {
      console.error('Error loading video analytics:', error)
      toast.error('Error al cargar métricas: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsAnalyticsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return '0:00'
    
    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Analytics
          </CardTitle>
          <CardDescription>
            Conecta tu cuenta de YouTube para ver analytics y gestionar tu canal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              YouTube no está configurado. Ve a Credenciales para configurar tu cuenta.
            </p>
            <Button onClick={() => window.open('/credentials', '_blank')}>
              Configurar YouTube
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            YouTube Analytics
          </h2>
          <p className="text-gray-600">Gestiona tu canal de YouTube y visualiza métricas</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={(value) => {
            setDateRange(value)
            if (channel) {
              loadChannelAnalytics(channel.id)
            }
          }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadChannelData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : channel ? (
        <>
          {/* Información del canal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img 
                  src={channel.thumbnails.medium.url} 
                  alt={channel.title}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold">{channel.title}</h3>
                  <p className="text-gray-600">{channel.customUrl || channel.id}</p>
                </div>
              </CardTitle>
              <CardDescription>
                {channel.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(parseInt(channel.statistics.subscriberCount))}</div>
                  <div className="text-sm text-gray-600">Suscriptores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(parseInt(channel.statistics.viewCount))}</div>
                  <div className="text-sm text-gray-600">Visualizaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(parseInt(channel.statistics.videoCount))}</div>
                  <div className="text-sm text-gray-600">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatDate(channel.publishedAt)}</div>
                  <div className="text-sm text-gray-600">Creado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics del canal */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics del Canal ({dateRanges.find(r => r.value === dateRange)?.label})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(analytics.views)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      Visualizaciones
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatSeconds(analytics.estimatedMinutesWatched * 60)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      Tiempo Visto
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatSeconds(analytics.averageViewDuration)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Duración Promedio
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {analytics.averageViewPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      % Visto Promedio
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold">
                      {formatNumber(analytics.subscribersGained)}
                    </div>
                    <div className="text-sm text-gray-600">Suscriptores Ganados</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold">
                      {formatNumber(analytics.likes)}
                    </div>
                    <div className="text-sm text-gray-600">Me Gusta</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold">
                      {formatNumber(analytics.comments)}
                    </div>
                    <div className="text-sm text-gray-600">Comentarios</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Búsqueda de videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar videos en YouTube..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchVideos()}
                />
                <Button onClick={handleSearchVideos} disabled={isSearching}>
                  {isSearching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium">Resultados de búsqueda:</h4>
                  {searchResults.map((video) => (
                    <div key={video.id} className="border rounded-lg p-3">
                      <div className="flex gap-3">
                        <img 
                          src={video.thumbnails.medium.url} 
                          alt={video.title}
                          className="w-24 h-18 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 mb-1">{video.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{video.snippet.channelTitle}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatDate(video.publishedAt)}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {formatNumber(parseInt(video.statistics.viewCount))}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {formatNumber(parseInt(video.statistics.likeCount))}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(video.contentDetails.duration)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Videos del canal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Videos Recientes
              </CardTitle>
              <CardDescription>
                Tus videos más recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length > 0 ? (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex gap-3">
                        <img 
                          src={video.thumbnails.medium.url} 
                          alt={video.title}
                          className="w-32 h-24 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 mb-2">{video.title}</h5>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{formatDate(video.publishedAt)}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {formatNumber(parseInt(video.statistics.viewCount))}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {formatNumber(parseInt(video.statistics.likeCount))}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {formatNumber(parseInt(video.statistics.commentCount))}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(video.contentDetails.duration)}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewVideoAnalytics(video)}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Ver Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No hay videos disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Listas de reproducción */}
          {playlists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Listas de Reproducción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="border rounded-lg p-4">
                      <div className="flex gap-3">
                        <img 
                          src={playlist.thumbnails.medium.url} 
                          alt={playlist.title}
                          className="w-16 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 mb-1">{playlist.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{playlist.contentDetails.itemCount} videos</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {formatNumber(parseInt(playlist.statistics.viewCount))}
                            </div>
                            <span>{formatDate(playlist.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics del video seleccionado */}
          {selectedVideo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analytics del Video</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewVideoAnalytics(selectedVideo)}
                    disabled={isAnalyticsLoading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyticsLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                  </Button>
                </CardTitle>
                <CardDescription>
                  {selectedVideo.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyticsLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : videoAnalytics ? (
                  <div className="space-y-6">
                    {/* Métricas principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(videoAnalytics.views)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          Visualizaciones
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatSeconds(videoAnalytics.estimatedMinutesWatched * 60)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4" />
                          Tiempo Visto
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatSeconds(videoAnalytics.averageViewDuration)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Duración Promedio
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {videoAnalytics.averageViewPercentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          % Visto Promedio
                        </div>
                      </div>
                    </div>

                    {/* Métricas de engagement */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-bold">
                          {formatNumber(videoAnalytics.likes)}
                        </div>
                        <div className="text-sm text-gray-600">Me Gusta</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-bold">
                          {formatNumber(videoAnalytics.comments)}
                        </div>
                        <div className="text-sm text-gray-600">Comentarios</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-lg font-bold">
                          {formatNumber(videoAnalytics.shares)}
                        </div>
                        <div className="text-sm text-gray-600">Compartidos</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No hay métricas disponibles para este video</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No se pudo cargar la información del canal</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
