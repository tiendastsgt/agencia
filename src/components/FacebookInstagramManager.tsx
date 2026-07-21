import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FacebookGraphService, FacebookPage, FacebookPost, FacebookPostRequest, createFacebookService } from '@/lib/facebook-api'
import { useActiveClient } from '@/lib/client-context'
import { credentialsService } from '@/lib/credentials-service'
import { formatNumber } from '../utils/formatters'
import { logDebug, logWarn, logError } from '../utils/logger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Facebook, 
  Instagram, 
  Send, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image,
  Video,
  Grid3X3
} from 'lucide-react'

interface FacebookInstagramManagerProps {
  className?: string
}

export default function FacebookInstagramManager({ className }: FacebookInstagramManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [postText, setPostText] = useState('')
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [facebookService, setFacebookService] = useState<FacebookGraphService | null>(null)
  const [instagramService, setInstagramService] = useState<InstagramBasicDisplayService | null>(null)
  const [hasFacebookCredentials, setHasFacebookCredentials] = useState(false)

  // Verificar credenciales y inicializar servicios
  useEffect(() => {
    const initServices = async () => {
      try {
        // Verificar si hay credenciales de Facebook configuradas
        const hasCredentials = await credentialsService.hasActiveCredentials('facebook', activeClient?.id)
        setHasFacebookCredentials(hasCredentials)
        
        if (hasCredentials) {
          // Crear servicio de Facebook usando credenciales de la base de datos
          const fbService = await createFacebookService(activeClient?.id)
          if (fbService) {
            setFacebookService(fbService)
          } else {
            console.warn('⚠️ No se pudo inicializar el servicio de Facebook')
          }
        } else {
          console.warn('⚠️ No hay credenciales de Facebook configuradas')
        }
        
        // Instagram - por ahora deshabilitado hasta tener credenciales
        // const igService = new InstagramBasicDisplayService(instagramToken)
        // setInstagramService(igService)
      } catch (error) {
        console.error('Error inicializando servicios:', error)
        toast.error('Error al inicializar servicios de redes sociales')
      }
    }

    if (activeClient) {
      initServices()
    }
  }, [activeClient])

  // Query para obtener páginas de Facebook
  const { data: facebookPages, isLoading: pagesLoading } = useQuery({
    queryKey: ['facebook-pages'],
    queryFn: async () => {
      if (!facebookService) throw new Error('Servicio no disponible')
      return await facebookService.getPages()
    },
    enabled: !!facebookService,
    retry: false
  })

  // Query para obtener información de Instagram
  const { data: instagramUser, isLoading: instagramLoading } = useQuery({
    queryKey: ['instagram-user'],
    queryFn: async () => {
      if (!instagramService) throw new Error('Servicio no disponible')
      return await instagramService.getUserInfo()
    },
    enabled: !!instagramService,
    retry: false
  })

  // Query para obtener posts de Facebook
  const { data: facebookPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['facebook-posts', selectedPage],
    queryFn: async () => {
      if (!facebookService || !selectedPage) throw new Error('Servicio o página no disponible')
      return await facebookService.getPagePosts(selectedPage, 10)
    },
    enabled: !!facebookService && !!selectedPage,
    retry: false
  })

  // Query para obtener medios de Instagram
  const { data: instagramMedia, isLoading: mediaLoading } = useQuery({
    queryKey: ['instagram-media'],
    queryFn: async () => {
      if (!instagramService) throw new Error('Servicio no disponible')
      return await instagramService.getUserMedia(10)
    },
    enabled: !!instagramService,
    retry: false
  })

  // Mutation para publicar en Facebook
  const postToFacebookMutation = useMutation({
    mutationFn: async (post: FacebookPostRequest) => {
      if (!facebookService || !selectedPage) throw new Error('Servicio o página no disponible')
      return await facebookService.postToPage(selectedPage, post)
    },
    onSuccess: () => {
      toast.success('Post publicado en Facebook exitosamente')
      setPostText('')
      queryClient.invalidateQueries({ queryKey: ['facebook-posts'] })
    },
    onError: (error: any) => {
      toast.error(`Error al publicar en Facebook: ${error.message}`)
    }
  })

  const handlePostToFacebook = () => {
    if (!postText.trim()) {
      toast.error('El post no puede estar vacío')
      return
    }

    if (!selectedPage) {
      toast.error('Selecciona una página de Facebook')
      return
    }

    postToFacebookMutation.mutate({ message: postText })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'IMAGE':
        return <Image className="h-4 w-4" />
      case 'VIDEO':
        return <Video className="h-4 w-4" />
      case 'CAROUSEL_ALBUM':
        return <Grid3X3 className="h-4 w-4" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar Facebook e Instagram
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
          <div className="flex items-center gap-2">
            <Facebook className="h-8 w-8 text-blue-600" />
            <Instagram className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Gestión de Facebook e Instagram</h2>
            <p className="text-muted-foreground">
              Gestiona tu presencia en Facebook e Instagram para {activeClient.name}
            </p>
          </div>
        </div>
        
        {/* Indicadores de estado */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${hasFacebookCredentials ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">Facebook</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm text-muted-foreground">Instagram</span>
          </div>
        </div>
      </div>

      {!hasFacebookCredentials ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Las credenciales de Facebook no están configuradas.</p>
              <p className="text-sm text-muted-foreground">
                Ve a <a href="/credentials" className="text-primary hover:underline">Configuración de Credenciales</a> para agregar tu token de Facebook.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      ) : !facebookService ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Error al inicializar el servicio de Facebook.</p>
              <p className="text-sm text-muted-foreground">
                Verifica que las credenciales sean válidas en la página de configuración.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Componer</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          {/* Tab: Componer Post */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Componer Post
                </CardTitle>
                <CardDescription>
                  Crea y publica contenido en Facebook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selector de página */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Página de Facebook</label>
                  {pagesLoading ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Cargando páginas...</span>
                    </div>
                  ) : facebookPages && facebookPages.length > 0 ? (
                    <select
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Selecciona una página</option>
                      {facebookPages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground">
                      No se encontraron páginas de Facebook. Verifica que tu token tenga los permisos necesarios.
                    </div>
                  )}
                </div>
                
                {/* Editor de texto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contenido del post</label>
                  <Textarea
                    placeholder="¿Qué está pasando?"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{postText.length} caracteres</span>
                    <span>Máximo 63,206 caracteres</span>
                  </div>
                </div>
                
                {/* Botón de publicación */}
                <div className="flex items-center justify-end">
                  <Button
                    onClick={handlePostToFacebook}
                    disabled={postToFacebookMutation.isPending || !postText.trim() || !selectedPage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {postToFacebookMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publicar en Facebook
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Facebook */}
          <TabsContent value="facebook" className="space-y-4">
            {pagesLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : facebookPages && facebookPages.length > 0 ? (
              <>
                {/* Páginas de Facebook */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {facebookPages.map((page) => (
                    <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {page.picture?.data?.url && (
                            <img
                              src={page.picture.data.url}
                              alt={page.name}
                              className="w-12 h-12 rounded-full"
                            />
                          )}
                          <div>
                            <CardTitle className="text-lg">{page.name}</CardTitle>
                            <CardDescription>{page.category}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{formatNumber(page.fan_count || 0)} seguidores</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedPage(page.id)}
                            className="w-full"
                          >
                            Ver Posts
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Posts de la página seleccionada */}
                {selectedPage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Posts Recientes</h3>
                    {postsLoading ? (
                      <Card>
                        <CardContent className="flex items-center justify-center h-32">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </CardContent>
                      </Card>
                    ) : facebookPosts && facebookPosts.length > 0 ? (
                      facebookPosts.map((post) => (
                        <Card key={post.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <p className="text-sm">{post.message || post.story}</p>
                              {post.full_picture && (
                                <img
                                  src={post.full_picture}
                                  alt="Post"
                                  className="w-full max-w-md rounded-lg"
                                />
                              )}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>0</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>0</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Share2 className="h-4 w-4" />
                                    <span>0</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(post.created_time)}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="flex items-center justify-center h-32">
                          <div className="text-center">
                            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No hay posts para mostrar</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se pudieron obtener las páginas de Facebook
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Instagram */}
          <TabsContent value="instagram" className="space-y-4">
            {instagramLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : instagramUser ? (
              <>
                {/* Información del usuario de Instagram */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      {instagramUser.profile_picture_url && (
                        <img
                          src={instagramUser.profile_picture_url}
                          alt={instagramUser.username}
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{instagramUser.name || instagramUser.username}</h3>
                          <Badge variant="outline">{instagramUser.account_type}</Badge>
                        </div>
                        <p className="text-muted-foreground">@{instagramUser.username}</p>
                        {instagramUser.biography && (
                          <p className="text-sm mt-1">{instagramUser.biography}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{formatNumber(instagramUser.followers_count || 0)} seguidores</span>
                          <span>{formatNumber(instagramUser.follows_count || 0)} siguiendo</span>
                          <span>{formatNumber(instagramUser.media_count || 0)} publicaciones</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medios de Instagram */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Publicaciones Recientes</h3>
                  {mediaLoading ? (
                    <Card>
                      <CardContent className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </CardContent>
                    </Card>
                  ) : instagramMedia && instagramMedia.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {instagramMedia.map((media) => (
                        <Card key={media.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="relative">
                                <img
                                  src={media.media_url}
                                  alt="Instagram post"
                                  className="w-full rounded-lg"
                                />
                                <div className="absolute top-2 right-2">
                                  {getMediaTypeIcon(media.media_type)}
                                </div>
                              </div>
                              {media.caption && (
                                <p className="text-sm line-clamp-2">{media.caption}</p>
                              )}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{formatNumber(media.like_count || 0)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{formatNumber(media.comments_count || 0)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(media.timestamp)}</span>
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
                          <Instagram className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No hay publicaciones para mostrar</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se pudo obtener la información de Instagram
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Analíticas */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Analíticas de Facebook */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Analíticas de Facebook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {facebookPages && facebookPages.length > 0 ? (
                    <div className="space-y-4">
                      {facebookPages.map((page) => (
                        <div key={page.id} className="p-4 border rounded-lg">
                          <h4 className="font-semibold">{page.name}</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{formatNumber(page.fan_count || 0)}</div>
                              <div className="text-sm text-muted-foreground">Seguidores</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">{formatNumber(page.followers_count || 0)}</div>
                              <div className="text-sm text-muted-foreground">Fans</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No hay datos de Facebook disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analíticas de Instagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    Analíticas de Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {instagramUser ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{formatNumber(instagramUser.followers_count || 0)}</div>
                        <div className="text-sm text-muted-foreground">Seguidores</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        <div className="text-2xl font-bold">{formatNumber(instagramUser.follows_count || 0)}</div>
                        <div className="text-sm text-muted-foreground">Siguiendo</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Image className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                        <div className="text-2xl font-bold">{formatNumber(instagramUser.media_count || 0)}</div>
                        <div className="text-sm text-muted-foreground">Publicaciones</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No hay datos de Instagram disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
