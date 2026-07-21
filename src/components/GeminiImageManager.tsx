import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GeminiImageService, GeminiImageGenerationRequest, GeminiImageResult } from '@/lib/gemini-image-api'
import { useActiveClient } from '@/lib/client-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Image, 
  Wand2, 
  Download, 
  RefreshCw,
  Settings,
  Palette,
  AspectRatio,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Share2,
  Heart,
  Star,
  Zap
} from 'lucide-react'

interface GeminiImageManagerProps {
  className?: string
}

export default function GeminiImageManager({ className }: GeminiImageManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [geminiService, setGeminiService] = useState<GeminiImageService | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeminiImageResult[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<'photographic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'abstract'>('photographic')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1')
  const [isGenerating, setIsGenerating] = useState(false)

  // Inicializar servicio de Gemini
  useEffect(() => {
    const initGeminiService = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const apiKey = 'your_gemini_api_key'
        
        if (apiKey) {
          const service = new GeminiImageService(apiKey)
          setGeminiService(service)
        }
      } catch (error) {
        console.error('Error inicializando Gemini service:', error)
      }
    }

    initGeminiService()
  }, [activeClient])

  // Mutation para generar imágenes
  const generateImageMutation = useMutation({
    mutationFn: async (request: GeminiImageGenerationRequest) => {
      if (!geminiService) throw new Error('Servicio no disponible')
      return await geminiService.generateImage(request)
    },
    onSuccess: (result) => {
      setGeneratedImages(prev => [result, ...prev])
      toast.success('Imagen generada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error generando imagen: ${error.message}`)
    }
  })

  // Mutation para generar variaciones
  const generateVariationsMutation = useMutation({
    mutationFn: async (request: GeminiImageGenerationRequest) => {
      if (!geminiService) throw new Error('Servicio no disponible')
      return await geminiService.generateVariations(request, 4)
    },
    onSuccess: (results) => {
      setGeneratedImages(prev => [...results, ...prev])
      toast.success(`${results.length} variaciones generadas`)
    },
    onError: (error: any) => {
      toast.error(`Error generando variaciones: ${error.message}`)
    }
  })

  // Mutation para optimizar prompt
  const optimizePromptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!geminiService) throw new Error('Servicio no disponible')
      return await geminiService.optimizePrompt(prompt, selectedStyle)
    },
    onSuccess: (optimizedPrompt) => {
      setCurrentPrompt(optimizedPrompt)
      toast.success('Prompt optimizado')
    },
    onError: (error: any) => {
      toast.error(`Error optimizando prompt: ${error.message}`)
    }
  })

  const handleGenerateImage = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt')
      return
    }

    setIsGenerating(true)
    try {
      await generateImageMutation.mutateAsync({
        prompt: currentPrompt,
        style: selectedStyle,
        aspect_ratio: selectedAspectRatio,
        quality: 'high',
        safety_filter: true
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateVariations = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt')
      return
    }

    setIsGenerating(true)
    try {
      await generateVariationsMutation.mutateAsync({
        prompt: currentPrompt,
        style: selectedStyle,
        aspect_ratio: selectedAspectRatio,
        quality: 'high',
        safety_filter: true
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOptimizePrompt = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt para optimizar')
      return
    }

    await optimizePromptMutation.mutateAsync(currentPrompt)
  }

  const handleDownloadImage = (image: GeminiImageResult) => {
    const link = document.createElement('a')
    link.href = image.image_url
    link.download = `gemini-image-${Date.now()}.${image.mime_type.split('/')[1]}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Imagen descargada')
  }

  const handleCopyImageUrl = (image: GeminiImageResult) => {
    navigator.clipboard.writeText(image.image_url)
    toast.success('URL copiada al portapapeles')
  }

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'photographic': return <Image className="h-4 w-4" />
      case 'artistic': return <Palette className="h-4 w-4" />
      case 'minimalist': return <Zap className="h-4 w-4" />
      case 'vintage': return <Star className="h-4 w-4" />
      case 'modern': return <Sparkles className="h-4 w-4" />
      case 'abstract': return <Wand2 className="h-4 w-4" />
      default: return <Image className="h-4 w-4" />
    }
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'photographic': return 'bg-blue-100 text-blue-800'
      case 'artistic': return 'bg-purple-100 text-purple-800'
      case 'minimalist': return 'bg-gray-100 text-gray-800'
      case 'vintage': return 'bg-yellow-100 text-yellow-800'
      case 'modern': return 'bg-green-100 text-green-800'
      case 'abstract': return 'bg-pink-100 text-pink-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar Gemini Image Generation
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Gemini Image Generation</h2>
            <p className="text-muted-foreground">
              Generación de imágenes con IA usando Gemini 2.5 Flash (Nano Banana) para {activeClient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Nano Banana
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            v2.5 Flash
          </Badge>
        </div>
      </div>

      {!geminiService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de Gemini no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generar</TabsTrigger>
            <TabsTrigger value="gallery">Galería</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Generar */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Panel de generación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Generar Imagen
                  </CardTitle>
                  <CardDescription>
                    Crea imágenes únicas usando Gemini 2.5 Flash Image (Nano Banana)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prompt</label>
                    <Textarea
                      placeholder="Describe la imagen que quieres generar..."
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estilo</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value as any)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="photographic">Fotográfico</option>
                        <option value="artistic">Artístico</option>
                        <option value="minimalist">Minimalista</option>
                        <option value="vintage">Vintage</option>
                        <option value="modern">Moderno</option>
                        <option value="abstract">Abstracto</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Aspecto</label>
                      <select
                        value={selectedAspectRatio}
                        onChange={(e) => setSelectedAspectRatio(e.target.value as any)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="1:1">1:1 (Cuadrado)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="4:3">4:3 (Clásico)</option>
                        <option value="3:4">3:4 (Vertical)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !currentPrompt.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generar Imagen
                    </Button>
                    <Button
                      onClick={handleOptimizePrompt}
                      disabled={optimizePromptMutation.isPending || !currentPrompt.trim()}
                      variant="outline"
                    >
                      {optimizePromptMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={handleGenerateVariations}
                    disabled={isGenerating || !currentPrompt.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Generar 4 Variaciones
                  </Button>
                </CardContent>
              </Card>

              {/* Panel de configuración */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estilo actual:</span>
                      <Badge className={getStyleColor(selectedStyle)}>
                        {getStyleIcon(selectedStyle)}
                        <span className="ml-1 capitalize">{selectedStyle}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aspecto:</span>
                      <Badge variant="outline">
                        <AspectRatio className="h-3 w-3 mr-1" />
                        {selectedAspectRatio}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Calidad:</span>
                      <Badge variant="outline">Alta</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Filtro de seguridad:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activado
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Imágenes generadas:</span>
                        <span className="font-medium">{generatedImages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última generación:</span>
                        <span className="font-medium">
                          {generatedImages.length > 0 ? 'Hace unos momentos' : 'Nunca'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Galería */}
          <TabsContent value="gallery" className="space-y-4">
            {generatedImages.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {generatedImages.map((image, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="relative group">
                          <img
                            src={image.image_url}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                              <Button size="sm" onClick={() => handleDownloadImage(image)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCopyImageUrl(image)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStyleColor(image.style)}>
                              {getStyleIcon(image.style)}
                              <span className="ml-1 capitalize">{image.style}</span>
                            </Badge>
                            <Badge variant="outline">
                              {image.width}x{image.height}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {image.prompt_used}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Tokens: {image.usage_metadata.total_token_count}</span>
                            <span>{image.mime_type}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay imágenes generadas aún</p>
                    <p className="text-sm text-muted-foreground">Ve a la pestaña "Generar" para crear tu primera imagen</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Configuración */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración Avanzada
                </CardTitle>
                <CardDescription>
                  Ajustes avanzados para la generación de imágenes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Temperatura</label>
                    <Input type="range" min="0" max="1" step="0.1" defaultValue="0.7" />
                    <p className="text-xs text-muted-foreground mt-1">Controla la creatividad (0.0 = conservador, 1.0 = muy creativo)</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Top P</label>
                    <Input type="range" min="0" max="1" step="0.1" defaultValue="0.8" />
                    <p className="text-xs text-muted-foreground mt-1">Controla la diversidad de tokens</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Top K</label>
                    <Input type="number" min="1" max="100" defaultValue="40" />
                    <p className="text-xs text-muted-foreground mt-1">Número de tokens candidatos</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Tokens</label>
                    <Input type="number" min="100" max="8192" defaultValue="8192" />
                    <p className="text-xs text-muted-foreground mt-1">Máximo de tokens de salida</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Filtros de Seguridad</h4>
                  <div className="space-y-2">
                    {[
                      { category: 'HARASSMENT', label: 'Acoso' },
                      { category: 'HATE_SPEECH', label: 'Discurso de odio' },
                      { category: 'SEXUALLY_EXPLICIT', label: 'Contenido sexual' },
                      { category: 'DANGEROUS_CONTENT', label: 'Contenido peligroso' }
                    ].map((filter) => (
                      <div key={filter.category} className="flex items-center justify-between">
                        <span className="text-sm">{filter.label}</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Bloqueado
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
