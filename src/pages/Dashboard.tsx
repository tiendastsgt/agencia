import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useActiveClient } from '@/lib/client-context'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, TrendingUp, Target, Calendar, Eye, MessageCircle, Heart, ArrowRight, Activity, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DatabaseStatus from '@/components/DatabaseStatus'
import { CredentialsStatus } from '@/components/CredentialsStatus'
import AuthDiagnostic from '@/components/AuthDiagnostic'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface DashboardStats {
  activeCampaigns: number
  activeExperiments: number
  contentThisMonth: number
  avgEngagement: number
  totalReach: number
  totalClicks: number
  conversionRate: number
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
    avgEngagement: 7.2,
    totalReach: 15420,
    totalClicks: 892,
    conversionRate: 5.8
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
      date: '2025-09-08T09:15:00Z',
      status: 'published'
    },
    {
      id: '3',
      type: 'experiment',
      title: 'A/B Test: Títulos de Posts',
      date: '2025-09-07T16:45:00Z',
      status: 'running'
    }
  ])

  // Datos de ejemplo para gráficos
  const engagementData = [
    { name: 'Lun', engagement: 4.2, reach: 1200 },
    { name: 'Mar', engagement: 6.8, reach: 1800 },
    { name: 'Mié', engagement: 5.1, reach: 1500 },
    { name: 'Jue', engagement: 8.3, reach: 2200 },
    { name: 'Vie', engagement: 7.9, reach: 2100 },
    { name: 'Sáb', engagement: 9.2, reach: 2500 },
    { name: 'Dom', engagement: 6.5, reach: 1800 }
  ]

  const platformData = [
    { name: 'Facebook', value: 45, color: '#1877F2' },
    { name: 'Instagram', value: 30, color: '#E4405F' },
    { name: 'Twitter', value: 15, color: '#1DA1F2' },
    { name: 'YouTube', value: 10, color: '#FF0000' }
  ]

  const campaignPerformance = [
    { name: 'Campaña A', reach: 5000, clicks: 250, conversions: 45 },
    { name: 'Campaña B', reach: 3200, clicks: 180, conversions: 32 },
    { name: 'Campaña C', reach: 4800, clicks: 220, conversions: 38 },
    { name: 'Campaña D', reach: 2400, clicks: 120, conversions: 22 }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign': return <Target className="h-4 w-4 text-blue-500" />
      case 'content': return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'experiment': return <Zap className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'running': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {activeClient ? `Vista general para ${activeClient.name}` : 'Vista general del sistema'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Sistema Activo
          </Badge>
        </div>
      </div>

      {/* Diagnóstico de Autenticación */}
      <AuthDiagnostic />

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalReach)}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEngagement}%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% desde la semana pasada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Semanal</CardTitle>
            <CardDescription>
              Tasa de engagement y alcance por día de la semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="reach" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Plataforma</CardTitle>
            <CardDescription>
              Porcentaje de contenido por red social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {platformData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento de Campañas */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Campañas</CardTitle>
          <CardDescription>
            Comparación de alcance, clics y conversiones por campaña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reach" fill="#8884d8" name="Alcance" />
              <Bar dataKey="clicks" fill="#82ca9d" name="Clics" />
              <Bar dataKey="conversions" fill="#ffc658" name="Conversiones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Actividad Reciente y Acciones Rápidas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                  <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/campaigns')}>
              Ver Todas las Campañas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/ai-content')}>
                <MessageCircle className="mr-2 h-4 w-4" />
              Generar Contenido con IA
            </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/campaigns')}>
              <Target className="mr-2 h-4 w-4" />
                Crear Nueva Campaña
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/ab-testing')}>
                <Zap className="mr-2 h-4 w-4" />
                Configurar A/B Test
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/analytics')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Analytics Detallados
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/credentials')}>
                <Users className="mr-2 h-4 w-4" />
                Gestionar Credenciales
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <div className="grid gap-6 md:grid-cols-2">
        <DatabaseStatus />
        <CredentialsStatus />
      </div>
    </div>
  )
}