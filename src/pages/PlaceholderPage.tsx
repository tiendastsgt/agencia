import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Construction, Calendar, Zap } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  version?: string
  features?: string[]
  comingSoon?: string[]
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon, 
  version = "v2.3.0",
  features = [],
  comingSoon = []
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Icon className="h-8 w-8 text-blue-500" />
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          {version}
        </Badge>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-orange-500" />
            En Desarrollo
          </CardTitle>
          <CardDescription>
            Esta funcionalidad está siendo desarrollada y estará disponible próximamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">🎯 Funcionalidades Planificadas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🚀 Próximas Características</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {comingSoon.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">En Desarrollo</div>
            <p className="text-xs text-muted-foreground">
              Lanzamiento programado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              Desarrollo en curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lanzamiento</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q2 2025</div>
            <p className="text-xs text-muted-foreground">
              Estimado
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
