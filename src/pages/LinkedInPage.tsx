import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Linkedin, Users, TrendingUp, Calendar, MessageSquare } from 'lucide-react'

export default function LinkedInPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Linkedin className="h-8 w-8 text-blue-700" />
            LinkedIn Marketing
          </h1>
          <p className="text-muted-foreground">
            Gestión profesional de LinkedIn para empresas B2B
          </p>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-700">
          v2.2.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexiones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              +23 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <Linkedin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8K</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades de LinkedIn</CardTitle>
          <CardDescription>
            Gestión completa de tu presencia profesional en LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Implementado en v2.2.0</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Crear posts profesionales</li>
                <li>• Obtener analytics de posts</li>
                <li>• Buscar contenido por keywords</li>
                <li>• Gestión de conexiones</li>
                <li>• Análisis de sentimientos</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Próximamente v2.3.0</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Programación de posts</li>
                <li>• Análisis de competencia B2B</li>
                <li>• Lead generation automatizado</li>
                <li>• Reportes ejecutivos</li>
                <li>• Integración con CRM</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}