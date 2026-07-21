import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UnifiedVideoService, UnifiedVideoRequest, UnifiedVideoResult, ProviderStatus } from '@/lib/unified-video-service'
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
  Video, 
  Wand2, 
  Download, 
  RefreshCw,
  Settings,
  Play,
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
  Camera,
  Film,
  Clapperboard
} from 'lucide-react'

interface UnifiedVideoManagerProps {
  className?: string
}

export default function UnifiedVideoManager({ className }: UnifiedVideoManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [unifiedService, setUnifiedService] = useState<UnifiedVideoService | null>(null)
  const [generatedVideos, setGeneratedVideos] = useState<UnifiedVideoResult[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'runway' | 'pika' | 'luma'>('runway')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9')
  const [selectedDuration, setSelectedDuration] = useState(4)
  const [isGenerating, setIsGenerating] = useState(false)
  const [providersStatus, setProvidersStatus] = useState<ProviderStatus[]>([])

  // Inicializar servicio unificado
  useEffect(() => {
    const initUnifiedService = async () => {
      try {
        const { createUnifiedVideoService } = await import('@/lib/unified-video-service')
        const service = await createUnifiedVideoService(activeClient?.id)
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

  // Mutation para generar videos
  const generateVideoMutation = useMutation({
    mutationFn: async (request: UnifiedVideoRequest) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateVideo(request)
    },
    onSuccess: (result) => {
      setGeneratedVideos(prev => [result, ...prev])
      toast.success(`Video generado con ${result.provider.toUpperCase()}`)
    },
    onError: (error: any) => {
      toast.error(`Error generando video: ${error.message}`)
    }
  })

  // Mutation para generar variaciones
  const generateVariationsMutation = useMutation({
    mutationFn: async ({ prompt, provider, count, options }: {
      prompt: string
      provider: 'runway' | 'pika' | 'luma'
      count: number
      options: any
    }) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateVariations(prompt, provider, count, options)
    },
    onSuccess: (results) => {
      setGeneratedVideos(prev => [...results, ...prev])
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
      providers: ('runway' | 'pika' | 'luma')[]
      options: any
    }) => {
      if (!unifiedService) throw new Error('Servicio no disponible')
      return await unifiedService.generateComparison(prompt, providers, options)
    },
    onSuccess: (results) => {
      setGeneratedVideos(prev => [...results, ...prev])
      toast.success(`Comparación generada con ${results.length} proveedores`)
    },
    onError: (error: any) => {
      toast.error(`Error generando comparación: ${error.message}`)
    }
  })

  const handleGenerateVideo = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Por favor ingresa un prompt')
      return
    }

    setIsGenerating(true)
    try {
      const request: UnifiedVideoRequest = {
        prompt: currentPrompt,
        provider: selectedProvider,
        options: {
          // RunwayML options
          runway_model: selectedProvider === 'runway' ? selectedModel as any : undefined,
          runway_style: selectedProvider === 'runway' ? selectedStyle as any : undefined,
          runway_motion: 'moderate',
          
          // Pika Labs options
          pika_model: selectedProvider === 'pika' ? selectedModel as any : undefined,
          pika_style: selectedProvider === 'pika' ? selectedStyle as any : undefined,
          pika_motion: 'moderate',
          pika_scene_ingredients: false,
          
          // Luma AI options
          luma_model: selectedProvider === 'luma' ? selectedModel as any : undefined,
          luma_style: selectedProvider === 'luma' ? selectedStyle as any : undefined,
          luma_motion: 'moderate',
          
          // Common options
          duration: selectedDuration,
          resolution: '720p',
          aspect_ratio: selectedAspectRatio as any,
          seed: Math.floor(Math.random() * 1000000)
        }
      }

      await generateVideoMutation.mutateAsync(request)
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
          duration: selectedDuration,
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
      .map(p => p.provider as 'runway' | 'pika' | 'luma')

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
          duration: selectedDuration,
          aspect_ratio: selectedAspectRatio,
          style: selectedStyle
        }
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadVideo = (video: UnifiedVideoResult) => {
    const link = document.createElement('a')
    link.href = video.video_url
    link.download = `video-${video.provider}-${Date.now()}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Video descargado')
  }

  const handleCopyVideoUrl = (video: UnifiedVideoResult) => {
    navigator.clipboard.writeText(video.video_url)
    toast.success('URL copiada al portapapeles')
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'runway': return <Film className="h-4 w-4" />
      case 'pika': return <Clapperboard className="h-4 w-4" />
      case 'luma': return <Camera className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'runway': return 'bg-purple-100 text-purple-800'
      case 'pika': return 'bg-pink-100 text-pink-800'
      case 'luma': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'runway': return 'RunwayML'
      case 'pika': return 'Pika Labs'
      case 'luma': return 'Luma AI'
      default: return provider
    }
  }

  const getAvailableModels = (provider: string) => {
    switch (provider) {
      case 'runway':
        return [
          { value: 'gen-4-turbo', label: 'Gen-4 Turbo (Recomendado)' },
          { value: 'gen-4-images', label: 'Gen-4 Images' }
        ]
      case 'pika':
        return [
          { value: 'pika-1.0', label: 'Pika 1.0 ($0.05/seg)' },
          { value: 'pika-1.5', label: 'Pika 1.5 ($0.07/seg)' },
          { value: 'pika-2.0', label: 'Pika 2.0 ($0.11/seg)' }
        ]
      case 'luma':
        return [
          { value: 'luma-ray2', label: 'Luma Ray2 (5-10 seg)' },
          { value: 'luma-ray1.6', label: 'Luma Ray1.6 (Variable)' }
        ]
      default:
        return []
    }
  }

  const getAvailableStyles = (provider: string) => {
    switch (provider) {
      case 'runway':
        return [
          { value: 'cinematic', label: 'Cinematográfico' },
          { value: 'realistic', label: 'Realista' },
          { value: 'artistic', label: 'Artístico' },
          { value: 'documentary', label: 'Documental' }
        ]
      case 'pika':
        return [
          { value: 'realistic', label: 'Realista' },
          { value: 'anime', label: 'Anime' },
          { value: 'cinematic', label: 'Cinematográfico' },
          { value: 'artistic', label: 'Artístico' }
        ]
      case 'luma':
        return [
          { value: 'realistic', label: 'Realista' },
          { value: 'cinematic', label: 'Cinematográfico' },
          { value: 'artistic', label: 'Artístico' },
          { value: 'documentary', label: 'Documental' }
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
              Selecciona un cliente para gestionar generación de videos
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
          <Video className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Generación de Videos Unificada</h2>
            <p className="text-muted-foreground">
              Genera videos con RunwayML, Pika Labs y Luma AI para {activeClient.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            3 Proveedores
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
            Los servicios de generación de videos no están configurados. Ve a la página de credenciales para configurarlos.
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
                    Generar Video
                  </CardTitle>
                  <CardDescription>
                    Crea videos usando múltiples proveedores de IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prompt</label>
                    <Textarea
                      placeholder="Describe el video que quieres generar..."
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
                      <label className="text-sm font-medium mb-2 block">Duración</label>
                      <Select value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 segundos</SelectItem>
                          <SelectItem value="4">4 segundos</SelectItem>
                          <SelectItem value="6">6 segundos</SelectItem>
                          <SelectItem value="8">8 segundos</SelectItem>
                          <SelectItem value="10">10 segundos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Aspecto</label>
                      <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                          <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
                          <SelectItem value="4:3">4:3 (Clásico)</SelectItem>
                          <SelectItem value="3:4">3:4 (Vertical)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Resolución</label>
                      <Select defaultValue="720p">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">720p (HD)</SelectItem>
                          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
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
                      onClick={handleGenerateVideo}
                      disabled={isGenerating || !currentPrompt.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generar Video
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
                      <span className="text-sm">Duración:</span>
                      <Badge variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        {selectedDuration}s
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
                        <span>Videos generados:</span>
                        <span className="font-medium">{generatedVideos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proveedores disponibles:</span>
                        <span className="font-medium">
                          {providersStatus.filter(p => p.available).length}/3
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
            {generatedVideos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {generatedVideos.map((video, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="relative group">
                          <video
                            src={video.video_url}
                            poster={video.thumbnail_url}
                            className="w-full h-48 object-cover rounded-lg"
                            controls
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                              <Button size="sm" onClick={() => handleDownloadVideo(video)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCopyVideoUrl(video)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getProviderColor(video.provider)}>
                              {getProviderIcon(video.provider)}
                              <span className="ml-1">{getProviderName(video.provider)}</span>
                            </Badge>
                            <Badge variant="outline">
                              {video.metadata.aspect_ratio}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {video.prompt_used}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Modelo: {video.model}</span>
                            <span>{video.metadata.duration}s</span>
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
                    <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay videos generados aún</p>
                    <p className="text-sm text-muted-foreground">Ve a la pestaña "Generar" para crear tu primer video</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Proveedores */}
          <TabsContent value="providers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
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
                  Ajustes avanzados para la generación de videos
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
                    <label className="text-sm font-medium mb-2 block">Duración por defecto</label>
                    <Select value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 segundos</SelectItem>
                        <SelectItem value="4">4 segundos</SelectItem>
                        <SelectItem value="6">6 segundos</SelectItem>
                        <SelectItem value="8">8 segundos</SelectItem>
                        <SelectItem value="10">10 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Información de Proveedores</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>RunwayML:</span>
                      <span className="font-medium">Gen-4 Turbo, Gen-4 Images - Calidad cinematográfica</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pika Labs:</span>
                      <span className="font-medium">Pika 1.0, 1.5, 2.0 - Pago por segundo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Luma AI:</span>
                      <span className="font-medium">Ray2, Ray1.6 - Movimiento realista</span>
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
