import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Facebook, Instagram, Calendar, Users, TrendingUp, Heart } from 'lucide-react'

export default function FacebookInstagramPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Facebook className="h-8 w-8 text-blue-600" />
              <Instagram className="h-8 w-8 text-pink-500" />
            </div>
            Facebook & Instagram
          </h1>
          <p className="text-muted-foreground">
            Gestión unificada de Facebook e Instagram
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          v2.2.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguidores FB</CardTitle>
            <Facebook className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguidores IG</CardTitle>
            <Instagram className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,789</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245</div>
            <p className="text-xs text-muted-foreground">
              +22% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.7K</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </CardTitle>
            <CardDescription>
              Gestión de páginas y publicaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">✅ Implementado</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestión de páginas</li>
                <li>• Publicación de posts</li>
                <li>• Análisis de métricas</li>
                <li>• Gestión de anuncios</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Instagram
            </CardTitle>
            <CardDescription>
              Gestión de perfil y contenido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">✅ Implementado</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestión de perfil</li>
                <li>• Publicación de fotos/videos</li>
                <li>• Stories y Reels</li>
                <li>• Análisis de engagement</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Avanzadas</CardTitle>
          <CardDescription>
            Características premium para Facebook e Instagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Próximamente v2.3.0</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Programación de publicaciones</li>
                <li>• Análisis de competencia</li>
                <li>• Optimización automática</li>
                <li>• Reportes personalizados</li>
                <li>• Integración con WhatsApp Business</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🎯 Características Premium</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• IA para optimización de horarios</li>
                <li>• Análisis de sentimientos avanzado</li>
                <li>• Predicción de tendencias</li>
                <li>• Automatización de respuestas</li>
                <li>• Dashboard unificado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}