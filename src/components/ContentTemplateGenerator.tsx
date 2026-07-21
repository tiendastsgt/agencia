import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { contentTemplateEngine, ContentTemplate, ContentRequest } from '@/lib/content-template-engine'
import { useActiveClient } from '@/lib/client-context'
import { toast } from '@/components/ui/sonner'
import { Sparkles, Download, RefreshCw, Eye, Settings } from 'lucide-react'

interface GeneratedContent {
  template: ContentTemplate
  api_used: string
  content: any
  metadata: {
    generated_at: string
    variables_used: Record<string, string>
    platforms: string[]
  }
}

export default function ContentTemplateGenerator() {
  const { activeClient } = useActiveClient()
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [contentType, setContentType] = useState<'image' | 'video'>('image')
  const [videoDuration, setVideoDuration] = useState<number>(5)
  const [brandContext, setBrandContext] = useState({
    name: activeClient?.name || '',
    industry: activeClient?.industry || '',
    personality: 'professional',
    colorPalette: ['#3B82F6', '#10B981', '#F59E0B']
  })

  const availablePlatforms = [
    { id: 'Instagram', name: 'Instagram', icon: '📷' },
    { id: 'TikTok', name: 'TikTok', icon: '🎵' },
    { id: 'LinkedIn', name: 'LinkedIn', icon: '💼' },
    { id: 'YouTube', name: 'YouTube', icon: '📺' },
    { id: 'Facebook', name: 'Facebook', icon: '👥' },
    { id: 'Twitter', name: 'Twitter/X', icon: '🐦' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (activeClient) {
      setBrandContext(prev => ({
        ...prev,
        name: activeClient.name,
        industry: activeClient.industry || prev.industry
      }))
    }
  }, [activeClient])

  const loadTemplates = async () => {
    try {
      const availableTemplates = contentTemplateEngine.getAvailableTemplates()
      setTemplates(availableTemplates)
      if (availableTemplates.length > 0) {
        setSelectedTemplate(availableTemplates[0].id)
        initializeVariables(availableTemplates[0])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Error al cargar las plantillas')
    }
  }

  const initializeVariables = (template: ContentTemplate) => {
    const initialVariables: Record<string, string> = {}
    Object.keys(template.variables).forEach(key => {
      const options = template.variables[key]
      if (Array.isArray(options) && options.length > 0) {
        initialVariables[key] = options[0]
      }
    })
    setVariables(initialVariables)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      initializeVariables(template)
    }
  }

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePlatformToggle = (platformId: string) => {
    setTargetPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(p => p !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  const generateContent = async () => {
    if (!selectedTemplate || targetPlatforms.length === 0) {
      toast.error('Selecciona una plantilla y al menos una plataforma')
      return
    }

    setIsGenerating(true)
    try {
      const request: ContentRequest = {
        templateType: selectedTemplate,
        variables,
        targetPlatforms,
        brandContext,
        contentType,
        duration: contentType === 'video' ? videoDuration : undefined
      }

      const result = await contentTemplateEngine.generateContent(request)
      setGeneratedContent(result)
      toast.success('Contenido generado exitosamente')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Error al generar el contenido')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generador de Contenido Visual Automatizado
          </CardTitle>
          <CardDescription>
            Crea contenido visual optimizado usando plantillas basadas en frameworks de marketing probados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selección de Tipo de Contenido */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Tipo de Contenido</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={contentType === 'image' ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setContentType('image')}
              >
                <span className="text-lg">🖼️</span>
                <span className="text-sm">Imagen</span>
              </Button>
              <Button
                variant={contentType === 'video' ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setContentType('video')}
              >
                <span className="text-lg">🎬</span>
                <span className="text-sm">Video</span>
              </Button>
            </div>
          </div>

          {/* Duración del Video */}
          {contentType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duración del Video (segundos)</Label>
              <Select
                value={videoDuration.toString()}
                onValueChange={(value) => setVideoDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 segundos</SelectItem>
                  <SelectItem value="5">5 segundos</SelectItem>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="15">15 segundos</SelectItem>
                  <SelectItem value="25">25 segundos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selección de Plantilla */}
          <div className="space-y-2">
            <Label htmlFor="template">Plantilla de Contenido</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <span>{template.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {template.framework}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información de la Plantilla Seleccionada */}
          {selectedTemplateData && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{selectedTemplateData.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedTemplateData.framework}</Badge>
                  <Badge variant="outline">{selectedTemplateData.hook_type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Audiencia Objetivo:</Label>
                  <p className="text-sm text-muted-foreground">{selectedTemplateData.target_audience}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Plataformas Recomendadas:</Label>
                  <div className="flex gap-1 mt-1">
                    {selectedTemplateData.platforms.map(platform => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Triggers Psicológicos:</Label>
                  <div className="flex gap-1 mt-1">
                    {selectedTemplateData.psychological_triggers.map(trigger => (
                      <Badge key={trigger} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variables Dinámicas */}
          {selectedTemplateData && Object.keys(selectedTemplateData.variables).length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Personalización de Variables</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedTemplateData.variables).map(([key, options]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </Label>
                    <Select
                      value={variables[key] || ''}
                      onValueChange={(value) => handleVariableChange(key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecciona ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(options) && options.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selección de Plataformas */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Plataformas de Destino</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePlatforms.map(platform => (
                <Button
                  key={platform.id}
                  variant={targetPlatforms.includes(platform.id) ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm">{platform.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Contexto de Marca */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Contexto de Marca</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Nombre de Marca</Label>
                <Input
                  id="brand-name"
                  value={brandContext.name}
                  onChange={(e) => setBrandContext(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre de tu marca"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industria</Label>
                <Input
                  id="industry"
                  value={brandContext.industry}
                  onChange={(e) => setBrandContext(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Tu industria"
                />
              </div>
            </div>
          </div>

          {/* Botón de Generación */}
          <Button
            onClick={generateContent}
            disabled={isGenerating || !selectedTemplate || targetPlatforms.length === 0}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generando Contenido...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Contenido Visual
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado Generado */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Contenido Generado
            </CardTitle>
            <CardDescription>
              Generado el {new Date(generatedContent.metadata.generated_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">API Utilizada:</Label>
                <Badge variant="outline" className="ml-2">
                  {generatedContent.api_used}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Plataformas:</Label>
                <div className="flex gap-1 mt-1">
                  {generatedContent.metadata.platforms.map(platform => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview del Contenido */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Vista Previa:</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                {(generatedContent.metadata as any)?.content_type === 'video' ? (
                  <div className="space-y-3">
                    {generatedContent.content.video_url && (
                      <video 
                        controls 
                        className="w-full max-w-md rounded-lg"
                        poster={generatedContent.content.thumbnail_url}
                      >
                        <source src={generatedContent.content.video_url} type="video/mp4" />
                        Tu navegador no soporta el elemento video.
                      </video>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Duración: {generatedContent.content.duration}s | 
                      Resolución: {generatedContent.content.resolution}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {generatedContent.content.image_url && (
                      <img 
                        src={generatedContent.content.image_url} 
                        alt="Generated content"
                        className="w-full max-w-md rounded-lg"
                      />
                    )}
                  </div>
                )}
                
                <div className="space-y-2 mt-3">
                  <div className="text-sm font-medium">
                    {generatedContent.template.visual_elements.opening_frame?.text_overlay}
                  </div>
                  {generatedContent.template.visual_elements.authority_proof && (
                    <div className="text-sm text-muted-foreground">
                      {generatedContent.template.visual_elements.authority_proof.content}
                    </div>
                  )}
                  {generatedContent.template.visual_elements.revelation_moment && (
                    <div className="text-sm font-medium">
                      {generatedContent.template.visual_elements.revelation_moment.text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Optimizar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGeneratedContent(null)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
