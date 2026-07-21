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
import { Switch } from './ui/switch';
import { 
  Dna, 
  Brain, 
  Zap, 
  BarChart3, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Cpu,
  GitBranch,
  Layers
} from 'lucide-react';
import { 
  advancedOptimizationService, 
  GeneticAlgorithmConfig, 
  BayesianOptimizationConfig, 
  EvoPromptConfig,
  PromptVersion 
} from '../lib/advanced-optimization-service';

interface AdvancedOptimizationManagerProps {
  clientId: string;
}

export const AdvancedOptimizationManager: React.FC<AdvancedOptimizationManagerProps> = ({ clientId }) => {
  const [geneticAlgorithms, setGeneticAlgorithms] = useState<GeneticAlgorithmConfig[]>([]);
  const [bayesianOptimizations, setBayesianOptimizations] = useState<BayesianOptimizationConfig[]>([]);
  const [evoPrompts, setEvoPrompts] = useState<EvoPromptConfig[]>([]);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<GeneticAlgorithmConfig | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [comparisonResults, setComparisonResults] = useState<any>(null);

  const algorithmTypes = [
    { value: 'genetic', label: 'Algoritmo Genético', icon: '🧬', description: 'Optimización evolutiva' },
    { value: 'bayesian', label: 'Optimización Bayesiana', icon: '📊', description: 'Optimización probabilística' },
    { value: 'evoprompt', label: 'EvoPrompt', icon: '🤖', description: 'Evolución de prompts' }
  ];

  const fitnessFunctions = [
    { value: 'engagement_rate', label: 'Tasa de Engagement' },
    { value: 'conversion_rate', label: 'Tasa de Conversión' },
    { value: 'click_through_rate', label: 'Tasa de Clics' },
    { value: 'cost_per_acquisition', label: 'Costo por Adquisición' }
  ];

  const acquisitionFunctions = [
    { value: 'ei', label: 'Expected Improvement' },
    { value: 'pi', label: 'Probability of Improvement' },
    { value: 'ucb', label: 'Upper Confidence Bound' }
  ];

  const mutationOperators = [
    { value: 'add_emojis', label: 'Agregar Emojis' },
    { value: 'add_urgency', label: 'Agregar Urgencia' },
    { value: 'add_social_proof', label: 'Agregar Prueba Social' },
    { value: 'shorten', label: 'Acortar' },
    { value: 'lengthen', label: 'Alargar' }
  ];

  useEffect(() => {
    loadOptimizations();
    loadPromptVersions();
  }, [clientId]);

  const loadOptimizations = async () => {
    try {
      // Simular carga de optimizaciones
      const mockGenetic: GeneticAlgorithmConfig[] = [
        {
          id: '1',
          name: 'Optimización de Engagement',
          populationSize: 50,
          generations: 100,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          selectionMethod: 'tournament',
          fitnessFunction: 'engagement_rate',
          parameters: [],
          status: 'completed'
        }
      ];

      const mockBayesian: BayesianOptimizationConfig[] = [
        {
          id: '1',
          name: 'Optimización de Conversiones',
          objectiveFunction: 'maximize_conversions',
          parameters: [],
          acquisitionFunction: 'ei',
          nInitialPoints: 10,
          nIterations: 50,
          status: 'running'
        }
      ];

      const mockEvoPrompt: EvoPromptConfig[] = [
        {
          id: '1',
          name: 'Evolución de Prompts de Venta',
          basePrompt: 'Descubre cómo aumentar tus ventas...',
          mutationOperators: ['add_urgency', 'add_social_proof'],
          fitnessMetrics: ['clarity', 'engagement', 'conversion_potential'],
          populationSize: 20,
          generations: 30,
          status: 'completed'
        }
      ];

      setGeneticAlgorithms(mockGenetic);
      setBayesianOptimizations(mockBayesian);
      setEvoPrompts(mockEvoPrompt);
    } catch (error) {
      console.error('Error loading optimizations:', error);
    }
  };

  const loadPromptVersions = async () => {
    try {
      // Simular carga de versiones de prompts
      const mockVersions: PromptVersion[] = [
        {
          id: '1',
          version: 'v1.0',
          prompt: 'Descubre cómo aumentar tus ventas con marketing digital...',
          performance: {
            engagement_rate: 0.065,
            conversion_rate: 0.024,
            click_through_rate: 0.035
          },
          createdAt: new Date(),
          isActive: true
        },
        {
          id: '2',
          version: 'v1.1',
          prompt: '🚀 ¡Descubre cómo aumentar tus ventas con marketing digital! Más de 10,000 clientes satisfechos...',
          performance: {
            engagement_rate: 0.082,
            conversion_rate: 0.031,
            click_through_rate: 0.042
          },
          createdAt: new Date(),
          isActive: false
        }
      ];
      setPromptVersions(mockVersions);
    } catch (error) {
      console.error('Error loading prompt versions:', error);
    }
  };

  const runGeneticAlgorithm = async (config: GeneticAlgorithmConfig) => {
    setIsRunning(true);
    try {
      const results = await advancedOptimizationService.runGeneticAlgorithm(config);
      setResults(results);
    } catch (error) {
      console.error('Error running genetic algorithm:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runBayesianOptimization = async (config: BayesianOptimizationConfig) => {
    setIsRunning(true);
    try {
      const results = await advancedOptimizationService.runBayesianOptimization(config);
      setResults(results);
    } catch (error) {
      console.error('Error running Bayesian optimization:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runEvoPrompt = async (config: EvoPromptConfig) => {
    setIsRunning(true);
    try {
      const results = await advancedOptimizationService.runEvoPrompt(config);
      setResults(results);
    } catch (error) {
      console.error('Error running EvoPrompt:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const comparePromptVersions = async () => {
    try {
      const comparison = await advancedOptimizationService.comparePromptVersions(promptVersions);
      setComparisonResults(comparison);
    } catch (error) {
      console.error('Error comparing prompt versions:', error);
    }
  };

  const createPromptVersion = async (prompt: string, performance: Record<string, number>) => {
    try {
      const version = await advancedOptimizationService.createPromptVersion(prompt, performance);
      setPromptVersions(prev => [...prev, version]);
    } catch (error) {
      console.error('Error creating prompt version:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPerformance = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Optimización Avanzada</h2>
          <p className="text-gray-600">Algoritmos de IA para optimización automática</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={comparePromptVersions}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparar Versiones
          </Button>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Nuevo Algoritmo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="genetic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="genetic">Algoritmos Genéticos</TabsTrigger>
          <TabsTrigger value="bayesian">Optimización Bayesiana</TabsTrigger>
          <TabsTrigger value="evoprompt">EvoPrompt</TabsTrigger>
          <TabsTrigger value="versions">Versiones de Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="genetic" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Algoritmos Genéticos</h3>
            <Button>
              <Dna className="h-4 w-4 mr-2" />
              Nuevo Algoritmo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geneticAlgorithms.map(algorithm => (
              <Card key={algorithm.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                    <Badge className={getStatusColor(algorithm.status)}>
                      {algorithm.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {fitnessFunctions.find(f => f.value === algorithm.fitnessFunction)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Población</p>
                        <p className="font-medium">{algorithm.populationSize}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Generaciones</p>
                        <p className="font-medium">{algorithm.generations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mutación</p>
                        <p className="font-medium">{(algorithm.mutationRate * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cruce</p>
                        <p className="font-medium">{(algorithm.crossoverRate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => runGeneticAlgorithm(algorithm)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bayesian" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Optimización Bayesiana</h3>
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Nueva Optimización
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bayesianOptimizations.map(optimization => (
              <Card key={optimization.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{optimization.name}</CardTitle>
                    <Badge className={getStatusColor(optimization.status)}>
                      {optimization.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {optimization.objectiveFunction}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Puntos Iniciales</p>
                        <p className="font-medium">{optimization.nInitialPoints}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Iteraciones</p>
                        <p className="font-medium">{optimization.nIterations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Función</p>
                        <p className="font-medium">
                          {acquisitionFunctions.find(f => f.value === optimization.acquisitionFunction)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Parámetros</p>
                        <p className="font-medium">{optimization.parameters.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => runBayesianOptimization(optimization)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evoprompt" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">EvoPrompt</h3>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Nuevo EvoPrompt
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evoPrompts.map(evoPrompt => (
              <Card key={evoPrompt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{evoPrompt.name}</CardTitle>
                    <Badge className={getStatusColor(evoPrompt.status)}>
                      {evoPrompt.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {evoPrompt.mutationOperators.length} operadores de mutación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Prompt Base:</p>
                      <p className="text-sm bg-gray-100 p-2 rounded">
                        {evoPrompt.basePrompt.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Población</p>
                        <p className="font-medium">{evoPrompt.populationSize}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Generaciones</p>
                        <p className="font-medium">{evoPrompt.generations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Métricas</p>
                        <p className="font-medium">{evoPrompt.fitnessMetrics.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Operadores</p>
                        <p className="font-medium">{evoPrompt.mutationOperators.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => runEvoPrompt(evoPrompt)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Versiones de Prompts</h3>
            <Button>
              <GitBranch className="h-4 w-4 mr-2" />
              Nueva Versión
            </Button>
          </div>

          <div className="space-y-4">
            {promptVersions.map(version => (
              <Card key={version.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{version.version}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {version.isActive && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activa
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Prompt:</p>
                      <p className="text-sm bg-gray-100 p-3 rounded">
                        {version.prompt}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="font-medium text-green-600">
                          {formatPerformance(version.performance.engagement_rate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversión</p>
                        <p className="font-medium text-blue-600">
                          {formatPerformance(version.performance.conversion_rate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CTR</p>
                        <p className="font-medium text-purple-600">
                          {formatPerformance(version.performance.click_through_rate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Score Total</p>
                        <p className="font-medium">
                          {(
                            (version.performance.engagement_rate * 0.3) +
                            (version.performance.conversion_rate * 0.4) +
                            (version.performance.click_through_rate * 0.3)
                          * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {comparisonResults && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Versiones</CardTitle>
                <CardDescription>
                  Mejor versión: {comparisonResults.bestVersion.version}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonResults.comparison.map((comp: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{comp.version}</h4>
                        <Badge variant={comp.version === comparisonResults.bestVersion.version ? 'default' : 'outline'}>
                          Score: {comp.overallScore.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(comp.metrics).map(([metric, value]) => (
                          <div key={metric}>
                            <p className="text-sm text-gray-600 capitalize">
                              {metric.replace('_', ' ')}
                            </p>
                            <p className="font-medium">
                              {formatPerformance(value as number)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Optimización</CardTitle>
            <CardDescription>
              Tiempo de ejecución: {results.executionTime}ms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mejor Fitness</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.bestFitness?.toFixed(3) || results.bestObjective?.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Generaciones/Iteraciones</p>
                  <p className="text-2xl font-bold">
                    {results.convergenceGeneration || results.nEvaluations}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fitness Promedio</p>
                  <p className="text-2xl font-bold">
                    {results.averageFitness?.toFixed(3) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mejora</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.improvementRate ? `+${(results.improvementRate * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
              
              {results.fitnessHistory && (
                <div>
                  <h4 className="font-medium mb-2">Historial de Fitness</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-end space-x-1 p-2">
                    {results.fitnessHistory.slice(-20).map((fitness: number, index: number) => (
                      <div
                        key={index}
                        className="bg-blue-500 flex-1 rounded-t"
                        style={{ height: `${(fitness / Math.max(...results.fitnessHistory)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.bestPrompt && (
                <div>
                  <h4 className="font-medium mb-2">Mejor Prompt Generado</h4>
                  <p className="text-sm bg-gray-100 p-3 rounded">
                    {results.bestPrompt}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
