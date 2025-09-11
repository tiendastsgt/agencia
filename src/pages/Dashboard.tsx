import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useActiveClient } from '@/lib/client-context'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, TrendingUp, Target, Calendar, Eye, MessageCircle, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DatabaseStatus from '@/components/DatabaseStatus'
import ContentTemplateGenerator from '@/components/ContentTemplateGenerator'
import APIStatusChecker from '@/components/APIStatusChecker'
import MediaGenerationDemo from '@/components/MediaGenerationDemo'
import { CredentialsStatus } from '@/components/CredentialsStatus'

interface DashboardStats {
  activeCampaigns: number
  activeExperiments: number
  contentThisMonth: number
  avgEngagement: number
}

interface RecentActivity {
  id: string
  type: string
  title: string
  date: string
  status: string
}

export default function Dashboard() {
  const { activeClient } = useActiveClient()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    activeCampaigns: 3,
    activeExperiments: 2,
    contentThisMonth: 12,
    avgEngagement: 7.2
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'campaign',
      title: 'Campaña Anti-Piojo - Regreso a Clases',
      date: '2025-09-08T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      type: 'content',
      title: 'Post: "Prevención Natural de Piojos"',
      date: '2025-09-07T15:45:00Z',
      status: 'published'
    },
    {
      id: '3',
      type: 'campaign',
      title: 'Experimento A/B: Títulos de Facebook',
      date: '2025-09-06T09:15:00Z',
      status: 'active'
    },
    {
      id: '4',
      type: 'content',
      title: 'Video: Uso del Peine Lendrera',
      date: '2025-09-05T14:20:00Z',
      status: 'published'
    },
    {
      id: '5',
      type: 'campaign',
      title: 'Campaña TikTok - Distribuciones K3',
      date: '2025-09-04T11:00:00Z',
      status: 'active'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadDashboardData()
    }
  }, [activeClient])

  const loadDashboardData = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)

      // Cargar campañas activas
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', activeClient.id)
        .eq('status', 'active')

      // Cargar experimentos activos
      const { data: experiments } = await supabase
        .from('mab_experiments')
        .select('*')
        .eq('client_id', activeClient.id)
        .eq('status', 'active')

      // Cargar contenido del mes actual
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: content } = await supabase
        .from('content')
        .select('*')
        .eq('client_id', activeClient.id)
        .gte('created_at', `${currentMonth}-01`)

      // Cargar analytics para engagement
      const { data: analytics } = await supabase
        .from('analytics')
        .select('*')
        .eq('client_id', activeClient.id)
        .eq('metric_name', 'engagement_rate')

      // Calcular engagement promedio
      const avgEngagement = analytics?.length > 0 
        ? analytics.reduce((sum, item) => sum + (item.metric_value || 0), 0) / analytics.length
        : 0

      setStats({
        activeCampaigns: campaigns?.length || 0,
        activeExperiments: experiments?.length || 0,
        contentThisMonth: content?.length || 0,
        avgEngagement: Math.round(avgEngagement * 10) / 10
      })

      // Crear actividad reciente
      const activities: RecentActivity[] = []
      
      if (campaigns) {
        campaigns.slice(0, 3).forEach(campaign => {
          activities.push({
            id: campaign.id,
            type: 'campaign',
            title: campaign.name,
            date: campaign.created_at,
            status: campaign.status
          })
        })
      }

      if (content) {
        content.slice(0, 2).forEach(item => {
          activities.push({
            id: item.id,
            type: 'content',
            title: item.title,
            date: item.created_at,
            status: item.status
          })
        })
      }

      setRecentActivity(activities.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">Selecciona un cliente para ver el dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Resumen de actividades para {activeClient.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Campañas en ejecución
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experimentos A/B</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeExperiments}</div>
            <p className="text-xs text-muted-foreground">
              Experimentos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contenido Generado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.contentThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Piezas este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${stats.avgEngagement}%`}</div>
            <p className="text-xs text-muted-foreground">
              Promedio semanal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando actividad...
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.type === 'campaign' ? (
                        <Target className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MessageCircle className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay actividad reciente
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes para acelerar tu trabajo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/ab-testing')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Crear Experimento A/B
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/ai-content')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Generar Contenido con IA
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/campaigns')}
            >
              <Target className="mr-2 h-4 w-4" />
              Nueva Campaña
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Credenciales */}
      <div className="mt-8">
        <CredentialsStatus />
      </div>

      {/* Estado de APIs */}
      <div className="mt-8">
        <APIStatusChecker />
      </div>

      {/* Demo de Generación de Medios */}
      <div className="mt-8">
        <MediaGenerationDemo />
      </div>

      {/* Generador de Contenido Visual */}
      <div className="mt-8">
        <ContentTemplateGenerator />
      </div>

      {/* Componente temporal para verificar estado de la base de datos */}
      <div className="mt-8">
        <DatabaseStatus />
      </div>
    </div>
  )
}