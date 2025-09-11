import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { contentGenerationAPIs } from '@/lib/content-generation-apis'
import { toast } from '@/components/ui/sonner'
import { Play, Image, Video, Loader2, Download, ExternalLink } from 'lucide-react'

interface GenerationResult {
  success: boolean
  image_url?: string
  video_url?: string
  thumbnail_url?: string
  api_used: string
  cost?: number
  processing_time?: number
  duration?: number
  resolution?: string
  error?: string
}

export default function MediaGenerationDemo() {
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<'image' | 'video'>('image')
  const [duration, setDuration] = useState<number>(5)
  const [quality, setQuality] = useState<'standard' | 'high' | 'premium'>('high')
  const [platform, setPlatform] = useState<string>('Instagram')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Ingresa un prompt para generar contenido')
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await contentGenerationAPIs.generateContent({
        prompt,
        type: contentType,
        duration: contentType === 'video' ? duration : undefined,
        quality,
        platform,
        dimensions: contentType === 'video' ? '1080x1920' : '1080x1080'
      })

      setResult(response)
      
      if (response.success) {
        toast.success(`${contentType === 'video' ? 'Video' : 'Imagen'} generado exitosamente`)
      } else {
        toast.error(`Error: ${response.error}`)
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Error generando contenido')
    } finally {
      setIsGenerating(false)
    }
  }

  const getAPIDescription = (api: string) => {
    const descriptions: Record<string, string> = {
      'dalle-3': 'OpenAI DALL-E 3 - Imágenes de alta calidad',
      'stable-diffusion': 'Stable Diffusion - Rápido y económico',
      'google-imagen': 'Google Imagen - Balance calidad-velocidad',
      'runway-gen4': 'RunwayML Gen-4 - Videos cinematográficos',
      'pika-labs': 'Pika Labs - Videos dinámicos',
      'luma-dream-machine': 'Luma AI - Videos realistas'
    }
    return descriptions[api] || api
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Demo de Generación de Medios
          </CardTitle>
          <CardDescription>
            Prueba la generación de imágenes y videos con diferentes APIs de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt de Generación</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el contenido que quieres generar..."
              className="w-full"
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label>Tipo de Contenido</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={contentType === 'image' ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setContentType('image')}
              >
                <Image className="h-5 w-5" />
                <span className="text-sm">Imagen</span>
              </Button>
              <Button
                variant={contentType === 'video' ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setContentType('video')}
              >
                <Video className="h-5 w-5" />
                <span className="text-sm">Video</span>
              </Button>
            </div>
          </div>

          {/* Video Duration */}
          {contentType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (segundos)</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
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

          {/* Quality */}
          <div className="space-y-2">
            <Label htmlFor="quality">Calidad</Label>
            <Select
              value={quality}
              onValueChange={(value: 'standard' | 'high' | 'premium') => setQuality(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Estándar</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label htmlFor="platform">Plataforma</Label>
            <Select
              value={platform}
              onValueChange={setPlatform}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando {contentType === 'video' ? 'Video' : 'Imagen'}...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generar {contentType === 'video' ? 'Video' : 'Imagen'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Resultado de Generación
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Error en Generación
                </>
              )}
            </CardTitle>
            <CardDescription>
              {result.success ? (
                <>
                  API: {getAPIDescription(result.api_used)} | 
                  Costo: ${result.cost?.toFixed(4)} | 
                  Tiempo: {result.processing_time}ms
                </>
              ) : (
                result.error
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                {/* Media Preview */}
                <div className="space-y-3">
                  {result.video_url ? (
                    <div className="space-y-2">
                      <video 
                        controls 
                        className="w-full max-w-md rounded-lg"
                        poster={result.thumbnail_url}
                      >
                        <source src={result.video_url} type="video/mp4" />
                        Tu navegador no soporta el elemento video.
                      </video>
                      {result.duration && result.resolution && (
                        <div className="text-sm text-muted-foreground">
                          Duración: {result.duration}s | Resolución: {result.resolution}
                        </div>
                      )}
                    </div>
                  ) : result.image_url ? (
                    <div className="space-y-2">
                      <img 
                        src={result.image_url} 
                        alt="Generated content"
                        className="w-full max-w-md rounded-lg"
                      />
                      {result.resolution && (
                        <div className="text-sm text-muted-foreground">
                          Resolución: {result.resolution}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en Nueva Pestaña
                  </Button>
                </div>

                {/* API Info */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">API Utilizada:</span>
                      <Badge variant="outline" className="ml-2">
                        {result.api_used}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Costo:</span>
                      <span className="ml-2 text-muted-foreground">
                        ${result.cost?.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tiempo de Procesamiento:</span>
                      <span className="ml-2 text-muted-foreground">
                        {result.processing_time}ms
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Plataforma:</span>
                      <span className="ml-2 text-muted-foreground">
                        {platform}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Error en la generación</p>
                <p className="text-red-600 text-sm mt-1">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

