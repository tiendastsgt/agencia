import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Play, Pause, BarChart3, Settings, Brain, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useActiveClient } from '@/lib/client-context'
import { useAuth } from '@/lib/authSimple'
import { CreateExperimentDialog } from '@/components/ab-testing/CreateExperimentDialog'
import { ExperimentMetrics } from '@/components/ab-testing/ExperimentMetrics'
import { supabase, MABExperiment } from '@/lib/supabase'
import { mabService } from '@/lib/mab-service'
import { toast } from '@/components/ui/sonner'

export default function ABTestingPage() {
  const { activeClient } = useActiveClient()
  const { session } = useAuth()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null)
  const [testingArm, setTestingArm] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: experiments, isLoading } = useQuery({
    queryKey: ['mab-experiments', activeClient?.id],
    queryFn: async () => {
      // Si no hay cliente activo, usar datos demo
      if (!activeClient) {
        return [
          {
            id: '1',
            client_id: activeClient?.id || '',
            name: 'Experimento A/B: Títulos de Facebook',
            description: 'Probando diferentes títulos para posts sobre prevención de piojos',
            experiment_type: 'content',
            status: 'active',
            arms: [
              {
                arm_id: 'arm-1',
                name: 'Título Emocional',
                configuration: {
                  title: '¡Protege a tus hijos de los piojos este regreso a clases!',
                  hook: 'Emocional',
                  cta: 'Comprar ahora'
                }
              },
              {
                arm_id: 'arm-2',
                name: 'Título Informativo',
                configuration: {
                  title: '5 consejos para prevenir piojos en niños',
                  hook: 'Educativo',
                  cta: 'Leer más'
                }
              }
            ],
            target_metric: 'engagement',
            total_traffic: 1250,
            start_date: '2025-09-05',
            end_date: '2025-09-20',
            created_by: 'system',
            created_at: '2025-09-05T00:00:00Z',
            updated_at: '2025-09-10T00:00:00Z',
            stats: {
              total_pulls: 1250,
              total_arms: 2,
              winning_arm: {
                arm_id: 'arm-1',
                arm_name: 'Título Emocional',
                conversion_rate: 0.12,
                pulls: 650
              },
              confidence_level: 'alta'
            }
          },
          {
            id: '2',
            client_id: activeClient?.id || '',
            name: 'Experimento A/B: Imágenes de Producto',
            description: 'Comparando diferentes imágenes del Shampoo Repelente Liendrex',
            experiment_type: 'content',
            status: 'active',
            arms: [
              {
                arm_id: 'arm-3',
                name: 'Imagen Familiar',
                configuration: {
                  image_type: 'family_using_product',
                  style: 'warm',
                  colors: 'natural'
                }
              },
              {
                arm_id: 'arm-4',
                name: 'Imagen Producto',
                configuration: {
                  image_type: 'product_focus',
                  style: 'clean',
                  colors: 'professional'
                }
              }
            ],
            target_metric: 'conversion',
            total_traffic: 890,
            start_date: '2025-09-08',
            end_date: '2025-09-25',
            created_by: 'system',
            created_at: '2025-09-08T00:00:00Z',
            updated_at: '2025-09-10T00:00:00Z',
            stats: {
              total_pulls: 890,
              total_arms: 2,
              winning_arm: {
                arm_id: 'arm-3',
                arm_name: 'Imagen Familiar',
                conversion_rate: 0.08,
                pulls: 445
              },
              confidence_level: 'media'
            }
          }
        ] as MABExperiment[]
      }
      
      // Si hay cliente activo, hacer consulta real a Supabase
      const { data, error } = await supabase
        .from('mab_experiments')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as MABExperiment[]
    },
    enabled: !!activeClient
  })

  const toggleExperimentMutation = useMutation({
    mutationFn: async ({ experimentId, newStatus }: { experimentId: string, newStatus: string }) => {
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mab-experiment-manager`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: experimentId,
          status: newStatus
        })
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar experimento')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mab-experiments'] })
      toast.success('Experimento actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar experimento: ' + error.message)
    }
  })

  // Test MAB Algorithm
  const testMABMutation = useMutation({
    mutationFn: async (experimentId: string) => {
      try {
        // Simulate user context
        const context = {
          userId: session?.user?.id || 'test-user',
          deviceType: 'desktop',
          timeOfDay: new Date().getHours() / 24,
          location: 'ES'
        }

        // Select arm using MAB algorithm
        const result = await mabService.selectArm({
          experimentId,
          context: {
            ...context,
            timestamp: Date.now()
          },
          userId: context.userId
        })

        setTestingArm(result.selectedArm)
        return result
      } catch (error) {
        throw new Error('Error al probar algoritmo MAB: ' + error.message)
      }
    },
    onSuccess: (result) => {
      toast.success(`Algoritmo MAB seleccionó: ${result.armName} (${result.algorithm})`)
      queryClient.invalidateQueries({ queryKey: ['mab-experiments'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  // Record reward for testing
  const recordRewardMutation = useMutation({
    mutationFn: async ({ experimentId, armId, reward }: { experimentId: string, armId: string, reward: number }) => {
      try {
        await mabService.recordReward({
          experimentId,
          armId,
          reward,
          context: {
            userId: session?.user?.id || 'test-user',
            deviceType: 'desktop',
            timeOfDay: new Date().getHours() / 24,
            timestamp: Date.now()
          },
          metadata: { test: true, timestamp: Date.now() }
        })

        setTestingArm(null)
        return { success: true }
      } catch (error) {
        throw new Error('Error al registrar recompensa: ' + error.message)
      }
    },
    onSuccess: () => {
      toast.success('Recompensa registrada correctamente')
      queryClient.invalidateQueries({ queryKey: ['mab-experiments'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary", 
      completed: "outline"
    }
    const labels: Record<string, string> = {
      active: "Activo",
      paused: "Pausado",
      completed: "Completado"
    }
    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  const calculateWinningArm = (arms: MABExperiment['mab_arm_performance']) => {
    if (!arms || arms.length === 0) return null
    return arms.reduce((best, current) => {
      const currentRate = current.pulls > 0 ? current.total_reward / current.pulls : 0
      const bestRate = best.pulls > 0 ? best.total_reward / best.pulls : 0
      return currentRate > bestRate ? current : best
    })
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">A/B Testing</h1>
          <p className="text-gray-600">Selecciona un cliente para gestionar experimentos MAB</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
          <p className="text-gray-600 mt-2">
            Optimización adaptativa con Multi-Armed Bandit para {activeClient.name}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Experimento
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments?.map((experiment: MABExperiment) => {
            const winningArm = calculateWinningArm(experiment.mab_arm_performance)
            const totalPulls = experiment.mab_arm_performance?.reduce((sum, arm) => sum + arm.pulls, 0) || 0
            
            return (
              <Card key={experiment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{experiment.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {experiment.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(experiment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <p className="font-medium capitalize">{experiment.experiment_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Métrica:</span>
                        <p className="font-medium uppercase">{experiment.target_metric}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tráfico total:</span>
                        <p className="font-medium">{totalPulls.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Brazos:</span>
                        <p className="font-medium">{experiment.mab_arm_performance?.length || 0}</p>
                      </div>
                    </div>

                    {winningArm && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Brazo líder:</strong> {winningArm.arm_name}
                        </p>
                        <p className="text-xs text-green-600">
                          Tasa de conversión: {winningArm.pulls > 0 ? 
                            ((winningArm.total_reward / winningArm.pulls) * 100).toFixed(2) : 0}%
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedExperiment(experiment.id)}
                          className="flex-1"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ver Métricas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExperimentMutation.mutate({
                            experimentId: experiment.id,
                            newStatus: experiment.status === 'active' ? 'paused' : 'active'
                          })}
                          disabled={toggleExperimentMutation.isPending}
                        >
                          {experiment.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {experiment.status === 'active' && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => testMABMutation.mutate(experiment.id)}
                            disabled={testMABMutation.isPending || testingArm === experiment.id}
                            className="flex-1"
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {testMABMutation.isPending ? 'Probando...' : 'Probar MAB'}
                          </Button>
                        </div>
                      )}

                      {testingArm && testingArm === experiment.id && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Algoritmo MAB seleccionó un brazo</strong>
                          </p>
                          <p className="text-xs text-blue-600 mb-3">
                            Simula el resultado del experimento:
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => recordRewardMutation.mutate({
                                experimentId: experiment.id,
                                armId: testingArm,
                                reward: 1
                              })}
                              disabled={recordRewardMutation.isPending}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Éxito
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => recordRewardMutation.mutate({
                                experimentId: experiment.id,
                                armId: testingArm,
                                reward: 0
                              })}
                              disabled={recordRewardMutation.isPending}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Fallo
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {(!experiments || experiments.length === 0) && (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <BarChart3 className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay experimentos A/B
              </h3>
              <p className="text-gray-600 mb-4">
                Crea tu primer experimento MAB para comenzar a optimizar tu contenido
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Experimento
              </Button>
            </div>
          )}
        </div>
      )}

      <CreateExperimentDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        clientId={activeClient.id}
      />

      {selectedExperiment && (
        <ExperimentMetrics 
          experimentId={selectedExperiment}
          open={!!selectedExperiment}
          onOpenChange={() => setSelectedExperiment(null)}
        />
      )}
    </div>
  )
}