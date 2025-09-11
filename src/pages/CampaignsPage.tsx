import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase, Campaign } from '@/lib/supabase'
import { Plus, Target, Calendar, DollarSign, Users, TrendingUp, Eye, Edit, Trash2, RefreshCw } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import UpdateLiendrexCampaigns from '@/components/UpdateLiendrexCampaigns'
import CleanLiendrexCampaigns from '@/components/CleanLiendrexCampaigns'
import CheckLiendrexData from '@/components/CheckLiendrexData'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CampaignsPage() {
  const { activeClient, forceRefresh } = useActiveClient()
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      client_id: activeClient?.id || '',
      name: 'Campaña Anti-Piojo - Regreso a Clases',
      description: 'Campaña estacional enfocada en la prevención de piojos durante el regreso a clases escolares',
      campaign_type: 'social_media',
      status: 'active',
      objective: 'Aumentar ventas en 30% y conocimiento de marca',
      target_audience: {
        demographics: 'Madres de familia 25-45 años',
        interests: 'Salud infantil, productos naturales',
        location: 'Guatemala, Centroamérica'
      },
      budget: 25000,
      start_date: '2025-09-01',
      end_date: '2025-09-30',
      russell_brunson_framework: 'Value Ladder',
      value_ladder: {
        lead_magnet: 'Guía gratuita de prevención de piojos',
        tripwire: 'Peine Lendrera con descuento',
        core_product: 'Shampoo Repelente Liendrex',
        profit_maximizer: 'Kit completo anti-piojos'
      },
      created_by: 'system',
      created_at: '2025-09-01T00:00:00Z',
      updated_at: '2025-09-10T00:00:00Z'
    },
    {
      id: '2',
      client_id: activeClient?.id || '',
      name: 'Campaña TikTok - Distribuciones K3',
      description: 'Colaboración con Distribuciones K3 para contenido educativo en TikTok',
      campaign_type: 'influencer',
      status: 'active',
      objective: 'Aumentar engagement y seguidores en TikTok',
      target_audience: {
        demographics: 'Padres jóvenes 20-35 años',
        interests: 'Consejos de salud, productos naturales',
        location: 'Guatemala'
      },
      budget: 15000,
      start_date: '2025-09-05',
      end_date: '2025-09-25',
      russell_brunson_framework: 'Value Ladder',
      value_ladder: {
        lead_magnet: 'Video educativo sobre piojos',
        tripwire: 'Descuento especial en productos',
        core_product: 'Gel Repelente Liendrex',
        profit_maximizer: 'Kit familiar anti-piojos'
      },
      created_by: 'system',
      created_at: '2025-09-05T00:00:00Z',
      updated_at: '2025-09-10T00:00:00Z'
    },
    {
      id: '3',
      client_id: activeClient?.id || '',
      name: 'Campaña Facebook - Productos Naturales',
      description: 'Enfoque en la diferenciación por productos sin insecticidas',
      campaign_type: 'social_media',
      status: 'planning',
      objective: 'Posicionar como líder en productos naturales',
      target_audience: {
        demographics: 'Madres conscientes de la salud 30-50 años',
        interests: 'Productos naturales, bienestar familiar',
        location: 'Guatemala, El Salvador, Honduras'
      },
      budget: 20000,
      start_date: '2025-09-15',
      end_date: '2025-10-15',
      russell_brunson_framework: 'Value Ladder',
      value_ladder: {
        lead_magnet: 'Ebook: "Guía de productos naturales para niños"',
        tripwire: 'Muestra gratuita del shampoo',
        core_product: 'Shampoo Repelente Liendrex',
        profit_maximizer: 'Línea completa de productos naturales'
      },
      created_by: 'system',
      created_at: '2025-09-08T00:00:00Z',
      updated_at: '2025-09-10T00:00:00Z'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadCampaigns()
    }
  }, [activeClient])

  const loadCampaigns = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast.error('Error al cargar las campañas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      await forceRefresh()
      await loadCampaigns()
      toast.success('Datos actualizados correctamente')
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error('Error al actualizar los datos')
    }
  }

  const handleCreateCampaign = async (campaignData: any) => {
    if (!activeClient) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          client_id: activeClient.id,
          created_by: activeClient.user_id || 'system'
        }])

      if (error) throw error
      
      toast.success('Campaña creada exitosamente')
      setIsCreateDialogOpen(false)
      await loadCampaigns()
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Error al crear campaña')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCampaign = async (campaignData: any) => {
    if (!selectedCampaign) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('campaigns')
        .update(campaignData)
        .eq('id', selectedCampaign.id)

      if (error) throw error
      
      toast.success('Campaña actualizada exitosamente')
      setIsEditDialogOpen(false)
      setSelectedCampaign(null)
      await loadCampaigns()
    } catch (error) {
      console.error('Error updating campaign:', error)
      toast.error('Error al actualizar campaña')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta campaña?')) return

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)

      if (error) throw error
      
      toast.success('Campaña eliminada exitosamente')
      await loadCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Error al eliminar campaña')
    }
  }

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    toast.info(`Viendo detalles de ${campaign.name}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'paused': return 'secondary'
      case 'completed': return 'outline'
      case 'draft': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'paused': return 'Pausada'
      case 'completed': return 'Completada'
      case 'draft': return 'Borrador'
      default: return status
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campañas</h1>
          <p className="text-gray-600">Selecciona un cliente para ver sus campañas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las campañas para {activeClient.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Campaña</DialogTitle>
                <DialogDescription>
                  Crea una nueva campaña para {activeClient?.name}
                </DialogDescription>
              </DialogHeader>
              <CreateCampaignForm onSubmit={handleCreateCampaign} isSubmitting={isSubmitting} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Componente temporal para actualizar campañas de Liendrex */}
      {activeClient && activeClient.name.toLowerCase().includes('liendrex') && (
        <div className="mb-6">
          <UpdateLiendrexCampaigns />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {getStatusLabel(campaign.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{campaign.campaign_type || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Presupuesto:</span>
                      <span className="font-medium">Q{campaign.budget?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Inicio:</span>
                    <span className="font-medium">
                      {new Date(campaign.start_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Fin:</span>
                    <span className="font-medium">
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCampaign(campaign)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(campaign)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Objetivo</p>
                        <p className="text-sm font-medium">{campaign.objective || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay campañas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera campaña para comenzar
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Campaña
          </Button>
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Campaña</DialogTitle>
            <DialogDescription>
              Modifica la información de la campaña
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <EditCampaignForm 
              campaign={selectedCampaign}
              onSubmit={handleEditCampaign} 
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Componentes para verificar y limpiar datos de Liendrex */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckLiendrexData />
        <CleanLiendrexCampaigns />
      </div>
    </div>
  )
}

// Componente del formulario de creación de campaña
function CreateCampaignForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_type: '',
    objective: '',
    budget: 0,
    start_date: '',
    end_date: '',
    status: 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre de la Campaña</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="campaign_type">Tipo de Campaña</Label>
        <Select value={formData.campaign_type} onValueChange={(value) => setFormData({...formData, campaign_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social_media">Redes Sociales</SelectItem>
            <SelectItem value="email">Email Marketing</SelectItem>
            <SelectItem value="paid_ads">Publicidad Pagada</SelectItem>
            <SelectItem value="content">Marketing de Contenido</SelectItem>
            <SelectItem value="influencer">Influencer Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="objective">Objetivo</Label>
        <Input
          id="objective"
          value={formData.objective}
          onChange={(e) => setFormData({...formData, objective: e.target.value})}
          placeholder="Ej: Aumentar ventas en 20%"
        />
      </div>
      
      <div>
        <Label htmlFor="budget">Presupuesto (Q)</Label>
        <Input
          id="budget"
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
          min="0"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Fecha de Inicio</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">Fecha de Fin</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creando...' : 'Crear Campaña'}
        </Button>
      </div>
    </form>
  )
}

// Componente del formulario de edición de campaña
function EditCampaignForm({ campaign, onSubmit, isSubmitting }: { campaign: Campaign, onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    name: campaign.name || '',
    description: campaign.description || '',
    campaign_type: campaign.campaign_type || '',
    objective: campaign.objective || '',
    budget: campaign.budget || 0,
    start_date: campaign.start_date ? new Date(campaign.start_date).toISOString().split('T')[0] : '',
    end_date: campaign.end_date ? new Date(campaign.end_date).toISOString().split('T')[0] : '',
    status: campaign.status || 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Nombre de la Campaña</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-description">Descripción</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="edit-campaign_type">Tipo de Campaña</Label>
        <Select value={formData.campaign_type} onValueChange={(value) => setFormData({...formData, campaign_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social_media">Redes Sociales</SelectItem>
            <SelectItem value="email">Email Marketing</SelectItem>
            <SelectItem value="paid_ads">Publicidad Pagada</SelectItem>
            <SelectItem value="content">Marketing de Contenido</SelectItem>
            <SelectItem value="influencer">Influencer Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="edit-objective">Objetivo</Label>
        <Input
          id="edit-objective"
          value={formData.objective}
          onChange={(e) => setFormData({...formData, objective: e.target.value})}
          placeholder="Ej: Aumentar ventas en 20%"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-budget">Presupuesto (Q)</Label>
        <Input
          id="edit-budget"
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
          min="0"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-start_date">Fecha de Inicio</Label>
          <Input
            id="edit-start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-end_date">Fecha de Fin</Label>
          <Input
            id="edit-end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Campaña'}
        </Button>
      </div>
    </form>
  )
}