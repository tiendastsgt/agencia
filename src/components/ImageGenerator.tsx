import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, Image as ImageIcon, Download, RefreshCw, Palette, Target, Share2 } from 'lucide-react'
import { imageGenerationService } from '@/lib/image-generation-service'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  size: string
  quality: string
  created_at: string
  revised_prompt?: string
}

interface UsageStats {
  totalImages: number
  imagesThisMonth: number
  totalCost: number
  mostUsedStyles: string[]
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1')
  const [selectedSize, setSelectedSize] = useState('1K')
  const [personGeneration, setPersonGeneration] = useState('allow_adult')
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [renderKey, setRenderKey] = useState(0)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [adObjective, setAdObjective] = useState('awareness')

  // Cargar historial y estadísticas al montar el componente
  useEffect(() => {
    // Deshabilitar temporalmente la carga del historial para evitar timeouts
    // loadImageHistory()
    // loadUsageStats()
  }, [])

  const loadImageHistory = async () => {
    try {
      const history = await imageGenerationService.createService()
      if (history) {
        const images = await history.getGeneratedImagesHistory(10)
        setGeneratedImages(images)
      }
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

  const loadUsageStats = async () => {
    try {
      const service = await imageGenerationService.createService()
      if (service) {
        const stats = await service.getUsageStats()
        setUsageStats(stats)
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para generar la imagen')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const result = await imageGenerationService.generateImage({
        prompt,
        style: selectedStyle as any,
        aspectRatio: selectedAspectRatio as any,
        size: selectedSize as any,
        personGeneration: personGeneration as any,
        count: 4
      })

      if (result.success && result.images) {
        setSuccess(`${result.images.length} imágenes generadas exitosamente`)
        setGeneratedImages(prev => {
          const newImages = [...result.images!, ...prev]
          setRenderKey(prev => prev + 1) // Forzar re-render
          return newImages
        })
        loadUsageStats() // Actualizar estadísticas
      } else {
        setError(result.error || 'Error al generar la imagen')
      }
    } catch (error) {
      console.error('Error generando imagen:', error)
      setError('Error al generar la imagen')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSocialMediaImage = async () => {
    if (!prompt.trim() || !selectedPlatform) {
      setError('Por favor ingresa un prompt y selecciona una plataforma')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const result = await imageGenerationService.generateSocialMediaImage(
        selectedPlatform as any,
        prompt,
        selectedStyle
      )

      if (result.success && result.images) {
        setSuccess(`Imagen para ${selectedPlatform} generada exitosamente`)
        setGeneratedImages(prev => [result.images![0], ...prev])
        loadUsageStats()
      } else {
        setError(result.error || 'Error al generar la imagen')
      }
    } catch (error) {
      console.error('Error generando imagen para redes sociales:', error)
      setError('Error al generar la imagen')
    } finally {
      setIsLoading(false)
    }
  }

  const generateAdImage = async () => {
    if (!productDescription.trim() || !targetAudience.trim()) {
      setError('Por favor completa la descripción del producto y audiencia objetivo')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const result = await imageGenerationService.generateAdImage(
        productDescription,
        targetAudience,
        adObjective as any,
        selectedStyle
      )

      if (result.success && result.images) {
        setSuccess('Imagen publicitaria generada exitosamente')
        setGeneratedImages(prev => [result.images![0], ...prev])
        loadUsageStats()
      } else {
        setError(result.error || 'Error al generar la imagen publicitaria')
      }
    } catch (error) {
      console.error('Error generando imagen publicitaria:', error)
      setError('Error al generar la imagen publicitaria')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'realistic': return 'bg-blue-500'
      case 'artistic': return 'bg-purple-500'
      case 'cartoon': return 'bg-pink-500'
      case 'minimalist': return 'bg-gray-500'
      case 'vintage': return 'bg-amber-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      case 'twitter': return '🐦'
      case 'linkedin': return '💼'
      default: return '📱'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generador de Imágenes IA</h1>
          <p className="text-muted-foreground">
            Crea imágenes profesionales con inteligencia artificial
          </p>
        </div>
        {usageStats && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Imágenes generadas</div>
            <div className="text-2xl font-bold">{usageStats.totalImages}</div>
            <div className="text-xs text-muted-foreground">
              ${usageStats.totalCost.toFixed(2)} total
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generar Imagen</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="ads">Publicidad</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Personaliza tu imagen generada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe la imagen que quieres generar..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estilo</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realista</SelectItem>
                        <SelectItem value="artistic">Artístico</SelectItem>
                        <SelectItem value="cartoon">Caricatura</SelectItem>
                        <SelectItem value="minimalist">Minimalista</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Relación de Aspecto</label>
                    <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 (Cuadrado)</SelectItem>
                        <SelectItem value="3:4">3:4 (Vertical)</SelectItem>
                        <SelectItem value="4:3">4:3 (Horizontal)</SelectItem>
                        <SelectItem value="9:16">9:16 (Stories)</SelectItem>
                        <SelectItem value="16:9">16:9 (Wide)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tamaño</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1K">1K (Estándar)</SelectItem>
                        <SelectItem value="2K">2K (Alta calidad)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Generación de Personas</label>
                    <Select value={personGeneration} onValueChange={setPersonGeneration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dont_allow">No permitir personas</SelectItem>
                        <SelectItem value="allow_adult">Solo adultos</SelectItem>
                        <SelectItem value="allow_all">Todas las edades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <Button
                  onClick={generateImage}
                  disabled={!prompt.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generar Imagen
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>
                  Tu imagen generada aparecerá aquí
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={generatedImages[0].url}
                        alt="Imagen generada"
                        className="w-full rounded-lg border"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(generatedImages[0].url, `imagen-${Date.now()}.png`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStyleColor(generatedImages[0].style)}>
                          {generatedImages[0].style}
                        </Badge>
                        <Badge variant="outline">{generatedImages[0].size}</Badge>
                        <Badge variant="outline">{generatedImages[0].quality}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {generatedImages[0].revised_prompt || generatedImages[0].prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Genera una imagen para ver la vista previa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes para Redes Sociales</CardTitle>
              <CardDescription>
                Genera imágenes optimizadas para cada plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Plataforma</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estilo</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realista</SelectItem>
                      <SelectItem value="artistic">Artístico</SelectItem>
                      <SelectItem value="cartoon">Caricatura</SelectItem>
                      <SelectItem value="minimalist">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Contenido del Post</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe el contenido de tu post..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={generateSocialMediaImage}
                disabled={!prompt.trim() || !selectedPlatform || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Generar para {selectedPlatform}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes Publicitarias</CardTitle>
              <CardDescription>
                Crea imágenes optimizadas para campañas publicitarias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Descripción del Producto</label>
                  <Input
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Ej: Producto innovador para empresas"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Audiencia Objetivo</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ej: Empresarios guatemaltecos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Objetivo de la Publicidad</label>
                  <Select value={adObjective} onValueChange={setAdObjective}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Conciencia de Marca</SelectItem>
                      <SelectItem value="conversion">Conversión</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estilo</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realista</SelectItem>
                      <SelectItem value="artistic">Artístico</SelectItem>
                      <SelectItem value="minimalist">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateAdImage}
                disabled={!productDescription.trim() || !targetAudience.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generar Imagen Publicitaria
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historial de Imágenes</CardTitle>
                  <CardDescription>
                    Todas las imágenes que has generado ({generatedImages.length} imágenes)
                  </CardDescription>
                  <div className="text-lg font-bold text-green-600 mt-2">
                    🖼️ TOTAL: {generatedImages.length} IMÁGENES DISPONIBLES
                  </div>
                </div>
                <Button onClick={loadImageHistory} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {generatedImages.length > 0 ? (
                <div>
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                    <strong>DEBUG:</strong> Se van a renderizar {generatedImages.length} imágenes
                    <br />
                    <strong>LINKS DIRECTOS A LAS IMÁGENES:</strong>
                    {generatedImages.map((img, index) => (
                      <div key={img.id} className="mt-2">
                        <a 
                          href={img.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          🖼️ Imagen {index + 1} - ID: {img.id}
                        </a>
                      </div>
                    ))}
                  </div>
                  <div key={renderKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: generatedImages.length }, (_, index) => {
                      const image = generatedImages[index]
                      if (!image) return null
                      
                      return (
                        <div key={`${image.id}-${index}-${renderKey}`} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-2">
                            🖼️ IMAGEN {index + 1} de {generatedImages.length} - ID: {image.id}
                          </div>
                          <div className="relative mb-3">
                            <img
                              src={image.url}
                              alt={`Imagen generada ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2"
                              onClick={() => downloadImage(image.url, `imagen-${image.id}.png`)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStyleColor(image.style)}>
                                {image.style}
                              </Badge>
                              <Badge variant="outline">{image.size}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {image.prompt}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(image.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay imágenes en el historial</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
