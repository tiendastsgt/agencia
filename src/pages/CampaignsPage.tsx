import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Client, Campaign } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Megaphone,
  Search,
  Plus,
  Calendar,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Play,
  Pause,
  Edit,
  MoreVertical,
  Eye,
  BookOpen,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const campaignStatusColors = {
  'planning': 'bg-yellow-100 text-yellow-800',
  'active': 'bg-green-100 text-green-800',
  'paused': 'bg-orange-100 text-orange-800',
  'completed': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-red-100 text-red-800'
}

const campaignStatusLabels = {
  'planning': 'Planificación',
  'active': 'Activa',
  'paused': 'Pausada', 
  'completed': 'Completada',
  'cancelled': 'Cancelada'
}

const russellBrunsonFrameworks = {
  'Perfect Webinar': { icon: BookOpen, color: 'text-blue-600' },
  'Value Ladder': { icon: TrendingUp, color: 'text-green-600' },
  'Hook-Story-Offer': { icon: Zap, color: 'text-purple-600' },
  'Dream 100': { icon: Target, color: 'text-orange-600' }
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    objective: '',
    budget: '',
    framework: '',
    status: 'planning'
  })
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  
  const { activeClient } = useAuth()
  const queryClient = useQueryClient()

  // Fetch campaigns
  const { data: campaigns, isLoading } = useQuery({
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

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      if (!activeClient) throw new Error('No hay cliente activo')
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaignData,
          client_id: activeClient.id,
          budget: parseFloat(campaignData.budget) || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      setShowCreateForm(false)
      setNewCampaign({
        name: '',
        description: '',
        objective: '',
        budget: '',
        framework: '',
        status: 'planning'
      })
      toast.success('Campaña creada exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error al crear campaña: ' + error.message)
    }
  })

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.objective) {
      toast.error('Nombre y objetivo son requeridos')
      return
    }
    createCampaignMutation.mutate(newCampaign)
  }

  // Fetch clients for filter
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data as Client[]
    }
  })

  // Filter campaigns
  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus
    const matchesClient = selectedClient === 'all' || campaign.client_id === selectedClient
    return matchesSearch && matchesStatus && matchesClient
  }) || []

  // Get campaign stats
  const stats = {
    total: campaigns?.length || 0,
    active: campaigns?.filter(c => c.status === 'active').length || 0,
    planning: campaigns?.filter(c => c.status === 'planning').length || 0,
    completed: campaigns?.filter(c => c.status === 'completed').length || 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Crear Nueva Campaña</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Campaña *</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Ej: Lanzamiento Q1 2025"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Describe el propósito de la campaña"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objective">Objetivo *</Label>
                <Input
                  id="objective"
                  value={newCampaign.objective}
                  onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                  placeholder="Ej: Aumentar ventas en 30%"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Presupuesto (Q)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label htmlFor="framework">Framework Russell Brunson</Label>
                  <Select value={newCampaign.framework} onValueChange={(value) => setNewCampaign({ ...newCampaign, framework: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perfect Webinar">Perfect Webinar</SelectItem>
                      <SelectItem value="Value Ladder">Value Ladder</SelectItem>
                      <SelectItem value="Hook-Story-Offer">Hook-Story-Offer</SelectItem>
                      <SelectItem value="Dream 100">Dream 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCampaign}
                  disabled={createCampaignMutation.isPending}
                >
                  {createCampaignMutation.isPending ? 'Creando...' : 'Crear Campaña'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Megaphone className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planificación</p>
                <p className="text-2xl font-bold text-gray-900">{stats.planning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar campañas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="planning">Planificación</option>
          <option value="active">Activas</option>
          <option value="paused">Pausadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los clientes</option>
          {clients?.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm || selectedStatus !== 'all' || selectedClient !== 'all' ? 
                  'No se encontraron campañas' : 'No hay campañas aún'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedClient !== 'all' ?
                  'Intenta cambiar los filtros de búsqueda' :
                  'Comienza creando tu primera campaña de marketing'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && selectedClient === 'all' && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Campaña
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}

function CampaignCard({ campaign }: { campaign: any }) {
  const statusColor = campaignStatusColors[campaign.status] || 'bg-gray-100 text-gray-800'
  const statusLabel = campaignStatusLabels[campaign.status] || campaign.status
  
  const framework = campaign.russell_brunson_framework || 'Hook-Story-Offer'
  const frameworkInfo = russellBrunsonFrameworks[framework] || russellBrunsonFrameworks['Hook-Story-Offer']
  const FrameworkIcon = frameworkInfo.icon

  const targetAudience = campaign.target_audience?.primary || 'No definido'
  const budget = campaign.budget ? `Q${campaign.budget.toLocaleString()}` : 'No definido'
  
  const startDate = campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'No definida'
  const endDate = campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'No definida'

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {campaign.name}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {campaign.clients?.name}
                </Badge>
                <Badge className={`text-xs ${statusColor}`}>
                  {statusLabel}
                </Badge>
              </div>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {campaign.description || 'Sin descripción disponible'}
        </p>

        {/* Framework */}
        <div className="flex items-center text-sm">
          <FrameworkIcon className={`h-4 w-4 mr-2 ${frameworkInfo.color}`} />
          <span className="font-medium">{framework}</span>
        </div>

        {/* Key Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{targetAudience}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Presupuesto: {budget}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{startDate} - {endDate}</span>
          </div>
        </div>

        {/* Objective */}
        {campaign.objective && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-900 mb-1">Objetivo</p>
            <p className="text-sm text-blue-800 line-clamp-2">
              {campaign.objective}
            </p>
          </div>
        )}

        {/* Value Ladder Info */}
        {campaign.value_ladder && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-900 mb-1">Value Ladder</p>
            <div className="text-sm text-green-800">
              {campaign.value_ladder.level_1_bait && (
                <div className="flex justify-between">
                  <span>Lead Magnet:</span>
                  <span className="font-medium">Q{campaign.value_ladder.level_1_bait.price || 0}</span>
                </div>
              )}
              {campaign.value_ladder.level_4_premium && (
                <div className="flex justify-between">
                  <span>Premium:</span>
                  <span className="font-medium">Q{campaign.value_ladder.level_4_premium.price || 0}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to={`/content?campaign=${campaign.id}`}>
              Ver Contenido
            </Link>
          </Button>
        </div>

        {/* Campaign Type */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-900">{campaign.campaign_type || 'General'}</p>
              <p className="text-gray-500">Tipo</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {new Date(campaign.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-500">Creada</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {campaign.clients?.industry || 'N/A'}
              </p>
              <p className="text-gray-500">Industria</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}