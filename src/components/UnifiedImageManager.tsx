import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UnifiedImageService, UnifiedImageRequest, UnifiedImageResult, ProviderStatus } from '@/lib/unified-image-service'
import { useActiveClient } from '@/lib/client-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Zap,
  Layers,
  Compare,
  Target,
  Crown,
  Bot,
  Brain,
  Camera
} from 'lucide-react'

interface UnifiedImageManagerProps {
  className?: string
}

export default function UnifiedImageManager({ className }: UnifiedImageManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [unifiedService, setUnifiedService] = useState<UnifiedImageService | null>(null)
  const [generatedImages, setGeneratedImages] = useState<UnifiedImageResult[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'dalle3' | 'stability' | 'midjourney' | 'gemini'>('gemini')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [providersStatus, setProvidersStatus] = useState<ProviderStatus[]>([])

  // Inicializar servicio unificado
  useEffect(() => {
    const initUnifiedService = async () => {
      try {
        const { createUnifiedImageService } = await import('@/lib/unified-image-service')
        const service = await createUnifiedImageService(activeClient?.id)
        setUnifiedService(service)
        
        // Obtener estado de proveedores
        if (service) {
          const statuses = await service.getProvidersStatus()
          setProvidersStatus(statuses)
        }
      } catch (error) {
        console.error('Error inicializando servicio unificado:', error)
      }
    }

    if (activeClient) {
      initUnifiedService()
    }
  }, [activeClient])

  // Mutation para generar imágenes
  const generateImageMutation = useMutation({
    mutationFn: async (request: UnifiedImageRequest) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateImage(request)
    },
    onSuccess: (result) => {
      setGeneratedImages(prev => [result, ...prev])
      toast.success(`Imagen generada con ${result.provider.toUpperCase()}`)
    },
    onError: (error: any) => {
      toast.error(`Error generando imagen: ${error.message}`)
    }
  })

  // Mutation para generar variaciones
  const generateVariationsMutation = useMutation({
    mutationFn: async ({ prompt, provider, count, options }: {
      prompt: string
      provider: 'dalle3' | 'stability' | 'midjourney' | 'gemini'
      count: number
      options: any
    }) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateVariations(prompt, provider, count, options)
    },
    onSuccess: (results) => {
      setGeneratedImages(prev => [...results, ...prev])
      toast.success(`${results.length} variaciones generadas`)
    },
    onError: (error: any) => {
      toast.error(`Error generando variaciones: ${error.message}`)
    }
  })

  // Mutation para comparación de proveedores
  const generateComparisonMutation = useMutation({
    mutationFn: async ({ prompt, providers, options }: {
      prompt: string
      providers: ('dalle3' | 'stability' | 'midjourney' | 'gemini')[]
      options: any
    }) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateComparison(prompt, providers, options)
    },
    onSuccess: (results) => {
      setGeneratedImages(prev => [...results, ...prev])
      toast.success(`Comparación generada con ${results.length} proveedores`)
    },
    onError: (error: any) => {
      toast.error(`Error generando comparación: ${error.message}`)
    }
  })

  const handleGenerateImage = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt')
      return
    }

    setIsGenerating(true)
    try {
      const request: UnifiedImageRequest = {
        prompt: currentPrompt,
        provider: selectedProvider,
        options: {
          // DALL-E 3 options
          size: selectedProvider === 'dalle3' ? (selectedAspectRatio === '1:1' ? '1024x1024' : 
                selectedAspectRatio === '16:9' ? '1792x1024' : '1024x1792') : undefined,
          quality: 'hd',
          style: 'vivid',
          
          // Stability AI options
          model: selectedProvider === 'stability' ? selectedModel as any : undefined,
          aspect_ratio: selectedProvider === 'stability' ? selectedAspectRatio as any : undefined,
          style_preset: selectedProvider === 'stability' ? selectedStyle as any : undefined,
          
          // Midjourney options
          mj_style: selectedProvider === 'midjourney' ? selectedStyle as any : undefined,
          mj_quality: '1',
          version: '6',
          mode: 'fast',
          
          // Gemini options
          gemini_style: selectedProvider === 'gemini' ? selectedStyle as any : undefined,
          gemini_aspect_ratio: selectedProvider === 'gemini' ? selectedAspectRatio as any : undefined,
          safety_filter: true
        }
      }

      await generateImageMutation.mutateAsync(request)
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
        provider: selectedProvider,
        count: 4,
        options: {
          aspect_ratio: selectedAspectRatio,
          style: selectedStyle
        }
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateComparison = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt')
      return
    }

    const availableProviders = providersStatus
      .filter(p => p.available)
      .map(p => p.provider as 'dalle3' | 'stability' | 'midjourney' | 'gemini')

    if (availableProviders.length < 2) {
      toast.error('Se necesitan al menos 2 proveedores disponibles para comparación')
      return
    }

    setIsGenerating(true)
    try {
      await generateComparisonMutation.mutateAsync({
        prompt: currentPrompt,
        providers: availableProviders,
        options: {
          aspect_ratio: selectedAspectRatio,
          style: selectedStyle
        }
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadImage = (image: UnifiedImageResult) => {
    const link = document.createElement('a')
    link.href = image.image_url
    link.download = `image-${image.provider}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Imagen descargada')
  }

  const handleCopyImageUrl = (image: UnifiedImageResult) => {
    navigator.clipboard.writeText(image.image_url)
    toast.success('URL copiada al portapapeles')
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'dalle3': return <Brain className="h-4 w-4" />
      case 'stability': return <Layers className="h-4 w-4" />
      case 'midjourney': return <Crown className="h-4 w-4" />
      case 'gemini': return <Sparkles className="h-4 w-4" />
      default: return <Image className="h-4 w-4" />
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'dalle3': return 'bg-green-100 text-green-800'
      case 'stability': return 'bg-blue-100 text-blue-800'
      case 'midjourney': return 'bg-purple-100 text-purple-800'
      case 'gemini': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'dalle3': return 'DALL-E 3'
      case 'stability': return 'Stability AI'
      case 'midjourney': return 'Midjourney'
      case 'gemini': return 'Gemini Image'
      default: return provider
    }
  }

  const getAvailableModels = (provider: string) => {
    switch (provider) {
      case 'stability':
        return [
          { value: 'stable-image-ultra', label: 'Stable Image Ultra (8 créditos)' },
          { value: 'stable-image-core', label: 'Stable Image Core (3 créditos)' },
          { value: 'sd3.5-large', label: 'SD 3.5 Large (6.5 créditos)' },
          { value: 'sd3.5-large-turbo', label: 'SD 3.5 Large Turbo (4 créditos)' },
          { value: 'sd3.5-medium', label: 'SD 3.5 Medium (3.5 créditos)' },
          { value: 'sd3.5-flash', label: 'SD 3.5 Flash (2.5 créditos)' }
        ]
      default:
        return []
    }
  }

  const getAvailableStyles = (provider: string) => {
    switch (provider) {
      case 'stability':
        return [
          { value: 'photographic', label: 'Fotográfico' },
          { value: 'cinematic', label: 'Cinematográfico' },
          { value: 'anime', label: 'Anime' },
          { value: 'fantasy-art', label: 'Arte Fantasía' },
          { value: 'digital-art', label: 'Arte Digital' },
          { value: 'comic-book', label: 'Cómic' },
          { value: '3d-model', label: 'Modelo 3D' },
          { value: 'analog-film', label: 'Película Analógica' }
        ]
      case 'midjourney':
        return [
          { value: 'original', label: 'Original' },
          { value: 'raw', label: 'Raw' },
          { value: 'cute', label: 'Cute' },
          { value: 'expressive', label: 'Expresivo' },
          { value: 'scenic', label: 'Escénico' }
        ]
      case 'gemini':
        return [
          { value: 'photographic', label: 'Fotográfico' },
          { value: 'artistic', label: 'Artístico' },
          { value: 'minimalist', label: 'Minimalista' },
          { value: 'vintage', label: 'Vintage' },
          { value: 'modern', label: 'Moderno' },
          { value: 'abstract', label: 'Abstracto' }
        ]
      default:
        return []
    }
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar generación de imágenes
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
            <h2 className="text-2xl font-bold">Generación de Imágenes Unificada</h2>
            <p className="text-muted-foreground">
              Genera imágenes con DALL-E 3, Stability AI, Midjourney y Gemini Image para {activeClient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            4 Proveedores
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Unificado
          </Badge>
        </div>
      </div>

      {!unifiedService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Los servicios de generación de imágenes no están configurados. Ve a la página de credenciales para configurarlos.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generar</TabsTrigger>
            <TabsTrigger value="gallery">Galería</TabsTrigger>
            <TabsTrigger value="providers">Proveedores</TabsTrigger>
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
                    Crea imágenes usando múltiples proveedores de IA
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
                      <label className="text-sm font-medium mb-2 block">Proveedor</label>
                      <Select value={selectedProvider} onValueChange={(value: any) => setSelectedProvider(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {providersStatus.map((provider) => (
                            <SelectItem 
                              key={provider.provider} 
                              value={provider.provider}
                              disabled={!provider.available}
                            >
                              <div className="flex items-center gap-2">
                                {getProviderIcon(provider.provider)}
                                <span>{getProviderName(provider.provider)}</span>
                                {provider.available ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Aspecto</label>
                      <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
                          <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                          <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          <SelectItem value="4:3">4:3 (Clásico)</SelectItem>
                          <SelectItem value="3:4">3:4 (Vertical)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {getAvailableModels(selectedProvider).length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Modelo</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableModels(selectedProvider).map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {getAvailableStyles(selectedProvider).length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estilo</label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStyles(selectedProvider).map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleGenerateVariations}
                      disabled={isGenerating || !currentPrompt.trim()}
                      variant="outline"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Variaciones
                    </Button>
                    <Button
                      onClick={handleGenerateComparison}
                      disabled={isGenerating || !currentPrompt.trim()}
                      variant="outline"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Compare className="h-4 w-4 mr-2" />
                      )}
                      Comparar
                    </Button>
                  </div>
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
                      <span className="text-sm">Proveedor actual:</span>
                      <Badge className={getProviderColor(selectedProvider)}>
                        {getProviderIcon(selectedProvider)}
                        <span className="ml-1">{getProviderName(selectedProvider)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aspecto:</span>
                      <Badge variant="outline">
                        <AspectRatio className="h-3 w-3 mr-1" />
                        {selectedAspectRatio}
                      </Badge>
                    </div>
                    {selectedModel && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Modelo:</span>
                        <Badge variant="outline">{selectedModel}</Badge>
                      </div>
                    )}
                    {selectedStyle && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Estilo:</span>
                        <Badge variant="outline">{selectedStyle}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Imágenes generadas:</span>
                        <span className="font-medium">{generatedImages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proveedores disponibles:</span>
                        <span className="font-medium">
                          {providersStatus.filter(p => p.available).length}/4
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
                            <Badge className={getProviderColor(image.provider)}>
                              {getProviderIcon(image.provider)}
                              <span className="ml-1">{getProviderName(image.provider)}</span>
                            </Badge>
                            <Badge variant="outline">
                              {image.metadata.aspect_ratio || '1:1'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {image.prompt_used}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Modelo: {image.model}</span>
                            {image.metadata.credits_used && (
                              <span>Créditos: {image.metadata.credits_used}</span>
                            )}
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

          {/* Tab: Proveedores */}
          <TabsContent value="providers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {providersStatus.map((provider) => (
                <Card key={provider.provider}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getProviderIcon(provider.provider)}
                      {getProviderName(provider.provider)}
                      {provider.available ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Estado:</span>
                        <Badge variant={provider.available ? "default" : "destructive"}>
                          {provider.available ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                      {provider.error && (
                        <div className="text-sm text-red-600">
                          Error: {provider.error}
                        </div>
                      )}
                      {provider.account_info && (
                        <div className="text-sm text-muted-foreground">
                          {JSON.stringify(provider.account_info, null, 2)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                    <label className="text-sm font-medium mb-2 block">Proveedor por defecto</label>
                    <Select value={selectedProvider} onValueChange={(value: any) => setSelectedProvider(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providersStatus.map((provider) => (
                          <SelectItem 
                            key={provider.provider} 
                            value={provider.provider}
                            disabled={!provider.available}
                          >
                            {getProviderName(provider.provider)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Aspecto por defecto</label>
                    <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                        <SelectItem value="4:3">4:3 (Clásico)</SelectItem>
                        <SelectItem value="3:4">3:4 (Vertical)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Información de Proveedores</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>DALL-E 3:</span>
                      <span className="font-medium">OpenAI - Alta calidad, interpretación precisa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stability AI:</span>
                      <span className="font-medium">Código abierto - Múltiples modelos, control granular</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Midjourney:</span>
                      <span className="font-medium">Estético - Arte conceptual, estilo distintivo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gemini Image:</span>
                      <span className="font-medium">Google - Generación nativa, contexto largo</span>
                    </div>
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
