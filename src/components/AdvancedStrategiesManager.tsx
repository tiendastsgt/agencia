import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { formatCurrency } from '../utils/formatters';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Play, 
  Pause, 
  Settings, 
  BarChart3,
  Star,
  Crown,
  Zap,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  advancedStrategiesService, 
  Dream100Strategy, 
  ValueLadder, 
  WebinarScript,
  PsychologicalTrigger 
} from '../lib/advanced-strategies-service';

interface AdvancedStrategiesManagerProps {
  clientId: string;
}

export const AdvancedStrategiesManager: React.FC<AdvancedStrategiesManagerProps> = ({ clientId }) => {
  const [dream100Strategies, setDream100Strategies] = useState<Dream100Strategy[]>([]);
  const [valueLadders, setValueLadders] = useState<ValueLadder[]>([]);
  const [webinarScripts, setWebinarScripts] = useState<WebinarScript[]>([]);
  const [psychologicalTriggers, setPsychologicalTriggers] = useState<PsychologicalTrigger[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Dream100Strategy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  const dream100Phases = [
    { value: 'research', label: 'Investigación', progress: 25 },
    { value: 'engagement', label: 'Engagement', progress: 50 },
    { value: 'relationship', label: 'Relación', progress: 75 },
    { value: 'promotion', label: 'Promoción', progress: 100 }
  ];

  const valueLadderTypes = [
    { value: 'lead_magnet', label: 'Lead Magnet', icon: '🎯' },
    { value: 'tripwire', label: 'Tripwire', icon: '⚡' },
    { value: 'core_offer', label: 'Oferta Principal', icon: '💎' },
    { value: 'upsell', label: 'Upsell', icon: '⬆️' },
    { value: 'downsell', label: 'Downsell', icon: '⬇️' },
    { value: 'vip', label: 'VIP', icon: '👑' }
  ];

  const triggerCategories = [
    { value: 'urgency', label: 'Urgencia', color: 'bg-red-100 text-red-800' },
    { value: 'scarcity', label: 'Escasez', color: 'bg-orange-100 text-orange-800' },
    { value: 'social_proof', label: 'Prueba Social', color: 'bg-blue-100 text-blue-800' },
    { value: 'authority', label: 'Autoridad', color: 'bg-purple-100 text-purple-800' },
    { value: 'reciprocity', label: 'Reciprocidad', color: 'bg-green-100 text-green-800' },
    { value: 'commitment', label: 'Compromiso', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'liking', label: 'Simpatía', color: 'bg-pink-100 text-pink-800' }
  ];

  useEffect(() => {
    loadStrategies();
    loadPsychologicalTriggers();
  }, [clientId]);

  const loadStrategies = async () => {
    try {
      // Simular carga de estrategias
      const mockDream100: Dream100Strategy[] = [
        {
          id: '1',
          clientId,
          name: 'Dream 100 - Influencers Tech',
          targetAudience: 'Profesionales de tecnología',
          dream100List: [],
          currentPhase: 'research',
          progress: 25,
          results: {
            totalTargets: 100,
            contacted: 15,
            engaged: 8,
            partnerships: 2,
            advocates: 1,
            trafficGenerated: 2500,
            conversions: 45,
            roas: 2.8
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockValueLadder: ValueLadder[] = [
        {
          id: '1',
          clientId,
          name: 'Escalera de Valor - Marketing Digital',
          steps: [],
          currentStep: 0,
          conversionRates: {},
          totalRevenue: 15000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockWebinarScript: WebinarScript[] = [
        {
          id: '1',
          clientId,
          title: 'Webinar: Cómo Crear Campañas Exitosas',
          duration: 60,
          sections: [],
          psychologicalTriggers: ['urgency', 'authority', 'social_proof'],
          conversionGoals: [],
          performance: {
            totalRegistrations: 0,
            attendanceRate: 0,
            engagementScore: 0,
            conversionRate: 0,
            revenue: 0,
            feedback: []
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      setDream100Strategies(mockDream100);
      setValueLadders(mockValueLadder);
      setWebinarScripts(mockWebinarScript);
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  const loadPsychologicalTriggers = async () => {
    try {
      const triggers = await advancedStrategiesService.getAvailableTriggers();
      setPsychologicalTriggers(triggers);
    } catch (error) {
      console.error('Error loading psychological triggers:', error);
    }
  };

  const createDream100Strategy = async (strategyData: any) => {
    setIsCreating(true);
    try {
      const strategy = await advancedStrategiesService.implementDream100Strategy(
        clientId,
        strategyData.name,
        strategyData.targetAudience,
        strategyData.dream100List
      );
      setDream100Strategies(prev => [...prev, strategy]);
    } catch (error) {
      console.error('Error creating Dream 100 strategy:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const advanceDream100Phase = async (strategyId: string, newPhase: string) => {
    try {
      const updatedStrategy = await advancedStrategiesService.advanceDream100Phase(strategyId, newPhase);
      setDream100Strategies(prev => 
        prev.map(s => s.id === strategyId ? updatedStrategy : s)
      );
    } catch (error) {
      console.error('Error advancing Dream 100 phase:', error);
    }
  };

  const optimizeValueLadder = async (ladderId: string) => {
    try {
      const results = await advancedStrategiesService.optimizeValueLadder(ladderId);
      setOptimizationResults(results);
    } catch (error) {
      console.error('Error optimizing value ladder:', error);
    }
  };

  const createWebinarScript = async (scriptData: any) => {
    try {
      const script = await advancedStrategiesService.createWebinarScript(
        clientId,
        scriptData.title,
        scriptData.duration,
        scriptData.targetAudience
      );
      setWebinarScripts(prev => [...prev, script]);
    } catch (error) {
      console.error('Error creating webinar script:', error);
    }
  };

  const applyPsychologicalTriggers = async (content: string, targetAudience: string, goals: string[]) => {
    try {
      const result = await advancedStrategiesService.applyPsychologicalTriggers(content, targetAudience, goals);
      return result;
    } catch (error) {
      console.error('Error applying psychological triggers:', error);
      return null;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'engagement': return 'bg-yellow-100 text-yellow-800';
      case 'relationship': return 'bg-green-100 text-green-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Estrategias Avanzadas</h2>
          <p className="text-gray-600">Implementa estrategias de marketing de alto nivel</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Asistente IA
          </Button>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Nuevas Ideas
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dream100" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dream100">Dream 100</TabsTrigger>
          <TabsTrigger value="value-ladder">Escalera de Valor</TabsTrigger>
          <TabsTrigger value="webinar">Webinar Scripts</TabsTrigger>
          <TabsTrigger value="triggers">Triggers Psicológicos</TabsTrigger>
        </TabsList>

        <TabsContent value="dream100" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Estrategia Dream 100</h3>
            <Button onClick={() => setIsCreating(true)}>
              <Target className="h-4 w-4 mr-2" />
              Nueva Estrategia
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dream100Strategies.map(strategy => (
              <Card key={strategy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <Badge className={getPhaseColor(strategy.currentPhase)}>
                      {dream100Phases.find(p => p.value === strategy.currentPhase)?.label}
                    </Badge>
                  </div>
                  <CardDescription>
                    {strategy.targetAudience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progreso</span>
                      <span className="font-medium">{strategy.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${strategy.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Contactados</p>
                        <p className="font-medium">{strategy.results.contacted}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Partnerships</p>
                        <p className="font-medium">{strategy.results.partnerships}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tráfico</p>
                        <p className="font-medium">{strategy.results.trafficGenerated}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROAS</p>
                        <p className="font-medium text-green-600">
                          {strategy.results.roas.toFixed(1)}x
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        const currentPhaseIndex = dream100Phases.findIndex(p => p.value === strategy.currentPhase);
                        if (currentPhaseIndex < dream100Phases.length - 1) {
                          const nextPhase = dream100Phases[currentPhaseIndex + 1].value;
                          advanceDream100Phase(strategy.id, nextPhase);
                        }
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Avanzar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="value-ladder" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Escalera de Valor</h3>
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              Nueva Escalera
            </Button>
          </div>

          <div className="space-y-4">
            {valueLadders.map(ladder => (
              <Card key={ladder.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{ladder.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {ladder.steps.length} pasos
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => optimizeValueLadder(ladder.id)}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Optimizar
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Ingresos totales: {formatCurrency(ladder.totalRevenue)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ladder.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {valueLadderTypes.find(t => t.value === step.type)?.icon}
                          </span>
                          <div>
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-gray-600">
                              {valueLadderTypes.find(t => t.value === step.type)?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>Precio: {formatCurrency(step.price)}</span>
                            <span>Conversión: {(step.conversionRate * 100).toFixed(1)}%</span>
                            <span>Ingresos: {formatCurrency(step.revenue)}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          Paso {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {optimizationResults && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Optimización</CardTitle>
                <CardDescription>
                  Aumento esperado en ingresos: {formatCurrency(optimizationResults.expectedRevenueIncrease)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationResults.optimizations.map((opt: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Paso {index + 1}</h4>
                        <Badge variant={opt.improvement > 0 ? 'default' : 'destructive'}>
                          {opt.improvement > 0 ? '+' : ''}{(opt.improvement * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-600">Tasa Actual</p>
                          <p className="font-medium">{(opt.currentRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tasa Optimizada</p>
                          <p className="font-medium">{(opt.optimizedRate * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Recomendaciones:</p>
                        <ul className="text-sm space-y-1">
                          {opt.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="webinar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scripts de Webinar</h3>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Nuevo Script
            </Button>
          </div>

          <div className="space-y-4">
            {webinarScripts.map(script => (
              <Card key={script.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{script.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {script.duration} min
                      </Badge>
                      <Badge variant="outline">
                        {script.psychologicalTriggers.length} triggers
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Script optimizado con triggers psicológicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Triggers Psicológicos Aplicados</h4>
                      <div className="flex flex-wrap gap-2">
                        {script.psychologicalTriggers.map(trigger => (
                          <Badge 
                            key={trigger} 
                            className={triggerCategories.find(t => t.value === trigger)?.color}
                          >
                            {triggerCategories.find(t => t.value === trigger)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Registros</p>
                        <p className="font-medium">{script.performance.totalRegistrations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Asistencia</p>
                        <p className="font-medium">{(script.performance.attendanceRate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="font-medium">{(script.performance.engagementScore * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversión</p>
                        <p className="font-medium">{(script.performance.conversionRate * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Triggers Psicológicos</h3>
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Aplicar a Contenido
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psychologicalTriggers.map(trigger => (
              <Card key={trigger.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trigger.name}</CardTitle>
                    <Badge className={triggerCategories.find(t => t.value === trigger.category)?.color}>
                      {triggerCategories.find(t => t.value === trigger.category)?.label}
                    </Badge>
                  </div>
                  <CardDescription>
                    Efectividad: {(trigger.effectiveness * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{trigger.description}</p>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Ejemplos:</h4>
                      <ul className="text-sm space-y-1">
                        {trigger.examples.slice(0, 2).map((example, index) => (
                          <li key={index} className="text-gray-600">• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Mejores Usos:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trigger.bestUseCases.slice(0, 2).map((useCase, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
