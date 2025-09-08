import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Client } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  FileText,
  Download,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

const researchTypes = [
  { value: 'comprehensive', label: 'Análisis Integral' },
  { value: 'competitive', label: 'Análisis Competitivo' },
  { value: 'market_size', label: 'Tamaño de Mercado' },
  { value: 'audience_analysis', label: 'Análisis de Audiencia' },
  { value: 'trends_analysis', label: 'Análisis de Tendencias' }
]

const markets = [
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'El Salvador', label: 'El Salvador' },
  { value: 'Honduras', label: 'Honduras' },
  { value: 'Nicaragua', label: 'Nicaragua' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Panama', label: 'Panamá' },
  { value: 'Centroamerica', label: 'Centroamérica' }
]

export default function ResearchPage() {
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('Guatemala')
  const [selectedResearchType, setSelectedResearchType] = useState('comprehensive')
  const [competitors, setCompetitors] = useState('')
  const [generatedResearch, setGeneratedResearch] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const queryClient = useQueryClient()

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

  // Fetch existing research
  const { data: research, isLoading } = useQuery({
    queryKey: ['market_research'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_research')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  // Generate research mutation
  const generateResearchMutation = useMutation({
    mutationFn: async (params: any) => {
      setIsGenerating(true)
      const { data, error } = await supabase.functions.invoke('market-research', {
        body: params
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setGeneratedResearch(data)
      toast.success('Investigación generada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['market_research'] })
    },
    onError: (error: any) => {
      toast.error('Error al generar investigación: ' + error.message)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  })

  const handleGenerateResearch = () => {
    if (!selectedClient && !selectedIndustry) {
      toast.error('Selecciona un cliente o especifica una industria')
      return
    }

    const selectedClientData = clients?.find(c => c.id === selectedClient)
    const industry = selectedClientData?.industry || selectedIndustry
    
    const params = {
      clientId: selectedClient && selectedClient !== 'manual' ? selectedClient : 'manual',
      industry,
      targetMarket: selectedMarket,
      researchType: selectedResearchType,
      competitors: competitors.split(',').map(c => ({ name: c.trim() })).filter(c => c.name)
    }

    generateResearchMutation.mutate(params)
  }

  // Filter research
  const filteredResearch = research?.filter(item => {
    const clientName = clients?.find(c => c.id === item.client_id)?.name || 'Manual'
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           clientName.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investigación de Mercado</h1>
          <p className="mt-1 text-sm text-gray-500">
            Análisis automatizado de mercados, competencia y oportunidades
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Generador de Investigación
              </CardTitle>
              <CardDescription>
                Configura los parámetros para generar un análisis de mercado detallado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Cliente (Opcional)</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Investigación manual</SelectItem>
                      {clients?.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industria *</Label>
                  <Input
                    id="industry"
                    placeholder="Ej: Cuidado Personal y Salud"
                    value={selectedClient ? clients?.find(c => c.id === selectedClient)?.industry || '' : selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    disabled={!!selectedClient}
                  />
                </div>

                <div>
                  <Label htmlFor="market">Mercado Objetivo</Label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map(market => (
                        <SelectItem key={market.value} value={market.value}>
                          {market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="researchType">Tipo de Investigación</Label>
                  <Select value={selectedResearchType} onValueChange={setSelectedResearchType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {researchTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="competitors">Competidores Conocidos (separados por comas)</Label>
                <Input
                  id="competitors"
                  placeholder="Ej: Champiojo, Sarpiol, Terminator"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateResearch}
                disabled={isGenerating || (!selectedClient && !selectedIndustry)}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando investigación...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generar Investigación
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Research Results */}
          {generatedResearch && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      {generatedResearch.title}
                    </CardTitle>
                    <CardDescription>
                      Confianza: {generatedResearch.confidence_level} • 
                      Generado: {new Date(generatedResearch.generated_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Executive Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resumen Ejecutivo</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {generatedResearch.research_summary}
                  </p>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hallazgos Clave</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedResearch.key_findings?.map((finding, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-800">{finding}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Size */}
                {generatedResearch.market_size && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tamaño de Mercado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium text-blue-900">Mercado Global</p>
                        <p className="text-sm text-blue-700">
                          {generatedResearch.market_size.global_market}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="font-medium text-green-900">Mercado Regional</p>
                        <p className="text-sm text-green-700">
                          {generatedResearch.market_size.regional_market}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium text-purple-900">Crecimiento</p>
                        <p className="text-sm text-purple-700">
                          {generatedResearch.market_size.growth_rate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitive Insights */}
                {generatedResearch.competitor_insights && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Análisis Competitivo</h4>
                    <div className="space-y-3">
                      {generatedResearch.competitor_insights.market_leaders?.map((competitor, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                            <Badge variant="outline">
                              {competitor.market_share_estimate}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-green-700 font-medium mb-1">Fortalezas:</p>
                              <ul className="space-y-1">
                                {competitor.strengths?.map((strength, i) => (
                                  <li key={i} className="text-gray-600 flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-red-700 font-medium mb-1">Debilidades:</p>
                              <ul className="space-y-1">
                                {competitor.weaknesses?.map((weakness, i) => (
                                  <li key={i} className="text-gray-600 flex items-start">
                                    <span className="text-red-600 mr-2">•</span>
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Opportunities */}
                {generatedResearch.growth_opportunities && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Oportunidades de Crecimiento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedResearch.growth_opportunities.map((opportunity, index) => (
                        <div key={index} className="p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-start">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-yellow-900 mb-1">
                                {opportunity.opportunity}
                              </h5>
                              <div className="text-sm text-yellow-800 space-y-1">
                                <div><strong>Impacto:</strong> {opportunity.potential_impact}</div>
                                <div><strong>Timeline:</strong> {opportunity.timeline}</div>
                                <div><strong>Inversión:</strong> {opportunity.investment_required}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {generatedResearch.risk_assessment && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Evaluación de Riesgos</h4>
                    <div className="space-y-3">
                      {generatedResearch.risk_assessment.market_threats?.map((threat, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">{threat}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic Recommendations */}
                {generatedResearch.strategic_recommendations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recomendaciones Estratégicas</h4>
                    <div className="space-y-4">
                      {generatedResearch.strategic_recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{rec.recommendation}</h5>
                            <Badge 
                              variant={rec.priority === 'Alta' ? 'destructive' : 
                                      rec.priority === 'Media' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">Acciones:</p>
                            <ul className="space-y-1">
                              {rec.actions?.map((action, actionIndex) => (
                                <li key={actionIndex} className="text-sm text-gray-700 flex items-start">
                                  <span className="text-blue-600 mr-2">•</span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {rec.expected_impact && (
                            <div className="p-2 bg-green-50 rounded text-sm text-green-800">
                              <strong>Impacto esperado:</strong> {rec.expected_impact}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Sources */}
                {generatedResearch.data_sources && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fuentes de Datos</h4>
                    <div className="text-sm text-gray-600">
                      {generatedResearch.data_sources.map((source, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <FileText className="h-3 w-3 mr-2" />
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Research History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investigaciones Recientes</CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Buscar investigaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredResearch?.slice(0, 5).map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.research_type} • {clients?.find(c => c.id === item.client_id)?.name || 'Manual'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredResearch?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {searchTerm ? 'No se encontraron investigaciones' : 'No hay investigaciones aún'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Research Types Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Investigación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {researchTypes.map(type => (
                  <div key={type.value} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {type.value === 'comprehensive' && 'Análisis completo incluyendo mercado, competencia y oportunidades'}
                      {type.value === 'competitive' && 'Enfoque en análisis detallado de competidores'}
                      {type.value === 'market_size' && 'Evaluación del tamaño y potencial del mercado'}
                      {type.value === 'audience_analysis' && 'Estudio profundo del público objetivo'}
                      {type.value === 'trends_analysis' && 'Identificación de tendencias y oportunidades emergentes'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips de Investigación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <p>Define claramente tu mercado objetivo</p>
                </div>
                <div className="flex items-start">
                  <Users className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <p>Incluye competidores directos e indirectos</p>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <p>Actualiza la investigación regularmente</p>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <p>Combina datos cuantitativos y cualitativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}