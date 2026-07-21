import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Twitter, Linkedin, Instagram, Youtube, MessageCircle, TrendingUp, BarChart3 } from 'lucide-react'
import { twitterAPIService } from '@/lib/twitter-api'
import { linkedinAPIService } from '@/lib/linkedin-api'
import { sentimentAnalysisService } from '@/lib/sentiment-analysis-service'
import { imageGenerationService } from '@/lib/image-generation-service'

interface SocialMediaPost {
  id: string
  platform: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledFor?: string
  publishedAt?: string
  metrics?: {
    likes: number
    shares: number
    comments: number
    views: number
  }
}

interface TrendingTopic {
  platform: string
  topic: string
  volume: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

export default function SocialMediaManager() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [postContent, setPostContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Cargar posts y trending topics al montar el componente
  useEffect(() => {
    loadPosts()
    loadTrendingTopics()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      // Aquí cargarías los posts desde la base de datos
      // Por ahora usamos datos de ejemplo
      setPosts([
        {
          id: '1',
          platform: 'twitter',
          content: '¡Nuevo producto lanzado! 🚀 #marketing #innovación',
          status: 'published',
          publishedAt: '2025-01-12T10:00:00Z',
          metrics: { likes: 45, shares: 12, comments: 8, views: 1200 }
        },
        {
          id: '2',
          platform: 'linkedin',
          content: 'Reflexiones sobre el futuro del marketing digital en Guatemala',
          status: 'published',
          publishedAt: '2025-01-11T15:30:00Z',
          metrics: { likes: 23, shares: 5, comments: 3, views: 890 }
        }
      ])
    } catch (error) {
      console.error('Error cargando posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingTopics = async () => {
    try {
      // Cargar trending topics desde la base de datos
      setTrendingTopics([
        { platform: 'twitter', topic: '#marketing', volume: 15000, sentiment: 'positive' },
        { platform: 'instagram', topic: '#guatemala', volume: 8500, sentiment: 'positive' },
        { platform: 'linkedin', topic: '#emprendimiento', volume: 3200, sentiment: 'positive' },
        { platform: 'tiktok', topic: '#viral', volume: 25000, sentiment: 'neutral' },
        { platform: 'youtube', topic: '#tutorial', volume: 12000, sentiment: 'positive' }
      ])
    } catch (error) {
      console.error('Error cargando trending topics:', error)
    }
  }

  const handlePostSubmit = async () => {
    if (!selectedPlatform || !postContent.trim()) {
      setError('Por favor selecciona una plataforma y escribe contenido')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      let result
      switch (selectedPlatform) {
        case 'twitter':
          const twitterService = await twitterAPIService.createService()
          if (twitterService) {
            result = await twitterService.createTweet(postContent)
          }
          break
        case 'linkedin':
          const linkedinService = await linkedinAPIService.createService()
          if (linkedinService) {
            result = await linkedinService.createPost(postContent)
          }
          break
        default:
          throw new Error('Plataforma no soportada aún')
      }

      if (result?.success) {
        setSuccess(`Post publicado exitosamente en ${selectedPlatform}`)
        setPostContent('')
        loadPosts()
      } else {
        setError(result?.error || 'Error al publicar el post')
      }
    } catch (error) {
      console.error('Error publicando post:', error)
      setError('Error al publicar el post')
    } finally {
      setIsLoading(false)
    }
  }

  const generateContentWithAI = async () => {
    if (!selectedPlatform) {
      setError('Por favor selecciona una plataforma primero')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Generar contenido con IA basado en trending topics
      const relevantTopics = trendingTopics
        .filter(topic => topic.platform === selectedPlatform)
        .slice(0, 3)
        .map(topic => topic.topic)
        .join(', ')

      const prompt = `Crea un post para ${selectedPlatform} que incluya los siguientes temas trending: ${relevantTopics}. El post debe ser profesional, atractivo y relevante para el mercado guatemalteco.`

      // Aquí integrarías con el servicio de generación de contenido
      // Por ahora usamos un ejemplo
      const generatedContent = `🚀 ¡Descubriendo las últimas tendencias en ${selectedPlatform}! ${relevantTopics} están transformando el panorama digital en Guatemala. ¿Cuál es tu experiencia con estas innovaciones? #marketing #guatemala #innovación`

      setPostContent(generatedContent)
      setSuccess('Contenido generado con IA exitosamente')
    } catch (error) {
      console.error('Error generando contenido:', error)
      setError('Error al generar contenido con IA')
    } finally {
      setIsLoading(false)
    }
  }

  const generateImageForPost = async () => {
    if (!postContent.trim()) {
      setError('Por favor escribe el contenido del post primero')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const result = await imageGenerationService.generateSocialMediaImage(
        selectedPlatform as any,
        postContent,
        'realistic'
      )

      if (result.success && result.images) {
        setSuccess(`Imagen generada exitosamente: ${result.images[0].url}`)
        // Aquí podrías mostrar la imagen generada o agregarla al post
      } else {
        setError(result.error || 'Error al generar imagen')
      }
    } catch (error) {
      console.error('Error generando imagen:', error)
      setError('Error al generar imagen')
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      case 'instagram': return <Instagram className="h-4 w-4" />
      case 'youtube': return <Youtube className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500'
      case 'linkedin': return 'bg-blue-700'
      case 'instagram': return 'bg-pink-500'
      case 'youtube': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Redes Sociales</h1>
          <p className="text-muted-foreground">
            Gestiona tus publicaciones y analiza tendencias en múltiples plataformas
          </p>
        </div>
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

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Crear Post</TabsTrigger>
          <TabsTrigger value="posts">Mis Posts</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Post</CardTitle>
              <CardDescription>
                Publica contenido en múltiples redes sociales
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
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-2">
                  <Button
                    onClick={generateContentWithAI}
                    disabled={!selectedPlatform || isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generar con IA
                  </Button>
                  <Button
                    onClick={generateImageForPost}
                    disabled={!postContent.trim() || isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generar Imagen
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Contenido</label>
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Escribe tu post aquí..."
                  className="min-h-[120px]"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {postContent.length}/280 caracteres
                </div>
              </div>

              <Button
                onClick={handlePostSubmit}
                disabled={!selectedPlatform || !postContent.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Posts</CardTitle>
              <CardDescription>
                Historial de publicaciones en redes sociales
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getPlatformColor(post.platform)} text-white`}>
                            {getPlatformIcon(post.platform)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize">{post.platform}</span>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.publishedAt || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{post.content}</p>
                      {post.metrics && (
                        <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                          <span>👍 {post.metrics.likes}</span>
                          <span>🔄 {post.metrics.shares}</span>
                          <span>💬 {post.metrics.comments}</span>
                          <span>👁️ {post.metrics.views}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias</CardTitle>
              <CardDescription>
                Temas trending en diferentes plataformas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getPlatformColor(topic.platform)} text-white`}>
                          {getPlatformIcon(topic.platform)}
                        </div>
                        <span className="text-sm font-medium capitalize">{topic.platform}</span>
                      </div>
                      <Badge variant={topic.sentiment === 'positive' ? 'default' : 'secondary'}>
                        {topic.sentiment}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{topic.topic}</h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.volume.toLocaleString()} menciones
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
