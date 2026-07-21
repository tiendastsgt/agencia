import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Twitter, Calendar, Users, TrendingUp } from 'lucide-react'

export default function TwitterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Twitter className="h-8 w-8 text-blue-500" />
            Twitter/X Analytics
          </h1>
          <p className="text-muted-foreground">
            Gestión completa de tu cuenta de Twitter/X
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          v2.2.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguidores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tweets</CardTitle>
            <Twitter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades de Twitter/X</CardTitle>
          <CardDescription>
            Gestión completa de tu presencia en Twitter/X
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Implementado en v2.2.0</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Crear tweets con texto y media</li>
                <li>• Obtener timeline y métricas</li>
                <li>• Buscar tweets por hashtag</li>
                <li>• Obtener trending topics</li>
                <li>• Análisis de sentimientos</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Próximamente v2.3.0</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Programación de tweets</li>
                <li>• Análisis de competencia</li>
                <li>• Predicción de tendencias</li>
                <li>• Automatización de respuestas</li>
                <li>• Reportes avanzados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}