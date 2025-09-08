import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  Megaphone,
  FileText,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Plus,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Sample data for charts
const engagementData = [
  { name: 'Facebook', engagement: 4.2, reach: 12500 },
  { name: 'Instagram', engagement: 6.8, reach: 8750 },
  { name: 'TikTok', engagement: 8.5, reach: 25600 },
  { name: 'LinkedIn', engagement: 3.1, reach: 4200 }
]

const performanceData = [
  { month: 'Ene', leads: 45, conversions: 12, revenue: 15600 },
  { month: 'Feb', leads: 52, conversions: 15, revenue: 18200 },
  { month: 'Mar', leads: 48, conversions: 14, revenue: 16800 },
  { month: 'Abr', leads: 61, conversions: 18, revenue: 22400 },
  { month: 'May', leads: 55, conversions: 16, revenue: 19200 },
  { month: 'Jun', leads: 67, conversions: 21, revenue: 25600 }
]

const platformDistribution = [
  { name: 'Facebook', value: 35, color: '#1877F2' },
  { name: 'Instagram', value: 28, color: '#E4405F' },
  { name: 'TikTok', value: 22, color: '#000000' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' }
]

export default function Dashboard() {
  // Fetch clients
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  // Fetch campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  // Fetch content
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    }
  })

  // Fetch recent analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('date_recorded', { ascending: false })
        .limit(20)
      
      if (error) throw error
      return data
    }
  })

  // Calculate summary metrics
  const totalClients = clients?.length || 0
  const activeCampaigns = campaigns?.filter(c => c.status === 'active')?.length || 0
  const totalContent = content?.length || 0
  const avgEngagement = analytics?.filter(a => a.metric_name === 'Engagement Rate')?.[0]?.metric_value || 5.4

  const stats = [
    {
      title: 'Clientes Activos',
      value: totalClients.toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Campañas Activas',
      value: activeCampaigns.toString(),
      change: '+8%',
      trend: 'up',
      icon: Megaphone,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Contenido Generado',
      value: totalContent.toString(),
      change: '+23%',
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Engagement Promedio',
      value: `${avgEngagement.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  if (clientsLoading || campaignsLoading || contentLoading || analyticsLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg h-96"></div>
          <div className="bg-white shadow rounded-lg h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general de performance y actividades
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to="/content">
              <Plus className="h-4 w-4 mr-2" />
              Crear Contenido
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <div className={`ml-2 flex items-center text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Performance</CardTitle>
            <CardDescription>
              Leads y conversiones de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Conversiones"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement por Plataforma</CardTitle>
            <CardDescription>
              Comparativa de performance en redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#3B82F6" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Tráfico</CardTitle>
            <CardDescription>
              Por plataforma social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {platformDistribution.map((platform, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span>{platform.name}</span>
                  </div>
                  <span className="font-medium">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Último contenido generado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content?.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span className="capitalize">{item.platform}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{item.status}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' :
                      item.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'published' ? 'Publicado' :
                       item.status === 'scheduled' ? 'Programado' : 'Borrador'}
                    </span>
                  </div>
                </div>
              ))}
              {(!content || content.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay contenido reciente</p>
                  <Button asChild className="mt-2">
                    <Link to="/content">
                      Crear primer contenido
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas principales para trabajo diario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-16">
              <Link to="/content" className="flex flex-col items-center space-y-2">
                <FileText className="h-5 w-5" />
                <span>Crear Contenido</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
              <Link to="/campaigns" className="flex flex-col items-center space-y-2">
                <Megaphone className="h-5 w-5" />
                <span>Nueva Campaña</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
              <Link to="/research" className="flex flex-col items-center space-y-2">
                <Target className="h-5 w-5" />
                <span>Investigar Mercado</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
              <Link to="/analytics" className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-5 w-5" />
                <span>Ver Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}