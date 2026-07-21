import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { instagramAPIService, InstagramAccount, InstagramMedia, InstagramInsights } from '@/lib/instagram-api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Instagram, Users, Eye, Heart, MessageCircle, Share, TrendingUp, RefreshCw, ExternalLink, Settings, Camera, Calendar } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export default function InstagramManager() {
  const [account, setAccount] = useState<InstagramAccount | null>(null)
  const [media, setMedia] = useState<InstagramMedia[]>([])
  const [accountInsights, setAccountInsights] = useState<InstagramInsights[]>([])
  const [selectedMedia, setSelectedMedia] = useState<InstagramMedia | null>(null)
  const [mediaInsights, setMediaInsights] = useState<InstagramInsights[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const configured = await instagramAPIService.isConfigured()
      setIsConfigured(configured)
      if (configured) {
        await loadAccountData()
      }
    } catch (error) {
      console.error('Error checking Instagram configuration:', error)
    }
  }

  const loadAccountData = async () => {
    try {
      setIsLoading(true)
      
      // Cargar información de la cuenta
      const accountResult = await instagramAPIService.getAccountInfo()
      if (accountResult.success && accountResult.account) {
        setAccount(accountResult.account)
      }

      // Cargar medios
      const mediaResult = await instagramAPIService.getMedia(12)
      if (mediaResult.success && mediaResult.media) {
        setMedia(mediaResult.media)
      }

      // Cargar insights de la cuenta
      const insightsResult = await instagramAPIService.getAccountInsights()
      if (insightsResult.success && insightsResult.insights) {
        setAccountInsights(insightsResult.insights)
      }

    } catch (error) {
      console.error('Error loading Instagram data:', error)
      toast.error('Error al cargar datos de Instagram: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const loadMediaInsights = async (mediaId: string) => {
    try {
      setIsInsightsLoading(true)
      const result = await instagramAPIService.getMediaInsights(mediaId)
      
      if (result.success) {
        setMediaInsights(result.insights || [])
      } else {
        throw new Error(result.error || 'Error al cargar insights')
      }
    } catch (error) {
      console.error('Error loading media insights:', error)
      toast.error('Error al cargar métricas: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsInsightsLoading(false)
    }
  }

  const handleMediaSelect = (mediaItem: InstagramMedia) => {
    setSelectedMedia(mediaItem)
    loadMediaInsights(mediaItem.id)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT')
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'VIDEO':
        return '🎥'
      case 'CAROUSEL_ALBUM':
        return '📸'
      default:
        return '📷'
    }
  }

  // Procesar datos para gráficos de insights de cuenta
  const processAccountInsightsData = () => {
    if (!accountInsights.length) return []

    const insightsMap = new Map()
    
    accountInsights.forEach(insight => {
      insight.values.forEach(value => {
        const date = formatDate(value.end_time)
        if (!insightsMap.has(date)) {
          insightsMap.set(date, { date })
        }
        
        const currentData = insightsMap.get(date)
        if (typeof value.value === 'number') {
          currentData[insight.name] = value.value
        } else if (typeof value.value === 'object') {
          currentData[insight.name] = value.value.total || Object.values(value.value)[0] || 0
        }
      })
    })

    return Array.from(insightsMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const accountInsightsData = processAccountInsightsData()

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            Instagram
          </CardTitle>
          <CardDescription>
            Conecta tu cuenta de Instagram para gestionar contenido y ver métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Instagram className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Instagram no está configurado. Ve a Credenciales para configurar tu cuenta.
            </p>
            <Button onClick={() => window.open('/credentials', '_blank')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar Instagram
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
            <Instagram className="h-6 w-6 text-pink-600" />
            Instagram
          </h2>
          <p className="text-gray-600">Gestiona tu cuenta de Instagram y visualiza métricas</p>
        </div>
        <Button onClick={loadAccountData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
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
      ) : account ? (
        <>
          {/* Información de la cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img 
                  src={account.profile_picture_url} 
                  alt={account.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold">@{account.username}</h3>
                  <p className="text-gray-600">{account.name}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {account.account_type}
                </Badge>
              </CardTitle>
              <CardDescription>
                {account.biography}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(account.followers_count)}</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(account.follows_count)}</div>
                  <div className="text-sm text-gray-600">Siguiendo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(account.media_count)}</div>
                  <div className="text-sm text-gray-600">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {account.website ? '🌐' : '❌'}
                  </div>
                  <div className="text-sm text-gray-600">Sitio Web</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights de la cuenta */}
          {accountInsightsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Métricas de la Cuenta
                </CardTitle>
                <CardDescription>
                  Métricas de los últimos 7 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Gráfico de alcance e impresiones */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Alcance e Impresiones
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={accountInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatNumber(Number(value))} />
                        <Line 
                          type="monotone" 
                          dataKey="reach" 
                          stroke="#e91e63" 
                          strokeWidth={2}
                          name="Alcance"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="impressions" 
                          stroke="#9c27b0" 
                          strokeWidth={2}
                          name="Impresiones"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de interacciones */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interacciones
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={accountInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatNumber(Number(value))} />
                        <Bar dataKey="profile_views" fill="#e91e63" name="Visitas al Perfil" />
                        <Bar dataKey="website_clicks" fill="#9c27b0" name="Clics al Sitio Web" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grid de medios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Publicaciones Recientes
              </CardTitle>
              <CardDescription>
                Haz clic en una publicación para ver sus métricas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((mediaItem) => (
                    <div 
                      key={mediaItem.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                        selectedMedia?.id === mediaItem.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                      onClick={() => handleMediaSelect(mediaItem)}
                    >
                      <img 
                        src={mediaItem.media_url} 
                        alt={mediaItem.caption || 'Instagram post'}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {getMediaTypeIcon(mediaItem.media_type)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <div className="text-white text-xs flex items-center gap-2">
                          <Heart className="h-3 w-3" />
                          {formatNumber(mediaItem.like_count)}
                          <MessageCircle className="h-3 w-3" />
                          {formatNumber(mediaItem.comments_count)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No hay publicaciones disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métricas de publicación seleccionada */}
          {selectedMedia && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Métricas de la Publicación</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadMediaInsights(selectedMedia.id)}
                    disabled={isInsightsLoading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isInsightsLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                  </Button>
                </CardTitle>
                <CardDescription>
                  {selectedMedia.caption?.substring(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isInsightsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : mediaInsights.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaInsights.map((insight) => {
                      const value = typeof insight.values[0]?.value === 'number' 
                        ? insight.values[0].value 
                        : typeof insight.values[0]?.value === 'object' 
                          ? insight.values[0].value.total || Object.values(insight.values[0].value)[0] || 0
                          : 0

                      return (
                        <div key={insight.name} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-pink-600">
                            {formatNumber(value)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {insight.name.replace(/_/g, ' ')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No hay métricas disponibles para esta publicación</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Instagram className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No se pudo cargar la información de la cuenta</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
