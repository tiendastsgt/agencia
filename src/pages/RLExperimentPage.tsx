import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Brain, 
  Play, 
  Pause, 
  Square, 
  Plus, 
  BarChart3, 
  Settings, 
  TrendingUp,
  Target,
  Zap,
  Activity
} from 'lucide-react'
import { useAuth } from '@/lib/authSimple'
import { useActiveClient } from '@/lib/client-context'
import { rlService } from '@/lib/rl-service'
import { promptRewriteService } from '@/lib/prompt-rewrite-rl'
import { PromptRewriteConfig } from '@/lib/prompt-rewrite-rl'

interface RLExperiment {
  id: string
  name: string
  description: string
  algorithm_type: 'q-learning' | 'policy-gradient'
  reward_type: 'exact_match' | 'f1_score' | 'perplexity' | 'perplexity_f1' | 'length_diff' | 'engagement' | 'conversion'
  config: any
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
  user_id: string
  client_id: string
}

export default function RLExperimentPage() {
  const { user } = useAuth()
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<RLExperiment | null>(null)
  const [isRunningExperiment, setIsRunningExperiment] = useState(false)

  // Fetch experiments
  const { data: experiments = [], isLoading } = useQuery({
    queryKey: ['rl-experiments', user?.id, activeClient?.id],
    queryFn: async () => {
      // Datos demo de Liendrex
      return [
        {
          id: '1',
          name: 'Optimización de Prompts - Prevención Piojos',
          description: 'Optimización automática de prompts para contenido educativo sobre prevención de piojos',
          algorithm_type: 'q-learning' as const,
          reward_type: 'engagement' as const,
          config: {
            maxIterations: 15,
            learningRate: 0.1,
            epsilon: 0.1,
            epsilonDecay: 0.995
          },
          status: 'active' as const,
          created_at: '2025-09-05T00:00:00Z',
          updated_at: '2025-09-10T00:00:00Z',
          user_id: user?.id || '',
          client_id: activeClient?.id || ''
        },
        {
          id: '2',
          name: 'Optimización de Prompts - Productos Naturales',
          description: 'Mejora automática de prompts para destacar beneficios de productos sin insecticidas',
          algorithm_type: 'policy-gradient' as const,
          reward_type: 'conversion' as const,
          config: {
            maxIterations: 20,
            learningRate: 0.05,
            epsilon: 0.15,
            epsilonDecay: 0.99
          },
          status: 'completed' as const,
          created_at: '2025-09-01T00:00:00Z',
          updated_at: '2025-09-08T00:00:00Z',
          user_id: user?.id || '',
          client_id: activeClient?.id || ''
        }
      ]
    },
    enabled: !!user?.id
  })

  // Create experiment mutation
  const createExperimentMutation = useMutation({
    mutationFn: async (experimentData: Omit<RLExperiment, 'id' | 'created_at' | 'updated_at'>) => {
      return await rlService.createExperiment(experimentData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rl-experiments'] })
      setIsCreateDialogOpen(false)
      toast.success('Experimento RL creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al crear experimento: ${error.message}`)
    }
  })

  // Run experiment mutation
  const runExperimentMutation = useMutation({
    mutationFn: async (experimentId: string) => {
      setIsRunningExperiment(true)
      try {
        // Create a prompt rewrite session
        const config: PromptRewriteConfig = {
          algorithm: 'q-learning',
          rewardType: 'f1_score',
          maxIterations: 10,
          learningRate: 0.1,
          epsilon: 0.1,
          epsilonDecay: 0.995
        }

        const session = await promptRewriteService.createSession(
          'Write a compelling social media post about AI',
          config,
          'Optimize this prompt for maximum engagement'
        )

        // Run the rewrite process
        const result = await promptRewriteService.rewritePrompt(session.id)
        
        return result
      } finally {
        setIsRunningExperiment(false)
      }
    },
    onSuccess: (result) => {
      toast.success(`Experimento completado. Mejor recompensa: ${result.bestReward.toFixed(3)}`)
      queryClient.invalidateQueries({ queryKey: ['rl-experiments'] })
    },
    onError: (error: any) => {
      toast.error(`Error al ejecutar experimento: ${error.message}`)
    }
  })

  const handleCreateExperiment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (!user?.id || !activeClient?.id) return

    const experimentData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      algorithm_type: formData.get('algorithm_type') as 'q-learning' | 'policy-gradient',
      reward_type: formData.get('reward_type') as any,
      config: {
        maxIterations: parseInt(formData.get('maxIterations') as string) || 10,
        learningRate: parseFloat(formData.get('learningRate') as string) || 0.1,
        epsilon: parseFloat(formData.get('epsilon') as string) || 0.1,
        epsilonDecay: parseFloat(formData.get('epsilonDecay') as string) || 0.995
      },
      status: 'active' as const,
      user_id: user.id,
      client_id: activeClient.id
    }

    createExperimentMutation.mutate(experimentData)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      paused: 'outline'
    } as const

    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'q-learning':
        return <Brain className="h-4 w-4" />
      case 'policy-gradient':
        return <Target className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getRewardTypeIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'exact_match':
        return <Target className="h-4 w-4" />
      case 'f1_score':
        return <BarChart3 className="h-4 w-4" />
      case 'engagement':
        return <TrendingUp className="h-4 w-4" />
      case 'conversion':
        return <Activity className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando experimentos RL...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reinforcement Learning</h1>
          <p className="text-gray-600 mt-2">
            Optimización automática de prompts usando algoritmos de aprendizaje por refuerzo
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Experimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Experimento RL</DialogTitle>
              <DialogDescription>
                Configura un nuevo experimento de Reinforcement Learning para optimizar prompts
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateExperiment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Experimento</Label>
                  <Input id="name" name="name" placeholder="Mi Experimento RL" required />
                </div>
                <div>
                  <Label htmlFor="algorithm_type">Algoritmo</Label>
                  <Select name="algorithm_type" defaultValue="q-learning">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar algoritmo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q-learning">Q-Learning</SelectItem>
                      <SelectItem value="policy-gradient">Policy Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe el objetivo de este experimento..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="reward_type">Tipo de Recompensa</Label>
                <Select name="reward_type" defaultValue="f1_score">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de recompensa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact_match">Exact Match</SelectItem>
                    <SelectItem value="f1_score">F1 Score</SelectItem>
                    <SelectItem value="perplexity">Perplexity</SelectItem>
                    <SelectItem value="perplexity_f1">Perplexity + F1</SelectItem>
                    <SelectItem value="length_diff">Length Difference</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxIterations">Máximo de Iteraciones</Label>
                  <Input 
                    id="maxIterations" 
                    name="maxIterations" 
                    type="number" 
                    defaultValue="10" 
                    min="1" 
                    max="100" 
                  />
                </div>
                <div>
                  <Label htmlFor="learningRate">Learning Rate</Label>
                  <Input 
                    id="learningRate" 
                    name="learningRate" 
                    type="number" 
                    step="0.01" 
                    defaultValue="0.1" 
                    min="0.01" 
                    max="1" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="epsilon">Epsilon (Exploración)</Label>
                  <Input 
                    id="epsilon" 
                    name="epsilon" 
                    type="number" 
                    step="0.01" 
                    defaultValue="0.1" 
                    min="0" 
                    max="1" 
                  />
                </div>
                <div>
                  <Label htmlFor="epsilonDecay">Epsilon Decay</Label>
                  <Input 
                    id="epsilonDecay" 
                    name="epsilonDecay" 
                    type="number" 
                    step="0.001" 
                    defaultValue="0.995" 
                    min="0.9" 
                    max="1" 
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createExperimentMutation.isPending}
                >
                  {createExperimentMutation.isPending ? 'Creando...' : 'Crear Experimento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experiments Grid */}
      {experiments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay experimentos RL
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Crea tu primer experimento de Reinforcement Learning para optimizar prompts automáticamente
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Experimento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getAlgorithmIcon(experiment.algorithm_type)}
                    <CardTitle className="text-lg">{experiment.name}</CardTitle>
                  </div>
                  {getStatusBadge(experiment.status)}
                </div>
                <CardDescription className="line-clamp-2">
                  {experiment.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    {getRewardTypeIcon(experiment.reward_type)}
                    <span className="text-gray-600">
                      {experiment.reward_type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(experiment.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Algoritmo:</span>
                    <span className="font-medium">{experiment.algorithm_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Iteraciones:</span>
                    <span className="font-medium">{experiment.config.maxIterations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Learning Rate:</span>
                    <span className="font-medium">{experiment.config.learningRate}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => runExperimentMutation.mutate(experiment.id)}
                    disabled={runExperimentMutation.isPending || isRunningExperiment}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {runExperimentMutation.isPending ? 'Ejecutando...' : 'Ejecutar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedExperiment(experiment)}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>

                {isRunningExperiment && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso:</span>
                      <span>Optimizando prompts...</span>
                    </div>
                    <Progress value={33} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Experiment Details Dialog */}
      {selectedExperiment && (
        <Dialog open={!!selectedExperiment} onOpenChange={() => setSelectedExperiment(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedExperiment.name}</DialogTitle>
              <DialogDescription>
                Detalles y métricas del experimento de Reinforcement Learning
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Algoritmo:</span>
                      <span className="font-medium">{selectedExperiment.algorithm_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recompensa:</span>
                      <span className="font-medium">{selectedExperiment.reward_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Iteraciones:</span>
                      <span className="font-medium">{selectedExperiment.config.maxIterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Rate:</span>
                      <span className="font-medium">{selectedExperiment.config.learningRate}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      {getStatusBadge(selectedExperiment.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Creado:</span>
                      <span className="font-medium">
                        {new Date(selectedExperiment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualizado:</span>
                      <span className="font-medium">
                        {new Date(selectedExperiment.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Las métricas se mostrarán después de ejecutar el experimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

