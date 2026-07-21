import React from 'react'
import YouTubeAnalyticsManager from '@/components/YouTubeAnalyticsManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Youtube, ExternalLink, Settings, BarChart3, Users, Eye, DollarSign } from 'lucide-react'

export default function YouTubeAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-600" />
            YouTube Analytics Integration
          </h1>
          <p className="text-muted-foreground">
            Analíticas avanzadas de canal y videos de YouTube para optimizar tu contenido
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Analytics API v2
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Data API v3
          </Badge>
        </div>
      </div>

      {/* Información de la API */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Youtube className="h-5 w-5" />
            YouTube Analytics API v2
          </CardTitle>
          <CardDescription className="text-red-700">
            Integración completa con la API de YouTube Analytics para análisis de canal, videos, ingresos y rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-800">
            <div>
              <h4 className="font-semibold mb-2">Métricas Principales</h4>
              <ul className="space-y-1">
                <li>• Vistas y tiempo de visualización</li>
                <li>• Engagement (likes, comentarios, shares)</li>
                <li>• Suscriptores ganados/perdidos</li>
                <li>• Duración promedio de visualización</li>
                <li>• Vistas comprometidas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Análisis Avanzado</h4>
              <ul className="space-y-1">
                <li>• Ingresos estimados y monetización</li>
                <li>• Rendimiento de anuncios</li>
                <li>• Métricas de listas de reproducción</li>
                <li>• Análisis de transmisiones en vivo</li>
                <li>• Retención de audiencia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recursos</h4>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="https://developers.google.com/youtube/analytics" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    Analytics API Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://developers.google.com/youtube/v3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    Data API v3 <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://developers.google.com/youtube/analytics/reference/reports" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    Reports Reference <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-900">Análisis de Vistas</h3>
              <p className="text-sm text-blue-700">Métricas detalladas de visualizaciones y tiempo de visualización</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold text-green-900">Engagement</h3>
              <p className="text-sm text-green-700">Likes, comentarios, shares y crecimiento de suscriptores</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-900">Monetización</h3>
              <p className="text-sm text-purple-700">Ingresos estimados y rendimiento de anuncios</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-semibold text-orange-900">Contenido</h3>
              <p className="text-sm text-orange-700">Análisis de videos y listas de reproducción</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componente principal */}
      <YouTubeAnalyticsManager />
    </div>
  )
}
