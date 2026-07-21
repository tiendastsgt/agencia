import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase, Strategy } from '@/lib/supabase'
import { Plus, Target, Lightbulb, TrendingUp, Eye, Edit, Trash2, Calendar } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function StrategiesPage() {
  const { activeClient } = useActiveClient()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadStrategies()
    }
  }, [activeClient])

  const loadStrategies = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStrategies(data || [])
    } catch (error) {
      console.error('Error loading strategies:', error)
      toast.error('Error al cargar las estrategias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStrategy = async (strategyData: any) => {
    if (!activeClient) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('strategies')
        .insert([{
          ...strategyData,
          client_id: activeClient.id,
          created_by: activeClient.user_id || 'system'
        }])

      if (error) throw error
      
      toast.success('Estrategia creada exitosamente')
      setIsCreateDialogOpen(false)
      await loadStrategies()
    } catch (error) {
      console.error('Error creating strategy:', error)
      toast.error('Error al crear estrategia')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditStrategy = async (strategyData: any) => {
    if (!selectedStrategy) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('strategies')
        .update(strategyData)
        .eq('id', selectedStrategy.id)

      if (error) throw error
      
      toast.success('Estrategia actualizada exitosamente')
      setIsEditDialogOpen(false)
      setSelectedStrategy(null)
      await loadStrategies()
    } catch (error) {
      console.error('Error updating strategy:', error)
      toast.error('Error al actualizar estrategia')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStrategy = async (strategyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta estrategia?')) return

    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', strategyId)

      if (error) throw error
      
      toast.success('Estrategia eliminada exitosamente')
      await loadStrategies()
    } catch (error) {
      console.error('Error deleting strategy:', error)
      toast.error('Error al eliminar estrategia')
    }
  }

  const handleViewStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy)
    toast.info(`Viendo detalles de ${strategy.strategy_type}`)
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

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'content_marketing': return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'lead_generation': return <Target className="h-4 w-4 text-blue-500" />
      case 'paid_advertising': return <TrendingUp className="h-4 w-4 text-green-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Estrategias</h1>
          <p className="text-gray-600">Selecciona un cliente para ver sus estrategias</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estrategias</h1>
          <p className="text-gray-600 mt-2">
            Gestiona estrategias de marketing para {activeClient.name}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Estrategia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Estrategia</DialogTitle>
              <DialogDescription>
                Crea una nueva estrategia para {activeClient?.name}
              </DialogDescription>
            </DialogHeader>
            <CreateStrategyForm onSubmit={handleCreateStrategy} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

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
      ) : strategies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getStrategyIcon(strategy.strategy_type)}
                    <CardTitle className="text-lg capitalize">
                      {strategy.strategy_type.replace('_', ' ')}
                    </CardTitle>
                  </div>
                  <Badge variant={getStatusColor(strategy.status)}>
                    {getStatusLabel(strategy.status)}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  Framework: {strategy.framework_used || 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Creado:</span>
                    <span className="font-medium">
                      {new Date(strategy.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewStrategy(strategy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedStrategy(strategy)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteStrategy(strategy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="text-sm font-medium">{strategy.id.substring(0, 8)}...</p>
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
            No hay estrategias
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera estrategia para comenzar
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Estrategia
          </Button>
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estrategia</DialogTitle>
            <DialogDescription>
              Modifica la información de la estrategia
            </DialogDescription>
          </DialogHeader>
          {selectedStrategy && (
            <EditStrategyForm 
              strategy={selectedStrategy}
              onSubmit={handleEditStrategy} 
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente del formulario de creación de estrategia
function CreateStrategyForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    strategy_type: '',
    framework_used: '',
    status: 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="strategy_type">Tipo de Estrategia</Label>
        <Select value={formData.strategy_type} onValueChange={(value) => setFormData({...formData, strategy_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="content_marketing">Marketing de Contenido</SelectItem>
            <SelectItem value="social_media">Redes Sociales</SelectItem>
            <SelectItem value="email_marketing">Email Marketing</SelectItem>
            <SelectItem value="paid_ads">Publicidad Pagada</SelectItem>
            <SelectItem value="influencer">Influencer Marketing</SelectItem>
            <SelectItem value="seo">SEO</SelectItem>
            <SelectItem value="conversion_optimization">Optimización de Conversión</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="framework_used">Framework Utilizado</Label>
        <Select value={formData.framework_used} onValueChange={(value) => setFormData({...formData, framework_used: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="russell_brunson">Russell Brunson</SelectItem>
            <SelectItem value="dream_100">Dream 100</SelectItem>
            <SelectItem value="attractive_character">Attractive Character</SelectItem>
            <SelectItem value="hook_story_offer">Hook-Story-Offer</SelectItem>
            <SelectItem value="value_ladder">Value Ladder</SelectItem>
            <SelectItem value="traffic_temperature">Traffic Temperature</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="status">Estado</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="active">Activa</SelectItem>
            <SelectItem value="paused">Pausada</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creando...' : 'Crear Estrategia'}
        </Button>
      </div>
    </form>
  )
}

// Componente del formulario de edición de estrategia
function EditStrategyForm({ strategy, onSubmit, isSubmitting }: { strategy: Strategy, onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    strategy_type: strategy.strategy_type || '',
    framework_used: strategy.framework_used || '',
    status: strategy.status || 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-strategy_type">Tipo de Estrategia</Label>
        <Select value={formData.strategy_type} onValueChange={(value) => setFormData({...formData, strategy_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="content_marketing">Marketing de Contenido</SelectItem>
            <SelectItem value="social_media">Redes Sociales</SelectItem>
            <SelectItem value="email_marketing">Email Marketing</SelectItem>
            <SelectItem value="paid_ads">Publicidad Pagada</SelectItem>
            <SelectItem value="influencer">Influencer Marketing</SelectItem>
            <SelectItem value="seo">SEO</SelectItem>
            <SelectItem value="conversion_optimization">Optimización de Conversión</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="edit-framework_used">Framework Utilizado</Label>
        <Select value={formData.framework_used} onValueChange={(value) => setFormData({...formData, framework_used: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="russell_brunson">Russell Brunson</SelectItem>
            <SelectItem value="dream_100">Dream 100</SelectItem>
            <SelectItem value="attractive_character">Attractive Character</SelectItem>
            <SelectItem value="hook_story_offer">Hook-Story-Offer</SelectItem>
            <SelectItem value="value_ladder">Value Ladder</SelectItem>
            <SelectItem value="traffic_temperature">Traffic Temperature</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="edit-status">Estado</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="active">Activa</SelectItem>
            <SelectItem value="paused">Pausada</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Estrategia'}
        </Button>
      </div>
    </form>
  )
}