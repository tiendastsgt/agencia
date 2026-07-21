import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Plus, Download, Eye, Edit, Trash2, Palette, Layout, BarChart3, Image as ImageIcon } from 'lucide-react'
import ProfessionalInfographicRenderer from './ProfessionalInfographicRenderer'
import { infographicImageService } from '@/lib/infographic-image-service'
import { toast } from 'sonner'
import { 
  InfographicData, 
  InfographicGenerationRequest, 
  InfographicTemplate,
  InfographicRecord,
  InfographicCategory
} from '@/lib/types/infographic'
import { infographicService } from '@/lib/infographic-service'

interface InfographicManagerProps {
  clientId?: string
  campaignId?: string
}

export default function InfographicManager({ clientId, campaignId }: InfographicManagerProps) {
  const [activeTab, setActiveTab] = useState('create')
  const [loading, setLoading] = useState(false)
  const [infographics, setInfographics] = useState<InfographicRecord[]>([])
  const [templates, setTemplates] = useState<InfographicTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [viewingInfographic, setViewingInfographic] = useState<InfographicRecord | null>(null)
  
  // Estados para crear infografía
  const [infographicData, setInfographicData] = useState<Partial<InfographicData>>({
    title: '',
    subtitle: '',
    description: '',
    theme: {
      name: 'Modern Blue',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      style: 'modern'
    },
    layout: {
      type: 'vertical',
      columns: 1,
      sections: 3,
      spacing: 'normal'
    },
    sections: [],
    metadata: {
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      category: 'marketing',
      language: 'es',
      version: '1.0.0'
    },
    style: {
      borderRadius: 8,
      shadow: true,
      border: false,
      backgroundPattern: 'none'
    }
  })

  useEffect(() => {
    loadInfographics()
    loadTemplates()
  }, [])

  const loadInfographics = async () => {
    try {
      setLoading(true)
      // Cargar las infografías del usuario actual
      const userInfographics = await infographicService.getUserInfographics()
      setInfographics(userInfographics)
      console.log('📊 Infografías cargadas:', userInfographics.length)
    } catch (error) {
      console.error('Error al cargar infografías:', error)
      toast.error(`Error al cargar infografías: ${error.message}`)
      setInfographics([]) // Asegurar que el estado esté vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const templateList = await infographicService.getInfographicTemplates()
      setTemplates(templateList)
    } catch (error) {
      toast.error('Error al cargar templates')
    }
  }

  const handleViewInfographic = (infographic: InfographicRecord) => {
    setViewingInfographic(infographic)
  }

  const handleDownloadInfographic = async (infographic: InfographicRecord, provider: 'dalle' | 'stability' | 'gemini' = 'gemini') => {
    try {
      // Generar y descargar como imagen usando AI real
      await infographicImageService.downloadInfographicAsImage(
        infographic.data, 
        `${infographic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`,
        provider
      )
      
      toast.success(`Infografía generada con ${provider.toUpperCase()} y descargada correctamente`)
    } catch (error) {
      console.error('Error al descargar infografía:', error)
      toast.error(`Error al descargar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('Selecciona un template')
      return
    }

    try {
      setLoading(true)
      const templateData = await infographicService.createFromTemplate(selectedTemplate, infographicData)
      setInfographicData(templateData)
      toast.success('Template aplicado correctamente')
    } catch (error) {
      toast.error('Error al aplicar template')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInfographic = async () => {
    if (!infographicData.title || !infographicData.sections || infographicData.sections.length === 0) {
      toast.error('Completa los datos requeridos')
      return
    }

    try {
      setLoading(true)
      
      const request: InfographicGenerationRequest = {
        data: infographicData as InfographicData,
        provider: 'dalle',
        size: '1024x1792',
        quality: 'hd',
        count: 1
      }

      const response = await infographicService.generateInfographic(request)
      
      if (response.success) {
        // Guardar la infografía en la base de datos
        try {
          const infographicRecord = {
            title: infographicData.title || 'Infografía sin título',
            data: infographicData,
            status: 'completed'
            // tags: infographicData.metadata?.tags || [], // Temporarily removed - column doesn't exist
            // client_id: clientId || null, // Temporarily removed - column doesn't exist
            // campaign_id: campaignId || null, // Temporarily removed - column doesn't exist
            // description: infographicData.description || infographicData.subtitle || '', // Temporarily removed
            // generated_images: response.images, // Temporarily removed - column doesn't exist
            // category: infographicData.metadata?.category || 'marketing' // Temporarily removed
          }
          
          await infographicService.saveInfographic(infographicRecord)
          toast.success('Infografía generada y guardada correctamente')
          
          // Recargar la lista de infografías
          await loadInfographics()
        } catch (saveError) {
          console.error('Error al guardar infografía:', saveError)
          toast.error(`Error al guardar: ${saveError.message}`)
          // No mostrar mensaje de éxito si falló el guardado
        }
      } else {
        toast.error(`Error: ${response.error}`)
      }
    } catch (error) {
      toast.error('Error al generar infografía')
    } finally {
      setLoading(false)
    }
  }

  const addSection = (type: string) => {
    const newSection = {
      id: `section_${Date.now()}`,
      type: type as any,
      title: `Nueva sección ${type}`,
      content: getDefaultSectionContent(type),
      position: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }
    }

    setInfographicData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }))
  }

  const getDefaultSectionContent = (type: string) => {
    switch (type) {
      case 'stats':
        return {
          stats: {
            items: [
              { label: 'Métrica 1', value: '100', unit: '%' },
              { label: 'Métrica 2', value: '50', unit: 'K' }
            ],
            layout: 'horizontal'
          }
        }
      case 'text':
        return {
          text: {
            content: 'Contenido de texto aquí...',
            format: 'paragraph'
          }
        }
      case 'list':
        return {
          list: {
            items: [
              { text: 'Elemento 1' },
              { text: 'Elemento 2' },
              { text: 'Elemento 3' }
            ],
            type: 'bullet'
          }
        }
      case 'chart':
        return {
          chart: {
            type: 'bar',
            data: [
              { label: 'A', value: 30 },
              { label: 'B', value: 50 },
              { label: 'C', value: 20 }
            ],
            showLegend: true,
            showValues: true
          }
        }
      default:
        return {}
    }
  }

  const removeSection = (index: number) => {
    setInfographicData(prev => ({
      ...prev,
      sections: prev.sections?.filter((_, i) => i !== index) || []
    }))
  }

  const updateSection = (index: number, updates: any) => {
    setInfographicData(prev => ({
      ...prev,
      sections: prev.sections?.map((section, i) => 
        i === index ? { ...section, ...updates } : section
      ) || []
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generador de Infografías</h1>
          <p className="text-muted-foreground">
            Crea infografías profesionales a partir de datos JSON
          </p>
        </div>
        <Button onClick={handleGenerateInfographic} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
          Generar Infografía
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Crear Nueva</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="my-infographics">Mis Infografías</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de configuración */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Configuración Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={infographicData.title || ''}
                      onChange={(e) => setInfographicData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título de la infografía"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input
                      id="subtitle"
                      value={infographicData.subtitle || ''}
                      onChange={(e) => setInfographicData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Subtítulo opcional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={infographicData.description || ''}
                      onChange={(e) => setInfographicData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción de la infografía"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={infographicData.metadata?.category || 'marketing'}
                      onValueChange={(value) => setInfographicData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata!, category: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="social-media">Redes Sociales</SelectItem>
                        <SelectItem value="business">Negocios</SelectItem>
                        <SelectItem value="education">Educación</SelectItem>
                        <SelectItem value="healthcare">Salud</SelectItem>
                        <SelectItem value="technology">Tecnología</SelectItem>
                        <SelectItem value="finance">Finanzas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Tema y Estilo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="style">Estilo</Label>
                    <Select
                      value={infographicData.theme?.style || 'modern'}
                      onValueChange={(value) => setInfographicData(prev => ({
                        ...prev,
                        theme: { ...prev.theme!, style: value as any }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Moderno</SelectItem>
                        <SelectItem value="classic">Clásico</SelectItem>
                        <SelectItem value="minimalist">Minimalista</SelectItem>
                        <SelectItem value="corporate">Corporativo</SelectItem>
                        <SelectItem value="creative">Creativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select
                      value={infographicData.layout?.type || 'vertical'}
                      onValueChange={(value) => setInfographicData(prev => ({
                        ...prev,
                        layout: { ...prev.layout!, type: value as any }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="timeline">Timeline</SelectItem>
                        <SelectItem value="comparison">Comparación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="primary-color">Color Primario</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={infographicData.theme?.primaryColor || '#3B82F6'}
                        onChange={(e) => setInfographicData(prev => ({
                          ...prev,
                          theme: { ...prev.theme!, primaryColor: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary-color">Color Secundario</Label>
                      <Input
                        id="secondary-color"
                        type="color"
                        value={infographicData.theme?.secondaryColor || '#1E40AF'}
                        onChange={(e) => setInfographicData(prev => ({
                          ...prev,
                          theme: { ...prev.theme!, secondaryColor: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel de secciones */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Secciones de la Infografía
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => addSection('stats')}>
                        <Plus className="h-4 w-4 mr-1" />
                        Estadísticas
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addSection('text')}>
                        <Plus className="h-4 w-4 mr-1" />
                        Texto
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addSection('list')}>
                        <Plus className="h-4 w-4 mr-1" />
                        Lista
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addSection('chart')}>
                        <Plus className="h-4 w-4 mr-1" />
                        Gráfico
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {infographicData.sections && infographicData.sections.length > 0 ? (
                    <div className="space-y-4">
                      {infographicData.sections.map((section, index) => (
                        <Card key={section.id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{section.type}</Badge>
                                <span className="font-medium">{section.title}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeSection(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground">
                              {section.type === 'stats' && `${section.content.stats?.items.length || 0} métricas`}
                              {section.type === 'text' && 'Contenido de texto'}
                              {section.type === 'list' && `${section.content.list?.items.length || 0} elementos`}
                              {section.type === 'chart' && `Gráfico ${section.content.chart?.type}`}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay secciones agregadas</p>
                      <p className="text-sm">Agrega secciones usando los botones de arriba</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Templates de Infografías</h2>
              <p className="text-muted-foreground">
                Selecciona un template para comenzar rápidamente
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateFromTemplate} disabled={!selectedTemplate}>
                Usar Template
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <div className="flex gap-1">
                      {template.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-infographics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Mis Infografías</h2>
            <p className="text-muted-foreground">
              Gestiona tus infografías creadas
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : infographics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infographics.map((infographic) => (
                <Card key={infographic.id}>
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                      <ProfessionalInfographicRenderer 
                        data={infographic.data} 
                        className="scale-50 origin-top-left w-[200%] h-[200%]"
                      />
                    </div>
                    <CardTitle className="text-lg">{infographic.title}</CardTitle>
                    <CardDescription>Estado: {infographic.status}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{infographic.status}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewInfographic(infographic)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadInfographic(infographic)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tienes infografías creadas</p>
              <p className="text-sm">Crea tu primera infografía en la pestaña "Crear Nueva"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para ver infografía */}
      <Dialog open={!!viewingInfographic} onOpenChange={() => setViewingInfographic(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingInfographic?.title}</DialogTitle>
            <DialogDescription>
              Estado: {viewingInfographic?.status} | Creado: {viewingInfographic?.created_at ? new Date(viewingInfographic.created_at).toLocaleString() : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          
          {viewingInfographic && (
            <div className="space-y-4">
              {/* Vista previa visual de la infografía */}
              <div className="border rounded-lg overflow-hidden">
                <ProfessionalInfographicRenderer 
                  data={viewingInfographic.data} 
                  className="max-w-full"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="provider-select">Proveedor de IA:</Label>
                  <Select defaultValue="gemini" onValueChange={(value: 'dalle' | 'stability' | 'gemini') => {
                    // Actualizar el proveedor seleccionado
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecciona proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">🤖 Google Gemini (Recomendado)</SelectItem>
                      <SelectItem value="dalle">🎨 DALL-E 3 (OpenAI)</SelectItem>
                      <SelectItem value="stability">⚡ Stability AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleDownloadInfographic(viewingInfographic, 'gemini')}>
                    <Download className="h-4 w-4 mr-2" />
                    Generar con Gemini
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadInfographic(viewingInfographic, 'dalle')}>
                    <Download className="h-4 w-4 mr-2" />
                    Generar con DALL-E
                  </Button>
                  <Button variant="outline" onClick={() => setViewingInfographic(null)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
