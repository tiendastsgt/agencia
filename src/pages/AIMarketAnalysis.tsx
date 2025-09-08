import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase, Client, AI_ENABLED, TIENDASTS_CLIENT_ID } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  Target,
  Search,
  BarChart3,
  DollarSign,
  CheckCircle,
  Cpu,
  Brain,
  Lightbulb,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

const analysisTypes = [
  {
    value: 'competitive',
    label: 'Análisis Competitivo',
    icon: BarChart3,
    description: 'Analiza el panorama competitivo y identifica ventajas únicas'
  },
  {
    value: 'market_opportunity',
    label: 'Oportunidades de Mercado',
    icon: Target,
    description: 'Identifica nichos no explotados y estrategias de expansión'
  },
  {
    value: 'audience_segmentation',
    label: 'Segmentación de Audiencias',
    icon: Users,
    description: 'Segmentación avanzada y perfiles psicográficos'
  },
  {
    value: 'digital_trends',
    label: 'Tendencias Digitales',
    icon: TrendingUp,
    description: 'Tendencias específicas para Guatemala y comportamientos online'
  },
  {
    value: 'pricing_strategy',
    label: 'Estrategia de Precios',
    icon: DollarSign,
    description: 'Estrategia basada en valor percibido y elasticidad regional'
  }
]

export default function AIMarketAnalysis() {
  const [selectedClient, setSelectedClient] = useState(TIENDASTS_CLIENT_ID)
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('')
  const [customRequirements, setCustomRequirements] = useState('')
  const [generatedAnalysis, setGeneratedAnalysis] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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

  // Fetch recent analyses
  const { data: recentAnalyses } = useQuery({
    queryKey: ['market-research', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return []
      
      const { data, error } = await supabase
        .from('market_research')
        .select('*')
        .eq('client_id', selectedClient)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    },
    enabled: !!selectedClient
  })

  // AI Market Analysis Generation Mutation
  const generateAnalysisMutation = useMutation({
    mutationFn: async (params: any) => {
      setIsGenerating(true)
      
      const { data, error } = await supabase.functions.invoke('generate-market-analysis', {
        body: params
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setGeneratedAnalysis(data)
      toast.success('Análisis de mercado generado con IA!')
    },
    onError: (error: any) => {
      toast.error('Error al generar análisis: ' + error.message)
      console.error('Analysis generation error:', error)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  })

  const handleGenerateAnalysis = () => {
    if (!selectedClient || !selectedAnalysisType) {
      toast.error('Por favor selecciona cliente y tipo de análisis')
      return
    }

    const params = {
      clientId: selectedClient,
      analysisType: selectedAnalysisType,
      customRequirements: customRequirements || null
    }

    generateAnalysisMutation.mutate(params)
  }

  const selectedAnalysisInfo = analysisTypes.find(t => t.value === selectedAnalysisType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-600" />
            Análisis de Mercado con IA
          </h1>
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-green-600" />
            Insights profundos generados con inteligencia artificial
          </p>
        </div>
        {AI_ENABLED && (
          <Badge variant="default" className="bg-green-600">
            IA ACTIVA
          </Badge>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sistema IA</p>
                <p className="text-2xl font-bold text-green-600">ACTIVO</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cliente Foco</p>
                <p className="text-lg font-bold text-blue-600">TiendaSTS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Análisis</p>
                <p className="text-2xl font-bold text-purple-600">{recentAnalyses?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mercado</p>
                <p className="text-lg font-bold text-orange-600">Guatemala</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Generation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analysis Types Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Tipos de Análisis Disponibles
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de análisis que necesitas para TiendaSTS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisTypes.map((analysis) => {
                  const Icon = analysis.icon
                  const isSelected = selectedAnalysisType === analysis.value
                  return (
                    <div
                      key={analysis.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAnalysisType(analysis.value)}
                    >
                      <div className="flex items-start">
                        <Icon className={`h-6 w-6 mr-3 mt-1 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <div>
                          <h3 className={`font-medium ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {analysis.label}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            isSelected ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {analysis.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Configuración del Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Selection */}
              <div>
                <Label htmlFor="client">Cliente *</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.id === TIENDASTS_CLIENT_ID && '(Principal)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Analysis Type Display */}
              {selectedAnalysisInfo && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <selectedAnalysisInfo.icon className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">
                      {selectedAnalysisInfo.label}
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    {selectedAnalysisInfo.description}
                  </p>
                </div>
              )}

              {/* Custom Requirements */}
              <div>
                <Label htmlFor="requirements">Requerimientos Específicos (Opcional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Ej: Enfócate en el segmento de mujeres profesionales 28-45 años, analiza productos naturales vs químicos..."
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateAnalysis}
                disabled={isGenerating || !selectedClient || !selectedAnalysisType}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando análisis con IA...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generar Análisis con IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Analysis Display */}
          {generatedAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Análisis Generado: {generatedAnalysis.analysis_type}
                </CardTitle>
                <CardDescription>
                  Cliente: {generatedAnalysis.client_name} • Generado con IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Executive Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Resumen Ejecutivo</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">
                      {generatedAnalysis.executive_summary}
                    </p>
                  </div>
                </div>

                {/* Key Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Size */}
                  {generatedAnalysis.market_size_analysis && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Tamaño de Mercado</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>TAM:</strong> {generatedAnalysis.market_size_analysis.total_addressable_market}</p>
                        <p><strong>SAM:</strong> {generatedAnalysis.market_size_analysis.serviceable_addressable_market}</p>
                        <p><strong>Crecimiento:</strong> {generatedAnalysis.market_size_analysis.growth_projections}</p>
                      </div>
                    </div>
                  )}

                  {/* Competitive Advantages */}
                  {generatedAnalysis.competitive_landscape?.competitive_advantages && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Ventajas Competitivas</h4>
                      <ul className="space-y-1 text-sm text-green-800">
                        {generatedAnalysis.competitive_landscape.competitive_advantages.slice(0, 3).map((advantage: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Opportunities */}
                  {generatedAnalysis.opportunity_assessment?.immediate_opportunities && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Oportunidades Inmediatas</h4>
                      <ul className="space-y-1 text-sm text-purple-800">
                        {generatedAnalysis.opportunity_assessment.immediate_opportunities.slice(0, 3).map((opportunity: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Target className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Threats */}
                  {generatedAnalysis.opportunity_assessment?.potential_threats && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Amenazas Potenciales</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        {generatedAnalysis.opportunity_assessment.potential_threats.slice(0, 3).map((threat: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Plan */}
                {generatedAnalysis.action_plan && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Plan de Acción</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedAnalysis.action_plan.short_term_actions && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-yellow-900 mb-2">Acciones a Corto Plazo</h5>
                          <ul className="space-y-1 text-sm text-yellow-800">
                            {generatedAnalysis.action_plan.short_term_actions.slice(0, 3).map((action: string, index: number) => (
                              <li key={index}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {generatedAnalysis.action_plan.medium_term_strategies && (
                        <div className="p-4 bg-indigo-50 rounded-lg">
                          <h5 className="font-medium text-indigo-900 mb-2">Estrategias a Mediano Plazo</h5>
                          <ul className="space-y-1 text-sm text-indigo-800">
                            {generatedAnalysis.action_plan.medium_term_strategies.slice(0, 3).map((strategy: string, index: number) => (
                              <li key={index}>• {strategy}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Estado del Sistema IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">IA de Análisis</span>
                  <Badge variant="default" className="bg-green-600">Activa</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Modelo</span>
                  <Badge variant="secondary">GPT-5-nano</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mercado Foco</span>
                  <Badge variant="outline">Guatemala</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Análisis Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAnalyses?.slice(0, 5).map(analysis => (
                  <div key={analysis.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {analysis.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {analysis.research_type} • {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={analysis.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {analysis.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!recentAnalyses || recentAnalyses.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay análisis previos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips de Análisis IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Brain className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <p>La IA analiza datos específicos del mercado guatemalteco</p>
                </div>
                <div className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <p>Cada análisis incluye insights accionables y recomendaciones</p>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <p>Seé específico en tus requerimientos para mejores resultados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}