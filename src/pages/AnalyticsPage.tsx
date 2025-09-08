import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase, Client } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface AnalysisResult {
  analysis_period: string
  total_metrics: number
  performance_summary: any
  key_metrics: any
  trends: any
  platform_performance: any
  insights: any[]
  performance_scores: any
  recommendations: any[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AnalyticsPage() {
  const [selectedClient, setSelectedClient] = useState('')
  const [timeRange, setTimeRange] = useState('30')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data as Client[]
    }
  })

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ['analytics', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return []
      
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('client_id', selectedClient)
        .order('date_recorded', { ascending: false })
        .limit(50)
      
      if (error) throw error
      return data
    },
    enabled: !!selectedClient
  })

  // Analyze metrics mutation
  const analyzeMetricsMutation = useMutation({
    mutationFn: async (params: { clientId: string; timeRange: number }) => {
      setIsAnalyzing(true)
      const { data, error } = await supabase.functions.invoke('analyze-metrics', {
        body: params
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setAnalysisResult(data)
      toast.success('Análisis completado exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error en el análisis: ' + error.message)
    },
    onSettled: () => {
      setIsAnalyzing(false)
    }
  })

  const handleAnalyze = () => {
    if (!selectedClient) {
      toast.error('Selecciona un cliente primero')
      return
    }

    analyzeMetricsMutation.mutate({
      clientId: selectedClient,
      timeRange: parseInt(timeRange)
    })
  }

  // Sample data for visualization when no real data
  const sampleMetricsData = [
    { date: '2025-01-01', reach: 12500, engagement: 520, conversions: 23 },
    { date: '2025-01-02', reach: 8750, engagement: 462, conversions: 18 },
    { date: '2025-01-03', reach: 25600, engagement: 1250, conversions: 45 },
    { date: '2025-01-04', reach: 15200, engagement: 680, conversions: 32 },
    { date: '2025-01-05', reach: 18900, engagement: 890, conversions: 38 },
    { date: '2025-01-06', reach: 22100, engagement: 1100, conversions: 52 },
    { date: '2025-01-07', reach: 19800, engagement: 950, conversions: 41 }
  ]

  const platformData = [
    { name: 'Facebook', value: 35, engagement: 4.2, cost: 18.75 },
    { name: 'Instagram', value: 28, engagement: 6.8, cost: 22.50 },
    { name: 'TikTok', value: 22, engagement: 8.5, cost: 15.30 },
    { name: 'LinkedIn', value: 15, engagement: 3.1, cost: 25.80 }
  ]

  const selectedClientData = clients?.find(c => c.id === selectedClient)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Análisis avanzado de métricas con insights automatizados
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Configuración de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de Análisis
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                  <SelectItem value="90">Últimos 90 días</SelectItem>
                  <SelectItem value="180">Últimos 6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedClient}
              className="flex-shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analizando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analizar Métricas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Overview */}
      {selectedClientData && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedClientData.name}</CardTitle>
            <CardDescription>
              {selectedClientData.industry} • {selectedClientData.country}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Target Audience</p>
                <p className="text-sm text-blue-700">
                  {selectedClientData.target_audience?.primary || 'No definido'}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Propuesta de Valor</p>
                <p className="text-sm text-green-700 line-clamp-2">
                  {selectedClientData.unique_value_proposition || 'No definida'}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Competidores</p>
                <p className="text-sm text-purple-700">
                  {selectedClientData.competitors?.main_competitors?.length || 0} identificados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Performance Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Score
              </CardTitle>
              <CardDescription>
                Calificación general basada en métricas clave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    analysisResult.performance_scores?.overall_score >= 80 ? 'text-green-600' :
                    analysisResult.performance_scores?.overall_score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysisResult.performance_scores?.overall_score || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">General</p>
                  <Badge variant="outline">
                    {analysisResult.performance_scores?.grade || 'N/A'}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.performance_scores?.engagement_score || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.performance_scores?.reach_score || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">Alcance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisResult.performance_scores?.conversion_score || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">Conversiones</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisResult.performance_scores?.roi_score || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          {analysisResult.insights?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Insights Automatizados
                </CardTitle>
                <CardDescription>
                  Descubrimientos clave basados en tus datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.insights.map((insight, index) => {
                    const Icon = insight.type === 'positive' ? CheckCircle :
                                insight.type === 'warning' ? AlertCircle :
                                Clock
                    const colorClass = insight.type === 'positive' ? 'text-green-600' :
                                      insight.type === 'warning' ? 'text-yellow-600' :
                                      'text-blue-600'
                    const bgClass = insight.type === 'positive' ? 'bg-green-50' :
                                   insight.type === 'warning' ? 'bg-yellow-50' :
                                   'bg-blue-50'
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg ${bgClass}`}>
                        <div className="flex items-start">
                          <Icon className={`h-5 w-5 mr-3 mt-0.5 ${colorClass}`} />
                          <div className="flex-1">
                            <h4 className={`font-medium ${colorClass}`}>
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1">
                              {insight.message}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              Impacto: {insight.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysisResult.recommendations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Recomendaciones Estratégicas
                </CardTitle>
                <CardDescription>
                  Acciones prioritarias para mejorar performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : 
                                  rec.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority === 'high' ? 'Alta' : 
                           rec.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-3">Acciones recomendadas:</p>
                        <ul className="space-y-1">
                          {rec.actions?.map((action, actionIndex) => (
                            <li key={actionIndex} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                        {rec.expected_impact && (
                          <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                            <strong>Impacto esperado:</strong> {rec.expected_impact}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Default Charts when no analysis */}
      {!analysisResult && selectedClient && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metrics Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Métricas</CardTitle>
              <CardDescription>
                Últimos 7 días de actividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sampleMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <Area type="monotone" dataKey="reach" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="engagement" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Plataforma</CardTitle>
              <CardDescription>
                Comparativa de engagement y costos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#3B82F6" name="Engagement %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Tráfico</CardTitle>
              <CardDescription>
                Por plataforma social
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {platformData.map((platform, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{platform.name}: {platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Métricas</CardTitle>
              <CardDescription>
                Métricas clave del período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">125K</p>
                  <p className="text-sm text-blue-700">Alcance Total</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MousePointer className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">5.4%</p>
                  <p className="text-sm text-green-700">Engagement Rate</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">147</p>
                  <p className="text-sm text-purple-700">Conversiones</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">Q18.50</p>
                  <p className="text-sm text-orange-700">CPL Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedClient && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Selecciona un cliente para ver analytics
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Elige un cliente arriba para comenzar el análisis de métricas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}