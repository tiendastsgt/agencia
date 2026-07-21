import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { facebookAPIService, FacebookPage } from '@/lib/facebook-api'
import { instagramAPIService } from '@/lib/instagram-api'
import { contentService } from '@/lib/content-service'
import { useActiveClient } from '@/lib/client-context'
import { Send, Facebook, Instagram, Calendar, Image, Link, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface ContentPublisherProps {
  contentId?: string
  content?: {
    title: string
    content_body: string
    platform: string
    hook?: string
    story?: string
    offer?: string
  }
  onPublish?: (result: any) => void
}

export default function ContentPublisher({ contentId, content, onPublish }: ContentPublisherProps) {
  const { activeClient } = useActiveClient()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([])
  const [selectedFacebookPage, setSelectedFacebookPage] = useState<string>('')
  const [publishMessage, setPublishMessage] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'twitter', name: 'Twitter', disabled: true },
    { id: 'linkedin', name: 'LinkedIn', disabled: true },
    { id: 'youtube', name: 'YouTube', disabled: true }
  ]

  useEffect(() => {
    if (content) {
      setPublishMessage(content.content_body)
    }
    loadFacebookPages()
  }, [content])

  const loadFacebookPages = async () => {
    try {
      const result = await facebookAPIService.getPages()
      if (result.success && result.pages) {
        setFacebookPages(result.pages)
      }
    } catch (error) {
      console.error('Error loading Facebook pages:', error)
    }
  }

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handlePublish = async () => {
    if (!activeClient) {
      toast.error('No hay cliente activo')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Selecciona al menos una plataforma')
      return
    }

    if (!publishMessage.trim()) {
      toast.error('El mensaje no puede estar vacío')
      return
    }

    setIsPublishing(true)
    const results: any[] = []

    try {
      // Publicar en Facebook
      if (selectedPlatforms.includes('facebook')) {
        if (!selectedFacebookPage) {
          toast.error('Selecciona una página de Facebook')
          setIsPublishing(false)
          return
        }

        const facebookResult = await facebookAPIService.publishPost(
          selectedFacebookPage,
          publishMessage
        )

        results.push({
          platform: 'facebook',
          success: facebookResult.success,
          data: facebookResult.postId,
          error: facebookResult.error
        })

        if (facebookResult.success) {
          toast.success('Publicado en Facebook exitosamente')
        } else {
          toast.error('Error al publicar en Facebook: ' + facebookResult.error)
        }
      }

      // Publicar en Instagram
      if (selectedPlatforms.includes('instagram')) {
        // Para Instagram necesitamos una imagen, por ahora solo mostramos un mensaje
        toast.info('Instagram requiere una imagen. Funcionalidad en desarrollo.')
        results.push({
          platform: 'instagram',
          success: false,
          error: 'Instagram requiere una imagen. Funcionalidad en desarrollo.'
        })
      }

      // Guardar el resultado en la base de datos
      if (contentId) {
        await contentService.updateContent(contentId, {
          status: 'published',
          published_at: new Date().toISOString(),
          publish_results: results
        })
      }

      setPublishResults(results)
      onPublish?.(results)

    } catch (error) {
      console.error('Error publishing content:', error)
      toast.error('Error al publicar contenido: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsPublishing(false)
    }
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform ? platform.icon : FileText
  }

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform ? platform.color : 'text-gray-600'
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Publicar Contenido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publicar Contenido</DialogTitle>
          <DialogDescription>
            Selecciona las plataformas donde quieres publicar tu contenido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de plataformas */}
          <div>
            <Label className="text-base font-medium">Plataformas</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {platforms.map((platform) => {
                const Icon = platform.icon || Facebook
                const isSelected = selectedPlatforms.includes(platform.id)
                const isDisabled = platform.disabled

                return (
                  <div
                    key={platform.id}
                    className={`relative p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => !isDisabled && handlePlatformToggle(platform.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isDisabled ? 'text-gray-400' : platform.color}`} />
                      <span className={`font-medium ${isDisabled ? 'text-gray-400' : ''}`}>
                        {platform.name}
                      </span>
                      {isDisabled && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Próximamente
                        </Badge>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Configuración de Facebook */}
          {selectedPlatforms.includes('facebook') && (
            <div>
              <Label htmlFor="facebook-page">Página de Facebook</Label>
              <Select value={selectedFacebookPage} onValueChange={setSelectedFacebookPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una página" />
                </SelectTrigger>
                <SelectContent>
                  {facebookPages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mensaje a publicar */}
          <div>
            <Label htmlFor="publish-message">Mensaje</Label>
            <Textarea
              id="publish-message"
              value={publishMessage}
              onChange={(e) => setPublishMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
            />
          </div>

          {/* Programación (futuro) */}
          <div>
            <Label htmlFor="scheduled-date">Programar publicación (Próximamente)</Label>
            <Input
              id="scheduled-date"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              La programación de publicaciones estará disponible próximamente
            </p>
          </div>

          {/* Resultados de publicación */}
          {publishResults.length > 0 && (
            <div>
              <Label className="text-base font-medium">Resultados</Label>
              <div className="space-y-2 mt-2">
                {publishResults.map((result, index) => {
                  const Icon = getPlatformIcon(result.platform)
                  const color = getPlatformColor(result.platform)
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div className="flex-1">
                        <div className="font-medium capitalize">{result.platform}</div>
                        {result.success ? (
                          <div className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Publicado exitosamente
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing || selectedPlatforms.length === 0}
            >
              {isPublishing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publicar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
