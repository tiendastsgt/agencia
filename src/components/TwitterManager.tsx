import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TwitterAPIService, TwitterUser, TwitterTweet, TwitterPostRequest } from '@/lib/twitter-api'
import { useActiveClient } from '@/lib/client-context'
import { formatNumber } from '../utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Twitter, 
  Send, 
  Search, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Heart,
  Repeat2,
  Quote,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface TwitterManagerProps {
  className?: string
}

export default function TwitterManager({ className }: TwitterManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [tweetText, setTweetText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [twitterService, setTwitterService] = useState<TwitterAPIService | null>(null)

  // Inicializar servicio de Twitter
  useEffect(() => {
    const initTwitterService = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const accessToken = 'your_access_token'
        const bearerToken = 'your_bearer_token'
        
        if (accessToken && bearerToken) {
          const service = new TwitterAPIService(accessToken, bearerToken)
          setTwitterService(service)
        }
      } catch (error) {
        console.error('Error inicializando Twitter service:', error)
      }
    }

    initTwitterService()
  }, [activeClient])

  // Query para obtener información del usuario
  const { data: userInfo, isLoading: userLoading } = useQuery({
    queryKey: ['twitter-user-info'],
    queryFn: async () => {
      if (!twitterService) throw new Error('Servicio no disponible')
      return await twitterService.getMe()
    },
    enabled: !!twitterService,
    retry: false
  })

  // Query para obtener tweets del usuario
  const { data: userTweets, isLoading: tweetsLoading } = useQuery({
    queryKey: ['twitter-user-tweets'],
    queryFn: async () => {
      if (!twitterService || !userInfo) throw new Error('Servicio o usuario no disponible')
      return await twitterService.getUserTweets(userInfo.id, 10)
    },
    enabled: !!twitterService && !!userInfo,
    retry: false
  })

  // Query para buscar tweets
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['twitter-search', searchQuery],
    queryFn: async () => {
      if (!twitterService || !searchQuery) throw new Error('Servicio o query no disponible')
      return await twitterService.searchTweets(searchQuery, 10)
    },
    enabled: !!twitterService && !!searchQuery,
    retry: false
  })

  // Mutation para publicar tweet
  const postTweetMutation = useMutation({
    mutationFn: async (tweet: TwitterPostRequest) => {
      if (!twitterService) throw new Error('Servicio no disponible')
      return await twitterService.postTweet(tweet)
    },
    onSuccess: () => {
      toast.success('Tweet publicado exitosamente')
      setTweetText('')
      queryClient.invalidateQueries({ queryKey: ['twitter-user-tweets'] })
    },
    onError: (error: any) => {
      toast.error(`Error al publicar tweet: ${error.message}`)
    }
  })

  const handlePostTweet = () => {
    if (!tweetText.trim()) {
      toast.error('El tweet no puede estar vacío')
      return
    }

    if (tweetText.length > 280) {
      toast.error('El tweet no puede exceder 280 caracteres')
      return
    }

    postTweetMutation.mutate({ text: tweetText })
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Ingresa un término de búsqueda')
      return
    }
    // La búsqueda se ejecuta automáticamente por el useQuery
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


  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar Twitter
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <Twitter className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold">Gestión de Twitter/X</h2>
          <p className="text-muted-foreground">
            Gestiona tu presencia en Twitter para {activeClient.name}
          </p>
        </div>
      </div>

      {!twitterService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de Twitter no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Componer</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="search">Buscar</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          {/* Tab: Componer Tweet */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Componer Tweet
                </CardTitle>
                <CardDescription>
                  Crea y publica un nuevo tweet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="¿Qué está pasando?"
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={280}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {tweetText.length}/280 caracteres
                  </div>
                  <Button
                    onClick={handlePostTweet}
                    disabled={postTweetMutation.isPending || !tweetText.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {postTweetMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publicar Tweet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            {userLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : userInfo ? (
              <>
                {/* Información del usuario */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      {userInfo.profile_image_url && (
                        <img
                          src={userInfo.profile_image_url}
                          alt={userInfo.name}
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{userInfo.name}</h3>
                          {userInfo.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-muted-foreground">@{userInfo.username}</p>
                        {userInfo.description && (
                          <p className="text-sm mt-1">{userInfo.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{formatNumber(userInfo.public_metrics?.followers_count || 0)} seguidores</span>
                          <span>{formatNumber(userInfo.public_metrics?.following_count || 0)} siguiendo</span>
                          <span>{formatNumber(userInfo.public_metrics?.tweet_count || 0)} tweets</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tweets del usuario */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tus Tweets Recientes</h3>
                  {tweetsLoading ? (
                    <Card>
                      <CardContent className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </CardContent>
                    </Card>
                  ) : userTweets && userTweets.length > 0 ? (
                    userTweets.map((tweet) => (
                      <Card key={tweet.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <p className="text-sm">{tweet.text}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.like_count || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Repeat2 className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.retweet_count || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.reply_count || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Quote className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.quote_count || 0)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(tweet.created_at)}</span>
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
                          <p className="text-muted-foreground">No hay tweets para mostrar</p>
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
                  No se pudo obtener la información del usuario de Twitter
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Buscar */}
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Tweets
                </CardTitle>
                <CardDescription>
                  Busca tweets por palabras clave, hashtags o menciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar tweets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searchLoading}>
                    {searchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Resultados de búsqueda</h3>
                    {searchResults.map((tweet) => (
                      <Card key={tweet.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <p className="text-sm">{tweet.text}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.like_count || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Repeat2 className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.retweet_count || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{formatNumber(tweet.public_metrics?.reply_count || 0)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(tweet.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Analíticas */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analíticas de Twitter
                </CardTitle>
                <CardDescription>
                  Métricas y estadísticas de tu cuenta de Twitter
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userInfo ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(userInfo.public_metrics?.followers_count || 0)}</div>
                      <div className="text-sm text-muted-foreground">Seguidores</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(userInfo.public_metrics?.following_count || 0)}</div>
                      <div className="text-sm text-muted-foreground">Siguiendo</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <MessageSquare className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(userInfo.public_metrics?.tweet_count || 0)}</div>
                      <div className="text-sm text-muted-foreground">Tweets</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <BarChart3 className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                      <div className="text-2xl font-bold">{formatNumber(userInfo.public_metrics?.listed_count || 0)}</div>
                      <div className="text-sm text-muted-foreground">Listas</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No se pudo cargar la información de analíticas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}