import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LinkedInMarketingService, LinkedInAccount, LinkedInCampaign, LinkedInPost, LinkedInPostRequest } from '@/lib/linkedin-api'
import { useActiveClient } from '@/lib/client-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Linkedin, 
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
  Target,
  DollarSign,
  MousePointer,
  Play
} from 'lucide-react'

interface LinkedInManagerProps {
  className?: string
}

export default function LinkedInManager({ className }: LinkedInManagerProps) {
  const { activeClient } = useActiveClient()
  const queryClient = useQueryClient()
  const [postText, setPostText] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [linkedinService, setLinkedinService] = useState<LinkedInMarketingService | null>(null)

  // Inicializar servicio de LinkedIn
  useEffect(() => {
    const initLinkedInService = async () => {
      try {
        // En un entorno real, obtendrías las credenciales desde Supabase
        const accessToken = 'your_linkedin_token'
        
        if (accessToken) {
          const service = new LinkedInMarketingService(accessToken)
          setLinkedinService(service)
        }
      } catch (error) {
        console.error('Error inicializando LinkedIn service:', error)
      }
    }

    initLinkedInService()
  }, [activeClient])

  // Query para obtener información del usuario
  const { data: userInfo, isLoading: userLoading } = useQuery({
    queryKey: ['linkedin-user-info'],
    queryFn: async () => {
      if (!linkedinService) throw new Error('Servicio no disponible')
      return await linkedinService.getMe()
    },
    enabled: !!linkedinService,
    retry: false
  })

  // Query para obtener cuentas de anuncios
  const { data: adAccounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['linkedin-ad-accounts'],
    queryFn: async () => {
      if (!linkedinService) throw new Error('Servicio no disponible')
      return await linkedinService.getAdAccounts()
    },
    enabled: !!linkedinService,
    retry: false
  })

  // Query para obtener campañas
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['linkedin-campaigns', selectedAccount],
    queryFn: async () => {
      if (!linkedinService || !selectedAccount) throw new Error('Servicio o cuenta no disponible')
      return await linkedinService.getCampaigns(selectedAccount, 10)
    },
    enabled: !!linkedinService && !!selectedAccount,
    retry: false
  })

  // Query para obtener posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['linkedin-posts'],
    queryFn: async () => {
      if (!linkedinService) throw new Error('Servicio no disponible')
      return await linkedinService.getPosts(10)
    },
    enabled: !!linkedinService,
    retry: false
  })

  // Query para obtener estadísticas de seguidores
  const { data: followerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['linkedin-follower-stats'],
    queryFn: async () => {
      if (!linkedinService) throw new Error('Servicio no disponible')
      return await linkedinService.getMemberFollowerStats()
    },
    enabled: !!linkedinService,
    retry: false
  })

  // Mutation para publicar post
  const postToLinkedInMutation = useMutation({
    mutationFn: async (post: LinkedInPostRequest) => {
      if (!linkedinService) throw new Error('Servicio no disponible')
      return await linkedinService.createPost(post)
    },
    onSuccess: () => {
      toast.success('Post publicado en LinkedIn exitosamente')
      setPostText('')
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] })
    },
    onError: (error: any) => {
      toast.error(`Error al publicar en LinkedIn: ${error.message}`)
    }
  })

  const handlePostToLinkedIn = () => {
    if (!postText.trim()) {
      toast.error('El post no puede estar vacío')
      return
    }

    if (!userInfo) {
      toast.error('No se pudo obtener la información del usuario')
      return
    }

    const post: LinkedInPostRequest = {
      author: `urn:li:person:${userInfo.id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postText
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }

    postToLinkedInMutation.mutate(post)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      case 'DRAFT':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'BRAND_AWARENESS':
        return <Eye className="h-4 w-4" />
      case 'WEBSITE_TRAFFIC':
        return <MousePointer className="h-4 w-4" />
      case 'LEAD_GENERATION':
        return <Users className="h-4 w-4" />
      case 'VIDEO_VIEWS':
        return <Play className="h-4 w-4" />
      case 'ENGAGEMENT':
        return <Heart className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  if (!activeClient) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Selecciona un cliente para gestionar LinkedIn
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <Linkedin className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Gestión de LinkedIn</h2>
          <p className="text-muted-foreground">
            Gestiona tu presencia profesional en LinkedIn para {activeClient.name}
          </p>
        </div>
      </div>

      {!linkedinService ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Las credenciales de LinkedIn no están configuradas. Ve a la página de credenciales para configurarlas.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Componer</TabsTrigger>
            <TabsTrigger value="campaigns">Campañas</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
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
                  Crea y publica contenido profesional en LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="¿Qué está pasando en tu mundo profesional?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {postText.length} caracteres
                  </div>
                  <Button
                    onClick={handlePostToLinkedIn}
                    disabled={postToLinkedInMutation.isPending || !postText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {postToLinkedInMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publicar en LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Campañas */}
          <TabsContent value="campaigns" className="space-y-4">
            {accountsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : adAccounts && adAccounts.length > 0 ? (
              <>
                {/* Cuentas de anuncios */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cuentas de Anuncios</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {adAccounts.map((account) => (
                      <Card key={account.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{account.name}</CardTitle>
                            <Badge variant="outline">{account.type}</Badge>
                          </div>
                          <CardDescription>{account.currency} • {account.timezone}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>{account.currency}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setSelectedAccount(account.id)}
                              className="w-full"
                            >
                              Ver Campañas
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Campañas de la cuenta seleccionada */}
                {selectedAccount && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Campañas</h3>
                    {campaignsLoading ? (
                      <Card>
                        <CardContent className="flex items-center justify-center h-32">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </CardContent>
                      </Card>
                    ) : campaigns && campaigns.length > 0 ? (
                      <div className="grid gap-4">
                        {campaigns.map((campaign) => (
                          <Card key={campaign.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{campaign.name}</h4>
                                  <Badge className={getCampaignStatusColor(campaign.status)}>
                                    {campaign.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    {getCampaignObjectiveIcon(campaign.objective)}
                                    <span>{campaign.objective}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{campaign.costType}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(new Date(campaign.created).getTime())}</span>
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
                            <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No hay campañas para mostrar</p>
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
                  No se pudieron obtener las cuentas de anuncios de LinkedIn
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Posts */}
          <TabsContent value="posts" className="space-y-4">
            {postsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="text-sm">
                          {post.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text}
                        </p>
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
                            <span>{formatDate(post.created.time)}</span>
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
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay posts para mostrar</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Analíticas */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Estadísticas de seguidores */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : formatNumber(followerStats?.followersCount || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Seguidores</div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de posts */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{posts?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de campañas */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">{campaigns?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Campañas</div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de cuentas */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                    <div className="text-2xl font-bold">{adAccounts?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Cuentas</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información del perfil */}
            {userInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    Perfil de LinkedIn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {userInfo.profilePicture && (
                      <img
                        src={userInfo.profilePicture.displayImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {userInfo.firstName.localized[Object.keys(userInfo.firstName.localized)[0]]} {userInfo.lastName.localized[Object.keys(userInfo.lastName.localized)[0]]}
                      </h3>
                      {userInfo.headline && (
                        <p className="text-muted-foreground">
                          {userInfo.headline.localized[Object.keys(userInfo.headline.localized)[0]]}
                        </p>
                      )}
                      {userInfo.vanityName && (
                        <p className="text-sm text-blue-600">linkedin.com/in/{userInfo.vanityName}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}