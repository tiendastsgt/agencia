import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase, Analytics } from '@/lib/supabase'
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
  const { activeClient } = useActiveClient()
  const [analytics, setAnalytics] = useState<Analytics[]>([
    {
      id: '1',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-1',
      metric_type: 'engagement',
      metric_name: 'engagement_rate',
      metric_value: 7.2,
      metric_unit: '%',
      platform: 'facebook',
      date_recorded: '2025-09-10T00:00:00Z',
      additional_data: { reach: 1250, impressions: 2100 },
      created_at: '2025-09-10T00:00:00Z'
    },
    {
      id: '2',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-1',
      metric_type: 'conversion',
      metric_name: 'leads',
      metric_value: 45,
      metric_unit: 'leads',
      platform: 'facebook',
      date_recorded: '2025-09-10T00:00:00Z',
      additional_data: { cost_per_lead: 12.50 },
      created_at: '2025-09-10T00:00:00Z'
    },
    {
      id: '3',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-1',
      metric_type: 'conversion',
      metric_name: 'conversions',
      metric_value: 8,
      metric_unit: 'ventas',
      platform: 'facebook',
      date_recorded: '2025-09-10T00:00:00Z',
      additional_data: { conversion_rate: 17.8 },
      created_at: '2025-09-10T00:00:00Z'
    },
    {
      id: '4',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-2',
      metric_type: 'engagement',
      metric_name: 'engagement_rate',
      metric_value: 9.1,
      metric_unit: '%',
      platform: 'instagram',
      date_recorded: '2025-09-09T00:00:00Z',
      additional_data: { reach: 890, impressions: 1450 },
      created_at: '2025-09-09T00:00:00Z'
    },
    {
      id: '5',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-2',
      metric_type: 'engagement',
      metric_name: 'likes',
      metric_value: 156,
      metric_unit: 'likes',
      platform: 'instagram',
      date_recorded: '2025-09-09T00:00:00Z',
      additional_data: { comments: 23, shares: 12 },
      created_at: '2025-09-09T00:00:00Z'
    },
    {
      id: '6',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-3',
      metric_type: 'engagement',
      metric_name: 'engagement_rate',
      metric_value: 12.3,
      metric_unit: '%',
      platform: 'tiktok',
      date_recorded: '2025-09-08T00:00:00Z',
      additional_data: { views: 3200, shares: 45 },
      created_at: '2025-09-08T00:00:00Z'
    },
    {
      id: '7',
      client_id: activeClient?.id || '',
      campaign_id: 'campaign-3',
      metric_type: 'conversion',
      metric_name: 'leads',
      metric_value: 23,
      metric_unit: 'leads',
      platform: 'tiktok',
      date_recorded: '2025-09-08T00:00:00Z',
      additional_data: { cost_per_lead: 8.75 },
      created_at: '2025-09-08T00:00:00Z'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadAnalytics()
    }
  }, [activeClient])

  const loadAnalytics = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('date_recorded', { ascending: false })

      if (error) throw error
      setAnalytics(data || [])
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case 'engagement_rate': return <Heart className="h-4 w-4 text-red-500" />
      case 'leads': return <Users className="h-4 w-4 text-blue-500" />
      case 'conversions': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'impressions': return <Eye className="h-4 w-4 text-purple-500" />
      case 'clicks': return <BarChart3 className="h-4 w-4 text-orange-500" />
      case 'shares': return <Share className="h-4 w-4 text-cyan-500" />
      case 'comments': return <MessageCircle className="h-4 w-4 text-pink-500" />
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-100 text-blue-800'
      case 'instagram': return 'bg-pink-100 text-pink-800'
      case 'linkedin': return 'bg-blue-100 text-blue-800'
      case 'twitter': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Agrupar métricas por tipo
  const groupedMetrics = analytics.reduce((acc, metric) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = []
    }
    acc[metric.metric_name].push(metric)
    return acc
  }, {} as Record<string, Analytics[]>)

  // Calcular totales
  const totalLeads = analytics
    .filter(a => a.metric_name === 'leads')
    .reduce((sum, a) => sum + (a.metric_value || 0), 0)

  const totalConversions = analytics
    .filter(a => a.metric_name === 'conversions')
    .reduce((sum, a) => sum + (a.metric_value || 0), 0)

  const avgEngagement = analytics
    .filter(a => a.metric_name === 'engagement_rate')
    .reduce((sum, a) => sum + (a.metric_value || 0), 0) / 
    Math.max(analytics.filter(a => a.metric_name === 'engagement_rate').length, 1)

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h1>
          <p className="text-gray-600">Selecciona un cliente para ver sus analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Análisis y métricas para {activeClient.name}
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Leads generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              Conversiones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Promedio</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${Math.round(avgEngagement * 10) / 10}%`}</div>
            <p className="text-xs text-muted-foreground">
              Tasa de engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plataformas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : new Set(analytics.map(a => a.platform)).size}</div>
            <p className="text-xs text-muted-foreground">
              Plataformas activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas por Tipo</CardTitle>
            <CardDescription>
              Desglose de métricas por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando métricas...
              </div>
            ) : Object.keys(groupedMetrics).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedMetrics).map(([metricName, metrics]) => (
                  <div key={metricName} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(metricName)}
                        <span className="font-medium capitalize">{metricName.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline">
                        {metrics.length} registros
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total:</p>
                        <p className="font-medium">
                          {metrics.reduce((sum, m) => sum + (m.metric_value || 0), 0)}
                          {metrics[0]?.metric_unit && ` ${metrics[0].metric_unit}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Promedio:</p>
                        <p className="font-medium">
                          {Math.round(metrics.reduce((sum, m) => sum + (m.metric_value || 0), 0) / metrics.length * 10) / 10}
                          {metrics[0]?.metric_unit && ` ${metrics[0].metric_unit}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay métricas disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas por Plataforma</CardTitle>
            <CardDescription>
              Rendimiento por plataforma social
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando datos...
              </div>
            ) : analytics.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(
                  analytics.reduce((acc, metric) => {
                    if (!acc[metric.platform]) {
                      acc[metric.platform] = []
                    }
                    acc[metric.platform].push(metric)
                    return acc
                  }, {} as Record<string, Analytics[]>)
                ).map(([platform, metrics]) => (
                  <div key={platform} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getPlatformColor(platform)}>
                        {platform}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {metrics.length} métricas
                      </span>
                    </div>
                    <div className="space-y-2">
                      {metrics.slice(0, 3).map((metric, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 capitalize">
                            {metric.metric_name.replace('_', ' ')}:
                          </span>
                          <span className="font-medium">
                            {metric.metric_value} {metric.metric_unit || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos de plataformas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}