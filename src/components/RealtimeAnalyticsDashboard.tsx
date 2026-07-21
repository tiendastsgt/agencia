import React, { useState, useEffect } from 'react'
import { UPDATE_INTERVALS } from '../lib/constants'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  RealtimeAnalyticsService, 
  DashboardData, 
  PerformanceAlert,
  CampaignComparison 
} from '@/lib/realtime-analytics-service'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  MousePointer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BarChart3,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Bell,
  BellOff,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface RealtimeAnalyticsDashboardProps {
  className?: string
}

export default function RealtimeAnalyticsDashboard({ className }: RealtimeAnalyticsDashboardProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [analyticsService] = useState(() => new RealtimeAnalyticsService())
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Query para datos del dashboard
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['realtime-analytics', activeClient?.id],
    queryFn: () => analyticsService.getDashboardData(activeClient?.id),
    refetchInterval: isRealTimeEnabled ? UPDATE_INTERVALS.REALTIME_ANALYTICS : false,
    enabled: !!activeClient
  })

  // Mutation para resolver alertas
  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => analyticsService.resolveAlert(alertId),
    onSuccess: () => {
      toast.success('Alerta resuelta')
      queryClient.invalidateQueries({ queryKey: ['realtime-analytics'] })
    },
    onError: (error: any) => {
      toast.error(`Error resolviendo alerta: ${error.message}`)
    }
  })

  // Efecto para actualizar datos en tiempo real
  useEffect(() => {
    if (data) {
      setDashboardData(data)
    }
  }, [data])

  // Efecto para monitoreo en tiempo real
  useEffect(() => {
    if (!isRealTimeEnabled || !activeClient) return

    const stopMonitoring = analyticsService.startRealtimeMonitoring(
      (newData) => {
        setDashboardData(newData)
      },
      activeClient.id
    )

    return stopMonitoring
  }, [isRealTimeEnabled, activeClient, analyticsService])

  const handleResolveAlert = (alertId: string) => {
    resolveAlertMutation.mutate(alertId)
  }

  const handleToggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled)
    toast.info(`Monitoreo en tiempo real ${!isRealTimeEnabled ? 'activado' : 'desactivado'}`)
  }

  const handleRefresh = () => {
    refetch()
    toast.success('Datos actualizados')
  }

  const handleExportData = () => {
    if (!dashboardData) return
    
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: dashboardData.summary,
      platforms: dashboardData.realtime_metrics,
      campaigns: dashboardData.campaign_comparisons,
      alerts: dashboardData.performance_alerts
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Datos exportados')
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Globe className="h-4 w-4" />
      case 'instagram': return <Smartphone className="h-4 w-4" />
      case 'twitter': return <MessageCircle className="h-4 w-4" />
      case 'linkedin': return <Users className="h-4 w-4" />
      case 'youtube': return <Monitor className="h-4 w-4" />
      case 'tiktok': return <Tablet className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'engagement_drop': return <TrendingDown className="h-4 w-4" />
      case 'reach_decrease': return <Eye className="h-4 w-4" />
      case 'cost_increase': return <TrendingUp className="h-4 w-4" />
      case 'performance_spike': return <Zap className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Datos para gráficos
  const platformData = dashboardData?.realtime_metrics.map(metric => ({
    platform: metric.platform,
    engagement: metric.metrics.inbound_engagements,
    reach: metric.metrics.reach,
    impressions: metric.metrics.impressions,
    clicks: metric.metrics.clicks,
    engagement_rate: metric.metrics.engagement_rate
  })) || []

  const campaignData = dashboardData?.campaign_comparisons.map(campaign => ({
    name: campaign.campaign_name,
    performance: campaign.performance_score,
    engagement: campaign.metrics.engagement_rate,
    reach: campaign.metrics.total_reach,
    roi: campaign.metrics.return_on_investment
  })) || []

  const alertData = dashboardData?.performance_alerts.reduce((acc, alert) => {
    const existing = acc.find(item => item.type === alert.type)
    if (existing) {
      existing.count++
    } else {
      acc.push({ type: alert.type, count: 1, severity: alert.severity })
    }
    return acc
  }, [] as Array<{ type: string; count: number; severity: string }>) || []

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para ver analytics en tiempo real
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
            <p className="text-muted-foreground">Cargando analytics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-red-600">Error cargando analytics</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Analytics en Tiempo Real</h2>
            <p className="text-muted-foreground">
              Monitoreo en vivo de {activeClient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isRealTimeEnabled ? "default" : "outline"} className="flex items-center gap-1">
            {isRealTimeEnabled ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
            {isRealTimeEnabled ? 'En Vivo' : 'Pausado'}
          </Badge>
          <Button
            onClick={handleToggleRealTime}
            variant="outline"
            size="sm"
          >
            {isRealTimeEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            size="sm"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.total_engagements.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alcance Total</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.total_reach.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campañas Activas</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.active_campaigns}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Activas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertas</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.alerts_count}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              {dashboardData?.summary.alerts_count === 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Sin alertas</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">Requiere atención</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de engagement por plataforma */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement por Plataforma</CardTitle>
                <CardDescription>Comparación de engagement entre plataformas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de distribución de alertas */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Alertas</CardTitle>
                <CardDescription>Tipos de alertas por severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count }) => `${type}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {alertData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de tendencias */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Rendimiento</CardTitle>
              <CardDescription>Evolución del engagement y alcance en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="engagement" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="reach" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Plataformas */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData?.realtime_metrics.map((metric) => (
              <Card key={metric.platform}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getPlatformIcon(metric.platform)}
                    {metric.platform.charAt(0).toUpperCase() + metric.platform.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Posts</p>
                      <p className="font-semibold">{metric.metrics.posts_published}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-semibold">{metric.metrics.inbound_engagements}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alcance</p>
                      <p className="font-semibold">{metric.metrics.reach.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Impresiones</p>
                      <p className="font-semibold">{metric.metrics.impressions.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <span className={`font-semibold ${getPerformanceColor(metric.metrics.engagement_rate)}`}>
                        {metric.metrics.engagement_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">vs Benchmark</span>
                      <span className={`font-semibold ${metric.benchmarks.performance_vs_benchmark > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.benchmarks.performance_vs_benchmark > 0 ? '+' : ''}{metric.benchmarks.performance_vs_benchmark.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Campañas */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de rendimiento de campañas */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Campañas</CardTitle>
                <CardDescription>Comparación de scores de rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lista de campañas */}
            <Card>
              <CardHeader>
                <CardTitle>Campañas Activas</CardTitle>
                <CardDescription>Estado y rendimiento de campañas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.campaign_comparisons.map((campaign) => (
                    <div key={campaign.campaign_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{campaign.campaign_name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getPerformanceColor(campaign.performance_score)}`}>
                          {campaign.performance_score.toFixed(0)}%
                        </p>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Alertas */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {dashboardData?.performance_alerts.map((alert) => (
              <Alert key={alert.id} className={getAlertColor(alert.severity)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <AlertDescription className="font-semibold">
                        {alert.message}
                      </AlertDescription>
                      <div className="mt-2 text-sm">
                        <p>Valor actual: {alert.current_value}</p>
                        <p>Valor anterior: {alert.previous_value}</p>
                        <p>Cambio: {alert.change_percentage > 0 ? '+' : ''}{alert.change_percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {alert.severity}
                    </Badge>
                    <Button
                      onClick={() => handleResolveAlert(alert.id)}
                      variant="outline"
                      size="sm"
                    >
                      Resolver
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
            
            {dashboardData?.performance_alerts.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-muted-foreground">No hay alertas activas</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
