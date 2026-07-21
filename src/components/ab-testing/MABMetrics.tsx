import React, { useState, useEffect } from 'react'
import { UPDATE_INTERVALS } from '../../lib/constants'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, Target, TrendingUp, Users, Zap } from 'lucide-react'
import { mabService } from '@/lib/mab-service'

interface MABMetricsProps {
  experimentId: string
}

export function MABMetrics({ experimentId }: MABMetricsProps) {
  const [refreshInterval, setRefreshInterval] = useState(UPDATE_INTERVALS.MAB_REFRESH)

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['mab-stats', experimentId],
    queryFn: () => mabService.getExperimentStats(experimentId),
    refetchInterval: refreshInterval,
    enabled: !!experimentId
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error al cargar métricas MAB</p>
        </CardContent>
      </Card>
    )
  }

  const { experiment, stats: mabStats, arms } = stats

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'alta': return 'bg-green-100 text-green-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baja': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'Epsilon-Greedy': return <Target className="h-4 w-4" />
      case 'Upper Confidence Bound': return <TrendingUp className="h-4 w-4" />
      case 'Thompson Sampling': return <Brain className="h-4 w-4" />
      case 'Contextual Bandit (LinUCB)': return <Zap className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pulls</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mabStats.totalPulls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Interacciones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensa Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mabStats.totalRewards.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Valor acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(mabStats.averageReward * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Rendimiento general
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confianza</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getConfidenceColor(mabStats.confidence)}>
              {mabStats.confidence.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Nivel de confianza
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getAlgorithmIcon(experiment.algorithm)}
            Algoritmo: {experiment.algorithm}
          </CardTitle>
          <CardDescription>
            {experiment.name} - {experiment.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Regret:</span>
              <p className="font-medium">{mabStats.regret.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Brazo Ganador:</span>
              <p className="font-medium">{mabStats.bestArm}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arms Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rendimiento de Brazos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arms.map((arm, index) => {
            const conversionRate = arm.pulls > 0 ? (arm.rewards / arm.pulls) * 100 : 0
            const isWinning = arm.id === mabStats.bestArm
            
            return (
              <Card key={arm.id} className={isWinning ? 'ring-2 ring-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{arm.name}</CardTitle>
                    {isWinning && (
                      <Badge className="bg-green-100 text-green-800">
                        Ganador
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pulls:</span>
                      <p className="font-medium">{arm.pulls}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recompensas:</span>
                      <p className="font-medium">{arm.rewards}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Promedio:</span>
                      <p className="font-medium">{(arm.averageReward * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversión:</span>
                      <p className="font-medium">{conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasa de Conversión</span>
                      <span>{conversionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Auto-refresh toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Actualización automática cada {refreshInterval / 1000} segundos
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRefreshInterval(refreshInterval === UPDATE_INTERVALS.MAB_REFRESH ? 0 : UPDATE_INTERVALS.MAB_REFRESH)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {refreshInterval === UPDATE_INTERVALS.MAB_REFRESH ? 'Pausar' : 'Reanudar'} Auto-refresh
          </button>
        </div>
      </div>
    </div>
  )
}













