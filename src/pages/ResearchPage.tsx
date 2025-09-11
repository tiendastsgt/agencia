import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase, MarketResearch } from '@/lib/supabase'
import { Plus, Search, TrendingUp, Users, Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ResearchPage() {
  const { activeClient } = useActiveClient()
  const [research, setResearch] = useState<MarketResearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedResearch, setSelectedResearch] = useState<MarketResearch | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadResearch()
    }
  }, [activeClient])

  const loadResearch = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('market_research')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResearch(data || [])
    } catch (error) {
      console.error('Error loading research:', error)
      toast.error('Error al cargar las investigaciones')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateResearch = async (researchData: any) => {
    if (!activeClient) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('market_research')
        .insert([{
          ...researchData,
          client_id: activeClient.id,
          created_by: activeClient.user_id || 'system'
        }])

      if (error) throw error
      
      toast.success('Investigación creada exitosamente')
      setIsCreateDialogOpen(false)
      await loadResearch()
    } catch (error) {
      console.error('Error creating research:', error)
      toast.error('Error al crear investigación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditResearch = async (researchData: any) => {
    if (!selectedResearch) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('market_research')
        .update(researchData)
        .eq('id', selectedResearch.id)

      if (error) throw error
      
      toast.success('Investigación actualizada exitosamente')
      setIsEditDialogOpen(false)
      setSelectedResearch(null)
      await loadResearch()
    } catch (error) {
      console.error('Error updating research:', error)
      toast.error('Error al actualizar investigación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResearch = async (researchId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta investigación?')) return

    try {
      const { error } = await supabase
        .from('market_research')
        .delete()
        .eq('id', researchId)

      if (error) throw error
      
      toast.success('Investigación eliminada exitosamente')
      await loadResearch()
    } catch (error) {
      console.error('Error deleting research:', error)
      toast.error('Error al eliminar investigación')
    }
  }

  const handleViewResearch = (research: MarketResearch) => {
    setSelectedResearch(research)
    toast.info(`Viendo detalles de ${research.title}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'pending': return 'outline'
      case 'draft': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in_progress': return 'En Progreso'
      case 'pending': return 'Pendiente'
      case 'draft': return 'Borrador'
      default: return status
    }
  }

  const getResearchIcon = (type: string) => {
    switch (type) {
      case 'competitor_analysis': return <Users className="h-4 w-4 text-red-500" />
      case 'market_trends': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'target_audience': return <Users className="h-4 w-4 text-blue-500" />
      default: return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Investigación</h1>
          <p className="text-gray-600">Selecciona un cliente para ver investigaciones</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investigación de Mercado</h1>
          <p className="text-gray-600 mt-2">
            Análisis e investigaciones para {activeClient.name}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Investigación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Investigación</DialogTitle>
              <DialogDescription>
                Crea una nueva investigación para {activeClient?.name}
              </DialogDescription>
            </DialogHeader>
            <CreateResearchForm onSubmit={handleCreateResearch} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
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
      ) : research.length > 0 ? (
        <div className="space-y-4">
          {research.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getResearchIcon(item.research_type)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <Badge variant={getStatusColor(item.status || 'pending')}>
                    {getStatusLabel(item.status || 'pending')}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  Tipo: {item.research_type.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Creado:</span>
                    <span className="font-medium">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {item.findings && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Hallazgos:</p>
                      <p className="text-sm text-gray-600">
                        {typeof item.findings === 'string' 
                          ? item.findings.substring(0, 200) + '...'
                          : 'Datos de investigación disponibles'
                        }
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewResearch(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedResearch(item)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info('Función de exportar próximamente')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteResearch(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="text-sm font-medium">{item.id.substring(0, 8)}...</p>
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
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay investigaciones
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera investigación de mercado
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Investigación
          </Button>
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Investigación</DialogTitle>
            <DialogDescription>
              Modifica la información de la investigación
            </DialogDescription>
          </DialogHeader>
          {selectedResearch && (
            <EditResearchForm 
              research={selectedResearch}
              onSubmit={handleEditResearch} 
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente del formulario de creación de investigación
function CreateResearchForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    title: '',
    research_type: '',
    status: 'in_progress'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título de la Investigación</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="research_type">Tipo de Investigación</Label>
        <Select value={formData.research_type} onValueChange={(value) => setFormData({...formData, research_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market_analysis">Análisis de Mercado</SelectItem>
            <SelectItem value="competitor_analysis">Análisis de Competencia</SelectItem>
            <SelectItem value="customer_research">Investigación de Clientes</SelectItem>
            <SelectItem value="trend_analysis">Análisis de Tendencias</SelectItem>
            <SelectItem value="swot_analysis">Análisis SWOT</SelectItem>
            <SelectItem value="pest_analysis">Análisis PEST</SelectItem>
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
            <SelectItem value="in_progress">En Progreso</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creando...' : 'Crear Investigación'}
        </Button>
      </div>
    </form>
  )
}

// Componente del formulario de edición de investigación
function EditResearchForm({ research, onSubmit, isSubmitting }: { research: MarketResearch, onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    title: research.title || '',
    research_type: research.research_type || '',
    status: research.status || 'in_progress'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Título de la Investigación</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-research_type">Tipo de Investigación</Label>
        <Select value={formData.research_type} onValueChange={(value) => setFormData({...formData, research_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market_analysis">Análisis de Mercado</SelectItem>
            <SelectItem value="competitor_analysis">Análisis de Competencia</SelectItem>
            <SelectItem value="customer_research">Investigación de Clientes</SelectItem>
            <SelectItem value="trend_analysis">Análisis de Tendencias</SelectItem>
            <SelectItem value="swot_analysis">Análisis SWOT</SelectItem>
            <SelectItem value="pest_analysis">Análisis PEST</SelectItem>
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
            <SelectItem value="in_progress">En Progreso</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Investigación'}
        </Button>
      </div>
    </form>
  )
}