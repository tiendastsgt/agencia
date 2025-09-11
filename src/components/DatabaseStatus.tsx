import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface TableStatus {
  name: string
  exists: boolean
  count: number
  error?: string
}

export default function DatabaseStatus() {
  const [tables, setTables] = useState<TableStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const tableNames = [
    // Tablas principales (6)
    'clients',
    'campaigns', 
    'content',
    'analytics',
    'market_research',
    'strategies',
    
    // Tablas de Multi-Armed Bandit (4)
    'mab_experiments',
    'mab_arm_performance',
    'mab_selections',
    'mab_rewards',
    
    // Tablas de Reinforcement Learning (4)
    'rl_experiments',
    'rl_episodes',
    'rl_rewards',
    'rl_policies',
    
    // Tablas de Prompt Rewrite (1)
    'prompt_rewrite_sessions'
  ]

  const checkTables = async () => {
    setIsChecking(true)
    const results: TableStatus[] = []

    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })

        if (error) {
          results.push({
            name: tableName,
            exists: false,
            count: 0,
            error: error.message
          })
        } else {
          results.push({
            name: tableName,
            exists: true,
            count: count || 0
          })
        }
      } catch (err) {
        results.push({
          name: tableName,
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Error desconocido'
        })
      }
    }

    setTables(results)
    setIsChecking(false)
  }

  useEffect(() => {
    checkTables()
  }, [])

  const existingTables = tables.filter(t => t.exists)
  const missingTables = tables.filter(t => !t.exists)

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Estado Completo de la Base de Datos
        </CardTitle>
        <CardDescription>
          Verificación del estado de las 15 tablas del sistema (Principales, MAB, RL y Prompt Rewrite)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {existingTables.length} Existentes
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-500" />
              {missingTables.length} Faltantes
            </Badge>
          </div>
          <Button onClick={checkTables} disabled={isChecking} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>

        <div className="space-y-6">
          {/* Tablas Existentes por Categoría */}
          {existingTables.length > 0 && (
            <div>
              <h3 className="font-medium text-green-700 mb-3">✅ Tablas Existentes ({existingTables.length}/15)</h3>
              
              {/* Tablas Principales */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Tablas Principales (6)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {existingTables.filter(t => ['clients', 'campaigns', 'content', 'analytics', 'market_research', 'strategies'].includes(t.name)).map((table) => (
                    <div key={table.name} className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                      <span className="font-mono text-sm">{table.name}</span>
                      <Badge variant="outline" className="text-green-700 text-xs">
                        {table.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablas MAB */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🧪 Multi-Armed Bandit (4)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {existingTables.filter(t => ['mab_experiments', 'mab_arm_performance', 'mab_selections', 'mab_rewards'].includes(t.name)).map((table) => (
                    <div key={table.name} className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                      <span className="font-mono text-sm">{table.name}</span>
                      <Badge variant="outline" className="text-blue-700 text-xs">
                        {table.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablas RL */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🤖 Reinforcement Learning (4)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {existingTables.filter(t => ['rl_experiments', 'rl_episodes', 'rl_rewards', 'rl_policies'].includes(t.name)).map((table) => (
                    <div key={table.name} className="flex justify-between items-center p-2 bg-purple-50 rounded border border-purple-200">
                      <span className="font-mono text-sm">{table.name}</span>
                      <Badge variant="outline" className="text-purple-700 text-xs">
                        {table.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablas Prompt Rewrite */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">✍️ Prompt Rewrite (1)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {existingTables.filter(t => ['prompt_rewrite_sessions'].includes(t.name)).map((table) => (
                    <div key={table.name} className="flex justify-between items-center p-2 bg-orange-50 rounded border border-orange-200">
                      <span className="font-mono text-sm">{table.name}</span>
                      <Badge variant="outline" className="text-orange-700 text-xs">
                        {table.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tablas Faltantes */}
          {missingTables.length > 0 && (
            <div>
              <h3 className="font-medium text-red-700 mb-3">❌ Tablas Faltantes ({missingTables.length}/15)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {missingTables.map((table) => (
                  <div key={table.name} className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">{table.name}</span>
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    {table.error && (
                      <p className="text-xs text-red-600 mt-1">{table.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {tables.length === 0 && !isChecking && (
          <div className="text-center py-8 text-gray-500">
            Haz clic en "Verificar" para comprobar el estado de las tablas
          </div>
        )}

        {isChecking && (
          <div className="text-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Verificando tablas...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
