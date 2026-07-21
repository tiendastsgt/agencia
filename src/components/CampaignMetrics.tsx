import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { campaignService, CampaignMetrics as CampaignMetricsType } from '@/lib/campaign-service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Eye, MousePointer, Target, DollarSign, RefreshCw, BarChart3 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface CampaignMetricsProps {
  campaignId: string
  campaignName: string
}

export default function CampaignMetrics({ campaignId, campaignName }: CampaignMetricsProps) {
  const [metrics, setMetrics] = useState<CampaignMetricsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadMetrics = async () => {
    try {
      setIsLoading(true)
      const result = await campaignService.getCampaignMetrics(campaignId)
      
      if (result.success) {
        setMetrics(result.metrics || null)
      } else {
        throw new Error(result.error || 'Error al cargar métricas')
      }
    } catch (error) {
      console.error('Error loading metrics:', error)
      toast.error('Error al cargar métricas: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isDialogOpen && campaignId) {
      loadMetrics()
    }
  }, [isDialogOpen, campaignId])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(num)
  }

  const formatPercentage = (num: number) => {
    return num.toFixed(2) + '%'
  }

  // Datos para gráficos
  const contentStatusData = metrics ? [
    { name: 'Publicado', value: metrics.published_content, color: '#10b981' },
    { name: 'Programado', value: metrics.scheduled_content, color: '#f59e0b' },
    { name: 'Borrador', value: metrics.total_content - metrics.published_content - metrics.scheduled_content, color: '#6b7280' }
  ] : []

  const engagementData = metrics ? [
    { name: 'Alcance', value: metrics.total_reach },
    { name: 'Clics', value: metrics.total_clicks },
    { name: 'Engagement', value: metrics.total_engagement }
  ] : []

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          Métricas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Métricas de Campaña</DialogTitle>
          <DialogDescription>
            Análisis de rendimiento para: {campaignName}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contenido Total</p>
                      <p className="text-2xl font-bold">{metrics.total_content}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Alcance Total</p>
                      <p className="text-2xl font-bold">{formatNumber(metrics.total_reach)}</p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Clics Total</p>
                      <p className="text-2xl font-bold">{formatNumber(metrics.total_clicks)}</p>
                    </div>
                    <MousePointer className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Engagement</p>
                      <p className="text-2xl font-bold">{formatNumber(metrics.total_engagement)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de conversión */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{formatPercentage(metrics.conversion_rate)}</div>
                    <Badge variant={metrics.conversion_rate > 2 ? "default" : metrics.conversion_rate > 1 ? "secondary" : "outline"}>
                      {metrics.conversion_rate > 2 ? "Excelente" : metrics.conversion_rate > 1 ? "Buena" : "Mejorable"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Costo por Adquisición</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.cost_per_acquisition)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{formatPercentage(metrics.roi)}</div>
                    <Badge variant={metrics.roi > 100 ? "default" : metrics.roi > 0 ? "secondary" : "destructive"}>
                      {metrics.roi > 100 ? "Excelente" : metrics.roi > 0 ? "Positivo" : "Negativo"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de estado del contenido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado del Contenido</CardTitle>
                  <CardDescription>Distribución del contenido por estado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={contentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {contentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {contentStatusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Engagement</CardTitle>
                  <CardDescription>Comparación de alcance, clics y engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(Number(value))} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Contenido Publicado</span>
                    <span className="text-lg font-bold">{metrics.published_content} de {metrics.total_content}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tasa de Engagement</span>
                    <span className="text-lg font-bold">
                      {metrics.total_reach > 0 ? formatPercentage((metrics.total_engagement / metrics.total_reach) * 100) : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tasa de Clics</span>
                    <span className="text-lg font-bold">
                      {metrics.total_reach > 0 ? formatPercentage((metrics.total_clicks / metrics.total_reach) * 100) : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No hay métricas disponibles para esta campaña</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={loadMetrics} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar Métricas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}