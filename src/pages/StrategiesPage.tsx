import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Client } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Target,
  BookOpen,
  TrendingUp,
  Zap,
  Users,
  Lightbulb,
  CheckCircle,
  Clock,
  Play,
  Download,
  Eye,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

const russellBrunsonFrameworks = [
  {
    value: 'perfect_webinar',
    label: 'Perfect Webinar',
    description: 'Presentación de 90 minutos para maximizar conversiones',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    value: 'value_ladder',
    label: 'Value Ladder',
    description: 'Sistema progresivo de ofertas para maximizar LTV',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    value: 'hook_story_offer',
    label: 'Hook-Story-Offer',
    description: 'Framework de 3 pasos para contenido de alta conversión',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    value: 'dream_100',
    label: 'Dream 100',
    description: 'Estrategia para infiltrar audiencias de influencers clave',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

const strategyTypes = [
  { value: 'traffic_generation', label: 'Generación de Tráfico' },
  { value: 'conversion_optimization', label: 'Optimización de Conversiones' },
  { value: 'customer_acquisition', label: 'Adquisición de Clientes' },
  { value: 'retention_strategy', label: 'Estrategia de Retención' },
  { value: 'brand_positioning', label: 'Posicionamiento de Marca' }
]

export default function StrategiesPage() {
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('')
  const [selectedStrategyType, setSelectedStrategyType] = useState('')
  const [businessGoals, setBusinessGoals] = useState('')
  const [customRequirements, setCustomRequirements] = useState('')
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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

  // Fetch existing strategies
  const { data: strategies, isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  // Generate strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: async (params: any) => {
      setIsGenerating(true)
      const { data, error } = await supabase.functions.invoke('generate-marketing-strategy', {
        body: {
          ...params,
          openai_api_key: import.meta.env.VITE_OPENAI_API_KEY
        }
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setGeneratedStrategy(data)
      toast.success('Estrategia generada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['strategies'] })
    },
    onError: (error: any) => {
      toast.error('Error al generar estrategia: ' + error.message)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  })

  const handleGenerateStrategy = () => {
    if (!selectedClient || !selectedFramework || !selectedStrategyType) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const selectedClientData = clients?.find(c => c.id === selectedClient)
    
    const params = {
      clientId: selectedClient,
      strategyType: selectedStrategyType,
      framework: selectedFramework,
      targetAudience: selectedClientData?.target_audience,
      productInfo: {
        name: selectedClientData?.name,
        industry: selectedClientData?.industry,
        valueProposition: selectedClientData?.unique_value_proposition
      },
      businessGoals: businessGoals.split(',').map(goal => goal.trim()).filter(Boolean),
      customRequirements
    }

    generateStrategyMutation.mutate(params)
  }

  const selectedFrameworkInfo = russellBrunsonFrameworks.find(f => f.value === selectedFramework)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estrategias Russell Brunson</h1>
          <p className="mt-1 text-sm text-gray-500">
            Genera estrategias personalizadas basadas en frameworks probados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Framework Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Generador de Estrategias
              </CardTitle>
              <CardDescription>
                Selecciona el framework y parámetros para generar una estrategia personalizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Framework Cards */}
              <div>
                <Label className="text-base font-medium mb-4 block">Framework Russell Brunson *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {russellBrunsonFrameworks.map((framework) => {
                    const Icon = framework.icon
                    const isSelected = selectedFramework === framework.value
                    
                    return (
                      <div
                        key={framework.value}
                        onClick={() => setSelectedFramework(framework.value)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <Icon className={`h-6 w-6 mr-3 mt-1 ${
                            isSelected ? 'text-blue-600' : framework.color
                          }`} />
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              isSelected ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {framework.label}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              isSelected ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {framework.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Cliente *</Label>
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

                <div>
                  <Label htmlFor="strategyType">Tipo de Estrategia *</Label>
                  <Select value={selectedStrategyType} onValueChange={setSelectedStrategyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de estrategia" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="goals">Objetivos de Negocio (separados por comas)</Label>
                <Input
                  id="goals"
                  placeholder="Ej: Aumentar leads 50%, Mejorar conversiones, Expandir mercado..."
                  value={businessGoals}
                  onChange={(e) => setBusinessGoals(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requerimientos Especiales (Opcional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Ej: Enfoque en redes sociales, presupuesto limitado, target específico..."
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerateStrategy}
                disabled={isGenerating || !selectedClient || !selectedFramework || !selectedStrategyType}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando estrategia...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Estrategia
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Strategy */}
          {generatedStrategy && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Estrategia Generada
                    </CardTitle>
                    <CardDescription>
                      Framework: {selectedFrameworkInfo?.label}
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
                {/* Overview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resumen</h4>
                  <p className="text-sm text-gray-700">{generatedStrategy.strategy_overview}</p>
                </div>

                {/* Key Components */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Componentes Clave</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedStrategy.key_components?.map((component, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-sm text-blue-800">{component}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Implementation Roadmap */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan de Implementación</h4>
                  <div className="space-y-3">
                    {Object.entries(generatedStrategy.implementation_roadmap || {}).map(([phase, actions]) => (
                      <div key={phase} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2 capitalize">
                          {phase.replace('_', ' ')}
                        </h5>
                        <ul className="space-y-1">
                          {Array.isArray(actions) ? actions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {action}
                            </li>
                          )) : (
                            <li className="text-sm text-gray-700">{String(actions)}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Metrics */}
                {generatedStrategy.success_metrics && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Métricas de Éxito</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(generatedStrategy.success_metrics).map(([metric, value]) => (
                        <div key={metric} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-900 capitalize">
                              {metric.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-green-700">{String(value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">{generatedStrategy.timeline}</p>
                  </div>
                </div>

                {/* Resources Needed */}
                {generatedStrategy.resources_needed && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recursos Necesarios</h4>
                    <ul className="space-y-1">
                      {generatedStrategy.resources_needed.map((resource, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          {String(resource)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Actions */}
                {generatedStrategy.next_actions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Próximas Acciones</h4>
                    <div className="space-y-2">
                      {generatedStrategy.next_actions.map((action, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                          <Play className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-800">{action}</span>
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
          {/* Framework Info */}
          {selectedFrameworkInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <selectedFrameworkInfo.icon className={`h-5 w-5 mr-2 ${selectedFrameworkInfo.color}`} />
                  {selectedFrameworkInfo.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedFrameworkInfo.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedFramework === 'perfect_webinar' && (
                    <>
                      <div>• Presentación de 90 minutos</div>
                      <div>• 5 fases estructuradas</div>
                      <div>• Manejo sistemático de objeciones</div>
                      <div>• Stack de valor optimizado</div>
                    </>
                  )}
                  {selectedFramework === 'value_ladder' && (
                    <>
                      <div>• 4 niveles de ofertas</div>
                      <div>• Maximiza customer LTV</div>
                      <div>• Progresín automática</div>
                      <div>• Múltiples puntos de entrada</div>
                    </>
                  )}
                  {selectedFramework === 'hook_story_offer' && (
                    <>
                      <div>• Hook para captar atención</div>
                      <div>• Story para conectar</div>
                      <div>• Offer para convertir</div>
                      <div>• Adaptable a cualquier plataforma</div>
                    </>
                  )}
                  {selectedFramework === 'dream_100' && (
                    <>
                      <div>• Identificar 100 influencers clave</div>
                      <div>• Estrategia de infiltración</div>
                      <div>• Construcción de relaciones</div>
                      <div>• Conversión en promotores</div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estrategias Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategies?.slice(0, 5).map(strategy => (
                  <div key={strategy.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {strategy.strategy_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {strategy.framework_used} • {clients?.find(c => c.id === strategy.client_id)?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(strategy.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={strategy.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!strategies || strategies.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay estrategias aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips de Estrategia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <p>Define objetivos específicos y medibles</p>
                </div>
                <div className="flex items-start">
                  <Users className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <p>Conoce profundamente a tu audiencia objetivo</p>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                  <p>Implementa por fases para mejores resultados</p>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <p>Mide y optimiza continuamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}