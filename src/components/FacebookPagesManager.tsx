import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { facebookAPIService, FacebookPage, FacebookInsights } from '@/lib/facebook-api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Facebook, Users, Eye, Heart, MessageCircle, Share, TrendingUp, RefreshCw, ExternalLink, Settings } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export default function FacebookPagesManager() {
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null)
  const [pageInsights, setPageInsights] = useState<FacebookInsights[]>([])
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const configured = await facebookAPIService.isConfigured()
      setIsConfigured(configured)
      if (configured) {
        await loadPages()
      }
    } catch (error) {
      console.error('Error checking Facebook configuration:', error)
    }
  }

  const loadPages = async () => {
    try {
      setIsLoading(true)
      const result = await facebookAPIService.getPages()
      
      if (result.success) {
        setPages(result.pages || [])
      } else {
        throw new Error(result.error || 'Error al cargar páginas de Facebook')
      }
    } catch (error) {
      console.error('Error loading Facebook pages:', error)
      toast.error('Error al cargar páginas: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const loadPageInsights = async (pageId: string) => {
    try {
      setIsInsightsLoading(true)
      const result = await facebookAPIService.getPageInsights(pageId)
      
      if (result.success) {
        setPageInsights(result.insights || [])
      } else {
        throw new Error(result.error || 'Error al cargar insights')
      }
    } catch (error) {
      console.error('Error loading page insights:', error)
      toast.error('Error al cargar métricas: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsInsightsLoading(false)
    }
  }

  const handlePageSelect = (page: FacebookPage) => {
    setSelectedPage(page)
    loadPageInsights(page.id)
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

  // Procesar datos para gráficos
  const processInsightsData = () => {
    if (!pageInsights.length) return []

    const insightsMap = new Map()
    
    pageInsights.forEach(insight => {
      insight.values.forEach(value => {
        const date = formatDate(value.end_time)
        if (!insightsMap.has(date)) {
          insightsMap.set(date, { date })
        }
        
        const currentData = insightsMap.get(date)
        if (typeof value.value === 'number') {
          currentData[insight.metric] = value.value
        } else if (typeof value.value === 'object') {
          // Para métricas complejas, tomar el total si existe
          currentData[insight.metric] = value.value.total || Object.values(value.value)[0] || 0
        }
      })
    })

    return Array.from(insightsMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const insightsData = processInsightsData()

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            Facebook Pages
          </CardTitle>
          <CardDescription>
            Conecta tu cuenta de Facebook para gestionar páginas y ver métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Facebook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Facebook no está configurado. Ve a Credenciales para configurar tu cuenta.
            </p>
            <Button onClick={() => window.open('/credentials', '_blank')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar Facebook
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
            <Facebook className="h-6 w-6 text-blue-600" />
            Facebook Pages
          </h2>
          <p className="text-gray-600">Gestiona tus páginas de Facebook y visualiza métricas</p>
        </div>
        <Button onClick={loadPages} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Lista de páginas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card 
              key={page.id} 
              className={`cursor-pointer transition-colors ${
                selectedPage?.id === page.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePageSelect(page)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {page.tasks.includes('ANALYZE') ? 'Analizar' : 'Básico'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-xs">{page.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Permisos:</span>
                    <span className="text-xs">{page.tasks.join(', ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Facebook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No se encontraron páginas de Facebook</p>
          </CardContent>
        </Card>
      )}

      {/* Métricas de la página seleccionada */}
      {selectedPage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Métricas de {selectedPage.name}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadPageInsights(selectedPage.id)}
                disabled={isInsightsLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isInsightsLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </CardTitle>
            <CardDescription>
              Métricas de los últimos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isInsightsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : insightsData.length > 0 ? (
              <div className="space-y-6">
                {/* Gráfico de impresiones */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Impresiones
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={insightsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(Number(value))} />
                      <Line 
                        type="monotone" 
                        dataKey="page_impressions" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Impresiones"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="page_impressions_unique" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Impresiones Únicas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de engagement */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Engagement
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={insightsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(Number(value))} />
                      <Bar dataKey="page_engaged_users" fill="#f59e0b" name="Usuarios Engagados" />
                      <Bar dataKey="page_post_engagements" fill="#ef4444" name="Engagement Posts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Resumen de métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pageInsights.map((insight) => {
                    const latestValue = insight.values[insight.values.length - 1]
                    const value = typeof latestValue.value === 'number' 
                      ? latestValue.value 
                      : typeof latestValue.value === 'object' 
                        ? latestValue.value.total || Object.values(latestValue.value)[0] || 0
                        : 0

                    return (
                      <div key={insight.metric} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          {insight.title}
                        </div>
                        <div className="text-2xl font-bold">
                          {formatNumber(value)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No hay métricas disponibles para esta página</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
