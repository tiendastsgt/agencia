import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Target, TrendingUp, Brain, Zap, BarChart3 } from 'lucide-react'

export default function PremiumStrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Estrategias Premium
          </h1>
          <p className="text-muted-foreground">
            Estrategias avanzadas de marketing digital con IA
          </p>
        </div>
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Premium
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              IA Predictiva
            </CardTitle>
            <CardDescription>
              Predicción de tendencias y comportamiento del consumidor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Análisis de sentimientos avanzado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Predicción de tendencias
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Optimización automática
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Segmentación inteligente
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Targeting Avanzado
            </CardTitle>
            <CardDescription>
              Segmentación precisa y personalización de audiencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Lookalike audiences
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Segmentación por comportamiento
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                IA para optimización
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Predicción de conversión
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Automatización
            </CardTitle>
            <CardDescription>
              Automatización inteligente de campañas y respuestas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Programación inteligente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Respuestas automáticas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Optimización en tiempo real
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                A/B testing automático
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estrategias Especializadas</CardTitle>
          <CardDescription>
            Estrategias específicas para el mercado guatemalteco
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg">🇬🇹 Mercado Guatemalteco</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">E-commerce Local</h5>
                  <p className="text-sm text-muted-foreground">
                    Estrategias para tiendas online guatemaltecas
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Servicios Financieros</h5>
                  <p className="text-sm text-muted-foreground">
                    Marketing para bancos y fintech locales
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Turismo</h5>
                  <p className="text-sm text-muted-foreground">
                    Promoción de destinos turísticos
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-lg">📊 Métricas Premium</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">ROI Predictivo</h5>
                  <p className="text-sm text-muted-foreground">
                    Predicción de retorno de inversión
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Lifetime Value</h5>
                  <p className="text-sm text-muted-foreground">
                    Análisis del valor de vida del cliente
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Competencia</h5>
                  <p className="text-sm text-muted-foreground">
                    Análisis de competencia en tiempo real
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Implementación</CardTitle>
          <CardDescription>
            Progreso de las funcionalidades premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Análisis de Sentimientos</span>
              <Badge className="bg-green-500">Completado</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generación de Imágenes</span>
              <Badge className="bg-green-500">Completado</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Predicción de Tendencias</span>
              <Badge className="bg-yellow-500">En Desarrollo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Optimización Automática</span>
              <Badge className="bg-yellow-500">En Desarrollo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Análisis de Competencia</span>
              <Badge className="bg-gray-500">Planificado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}