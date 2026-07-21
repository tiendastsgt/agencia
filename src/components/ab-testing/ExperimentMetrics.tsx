import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/authSimple'
import { MABExperiment } from '@/lib/supabase'
import { MABMetrics } from './MABMetrics'
import { BarChart3, TrendingUp, Users, Target, Brain } from 'lucide-react'

interface ExperimentMetricsProps {
  experimentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExperimentMetrics({ experimentId, open, onOpenChange }: ExperimentMetricsProps) {
  const { session } = useAuth()
  
  const { data: experiment, isLoading } = useQuery({
    queryKey: ['mab-experiment-details', experimentId],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mab-experiment-manager?experiment_id=${experimentId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar detalles del experimento')
      }
      
      return response.json() as Promise<MABExperiment>
    },
    enabled: !!experimentId && open && !!session?.access_token
  })

  if (!experiment) return null

  const totalPulls = experiment.mab_arm_performance?.reduce((sum, arm) => sum + arm.pulls, 0) || 0
  const totalRewards = experiment.mab_arm_performance?.reduce((sum, arm) => sum + arm.rewards, 0) || 0
  const overallConversionRate = totalPulls > 0 ? (totalRewards / totalPulls) * 100 : 0

  // Ordenar brazos por rendimiento
  const sortedArms = experiment.mab_arm_performance?.sort((a, b) => {
    const aRate = a.pulls > 0 ? a.total_reward / a.pulls : 0
    const bRate = b.pulls > 0 ? b.total_reward / b.pulls : 0
    return bRate - aRate
  }) || []

  const winningArm = sortedArms[0]
  const maxPulls = Math.max(...sortedArms.map(arm => arm.pulls))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas del Experimento: {experiment.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* MAB Metrics Component */}
            <MABMetrics experimentId={experimentId} />

            {/* Información del Experimento */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Experimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium capitalize">{experiment.experiment_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Métrica Objetivo:</span>
                    <p className="font-medium uppercase">{experiment.target_metric}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="mt-1">
                      <Badge variant={experiment.status === 'active' ? 'default' : 'secondary'}>
                        {experiment.status === 'active' ? 'Activo' : experiment.status === 'paused' ? 'Pausado' : 'Completado'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Inicio:</span>
                    <p className="font-medium">
                      {new Date(experiment.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {experiment.description && (
                  <div className="mt-4">
                    <span className="text-gray-600">Descripción:</span>
                    <p className="mt-1">{experiment.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rendimiento de Brazos */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Brazos</CardTitle>
                <CardDescription>
                  Comparación del rendimiento de cada variante del experimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedArms.map((arm, index) => {
                    const conversionRate = arm.pulls > 0 ? (arm.total_reward / arm.pulls) * 100 : 0
                    const pullsPercentage = maxPulls > 0 ? (arm.pulls / maxPulls) * 100 : 0
                    const isWinner = index === 0 && arm.pulls > 0
                    
                    return (
                      <div key={arm.arm_id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{arm.arm_name}</h3>
                            {isWinner && (
                              <Badge variant="default" className="text-xs">
                                Líder
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{conversionRate.toFixed(2)}%</div>
                            <div className="text-xs text-gray-500">conversión</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Visitas:</span>
                            <p className="font-medium">{arm.pulls.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Conversiones:</span>
                            <p className="font-medium">{arm.rewards}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Valor Total:</span>
                            <p className="font-medium">{arm.total_reward.toFixed(3)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Distribución de tráfico</span>
                            <span>{pullsPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={pullsPercentage} className="h-2" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            {totalPulls > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recomendaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {totalPulls < 100 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Recolectar más datos:</strong> Con solo {totalPulls} visitas, se necesita más tráfico para obtener resultados confiables.
                        </p>
                      </div>
                    )}
                    
                    {winningArm && winningArm.pulls > 50 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Brazo ganador identificado:</strong> "{winningArm.arm_name}" muestra el mejor rendimiento con {((winningArm.total_reward / winningArm.pulls) * 100).toFixed(2)}% de conversión.
                        </p>
                      </div>
                    )}
                    
                    {totalPulls > 1000 && experiment.status === 'active' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Considerar finalización:</strong> Con {totalPulls.toLocaleString()} visitas, los resultados son confiables. Considera implementar la variante ganadora.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}