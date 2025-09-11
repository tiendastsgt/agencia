import React, { useState, useEffect } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase, Content } from '@/lib/supabase'
import { Plus, FileText, Calendar, Eye, Edit, Trash2, Share, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ContentPage() {
  const { activeClient } = useActiveClient()
  const [content, setContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (activeClient) {
      loadContent()
    }
  }, [activeClient])

  const loadContent = async () => {
    if (!activeClient) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('client_id', activeClient.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Error loading content:', error)
      toast.error('Error al cargar el contenido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContent = async (contentData: any) => {
    if (!activeClient) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('content')
        .insert([{
          ...contentData,
          client_id: activeClient.id,
          created_by: activeClient.user_id || 'system'
        }])

      if (error) throw error
      
      toast.success('Contenido creado exitosamente')
      setIsCreateDialogOpen(false)
      await loadContent()
    } catch (error) {
      console.error('Error creating content:', error)
      toast.error('Error al crear contenido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditContent = async (contentData: any) => {
    if (!selectedContent) return

    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('content')
        .update(contentData)
        .eq('id', selectedContent.id)

      if (error) throw error
      
      toast.success('Contenido actualizado exitosamente')
      setIsEditDialogOpen(false)
      setSelectedContent(null)
      await loadContent()
    } catch (error) {
      console.error('Error updating content:', error)
      toast.error('Error al actualizar contenido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) return

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      
      toast.success('Contenido eliminado exitosamente')
      await loadContent()
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Error al eliminar contenido')
    }
  }

  const handleViewContent = (content: Content) => {
    setSelectedContent(content)
    toast.info(`Viendo detalles de ${content.title}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'scheduled': return 'outline'
      case 'archived': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Borrador'
      case 'scheduled': return 'Programado'
      case 'archived': return 'Archivado'
      default: return status
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-600" />
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-400" />
      default: return <Share className="h-4 w-4 text-gray-500" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'social_post': return 'Post de Red Social'
      case 'blog_post': return 'Artículo de Blog'
      case 'email': return 'Email Marketing'
      case 'ad_copy': return 'Copia Publicitaria'
      case 'story': return 'Story/Historia'
      case 'video_script': return 'Guión de Video'
      default: return type
    }
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contenido</h1>
          <p className="text-gray-600">Selecciona un cliente para ver su contenido</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contenido</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el contenido para {activeClient.name}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contenido</DialogTitle>
              <DialogDescription>
                Crea nuevo contenido para {activeClient?.name}
              </DialogDescription>
            </DialogHeader>
            <CreateContentForm onSubmit={handleCreateContent} isSubmitting={isSubmitting} />
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
      ) : content.length > 0 ? (
        <div className="space-y-4">
          {content.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.content_body?.substring(0, 150)}...
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(item.platform)}
                      <span className="text-sm text-gray-600">{item.platform}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{getContentTypeLabel(item.content_type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Creado:</span>
                      <span className="font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {item.scheduled_for && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Programado:</span>
                        <span className="font-medium">
                          {new Date(item.scheduled_for).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-medium">
                        {item.engagement_metrics?.likes || 0} likes
                      </span>
                    </div>
                  </div>

                  {item.hook && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Hook:</p>
                      <p className="text-sm text-gray-600">{item.hook}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewContent(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedContent(item)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info('Función de compartir próximamente')}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ID de Campaña</p>
                        <p className="text-sm font-medium">{item.campaign_id?.substring(0, 8)}...</p>
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
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay contenido
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer contenido para comenzar
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Contenido
          </Button>
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Contenido</DialogTitle>
            <DialogDescription>
              Modifica la información del contenido
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <EditContentForm 
              content={selectedContent}
              onSubmit={handleEditContent} 
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente del formulario de creación de contenido
function CreateContentForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    title: '',
    content_type: '',
    platform: '',
    hook: '',
    story: '',
    offer: '',
    content_body: '',
    scheduled_for: '',
    status: 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título del Contenido</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="content_type">Tipo de Contenido</Label>
          <Select value={formData.content_type} onValueChange={(value) => setFormData({...formData, content_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social_post">Post de Red Social</SelectItem>
              <SelectItem value="blog_post">Artículo de Blog</SelectItem>
              <SelectItem value="email">Email Marketing</SelectItem>
              <SelectItem value="ad_copy">Copia Publicitaria</SelectItem>
              <SelectItem value="story">Story/Historia</SelectItem>
              <SelectItem value="video_script">Guión de Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="platform">Plataforma</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="hook">Hook (Gancho)</Label>
        <Input
          id="hook"
          value={formData.hook}
          onChange={(e) => setFormData({...formData, hook: e.target.value})}
          placeholder="Gancho para captar atención"
        />
      </div>
      
      <div>
        <Label htmlFor="story">Historia</Label>
        <Textarea
          id="story"
          value={formData.story}
          onChange={(e) => setFormData({...formData, story: e.target.value})}
          placeholder="Cuenta una historia relacionada"
        />
      </div>
      
      <div>
        <Label htmlFor="offer">Oferta</Label>
        <Input
          id="offer"
          value={formData.offer}
          onChange={(e) => setFormData({...formData, offer: e.target.value})}
          placeholder="¿Qué ofreces?"
        />
      </div>
      
      <div>
        <Label htmlFor="content_body">Contenido Principal</Label>
        <Textarea
          id="content_body"
          value={formData.content_body}
          onChange={(e) => setFormData({...formData, content_body: e.target.value})}
          placeholder="Escribe el contenido principal"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="scheduled_for">Programar para</Label>
        <Input
          id="scheduled_for"
          type="datetime-local"
          value={formData.scheduled_for}
          onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creando...' : 'Crear Contenido'}
        </Button>
      </div>
    </form>
  )
}

// Componente del formulario de edición de contenido
function EditContentForm({ content, onSubmit, isSubmitting }: { content: Content, onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    title: content.title || '',
    content_type: content.content_type || '',
    platform: content.platform || '',
    hook: content.hook || '',
    story: content.story || '',
    offer: content.offer || '',
    content_body: content.content_body || '',
    scheduled_for: content.scheduled_for ? new Date(content.scheduled_for).toISOString().slice(0, 16) : '',
    status: content.status || 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Título del Contenido</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-content_type">Tipo de Contenido</Label>
          <Select value={formData.content_type} onValueChange={(value) => setFormData({...formData, content_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social_post">Post de Red Social</SelectItem>
              <SelectItem value="blog_post">Artículo de Blog</SelectItem>
              <SelectItem value="email">Email Marketing</SelectItem>
              <SelectItem value="ad_copy">Copia Publicitaria</SelectItem>
              <SelectItem value="story">Story/Historia</SelectItem>
              <SelectItem value="video_script">Guión de Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="edit-platform">Plataforma</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="edit-hook">Hook (Gancho)</Label>
        <Input
          id="edit-hook"
          value={formData.hook}
          onChange={(e) => setFormData({...formData, hook: e.target.value})}
          placeholder="Gancho para captar atención"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-story">Historia</Label>
        <Textarea
          id="edit-story"
          value={formData.story}
          onChange={(e) => setFormData({...formData, story: e.target.value})}
          placeholder="Cuenta una historia relacionada"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-offer">Oferta</Label>
        <Input
          id="edit-offer"
          value={formData.offer}
          onChange={(e) => setFormData({...formData, offer: e.target.value})}
          placeholder="¿Qué ofreces?"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-content_body">Contenido Principal</Label>
        <Textarea
          id="edit-content_body"
          value={formData.content_body}
          onChange={(e) => setFormData({...formData, content_body: e.target.value})}
          placeholder="Escribe el contenido principal"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-scheduled_for">Programar para</Label>
        <Input
          id="edit-scheduled_for"
          type="datetime-local"
          value={formData.scheduled_for}
          onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Contenido'}
        </Button>
      </div>
    </form>
  )
}