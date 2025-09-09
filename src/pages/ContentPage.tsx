import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Client, Campaign } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Share,
  Calendar,
  Target,
  Zap,
  BookOpen,
  Heart,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedContent {
  title: string
  content_type: string
  platform: string
  hook: string
  story: string
  offer: string
  content_body: string
  platform_optimization: any
  suggested_media: string[]
  optimal_posting_time: string
  hashtag_suggestions: string[]
  engagement_prediction: any
}

const platforms = [
  { value: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
  { value: 'twitter', label: 'X (Twitter)', color: 'bg-gray-900' }
]

const contentTypes = [
  { value: 'post', label: 'Post/Publicación' },
  { value: 'story', label: 'Historia/Story' },
  { value: 'video', label: 'Video' },
  { value: 'carousel', label: 'Carrusel' },
  { value: 'ad', label: 'Anuncio' }
]

const contentBuckets = [
  { value: 'education', label: 'Educativo (40%)', icon: BookOpen, color: 'text-blue-600' },
  { value: 'inspiration', label: 'Inspiracional (25%)', icon: Heart, color: 'text-pink-600' },
  { value: 'entertainment', label: 'Entretenimiento (25%)', icon: Zap, color: 'text-yellow-600' },
  { value: 'promotion', label: 'Promocional (10%)', icon: TrendingUp, color: 'text-green-600' }
]

export default function ContentPage() {
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [selectedBucket, setSelectedBucket] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const queryClient = useQueryClient()

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data as Client[]
    }
  })

  // Fetch campaigns for selected client
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return []
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', selectedClient)
        .order('name')
      
      if (error) throw error
      return data as Campaign[]
    },
    enabled: !!selectedClient
  })

  // Fetch recent content
  const { data: recentContent } = useQuery({
    queryKey: ['content-recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    }
  })

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (params: any) => {
      setIsGenerating(true)
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          ...params,
          openai_api_key: import.meta.env.VITE_OPENAI_API_KEY
        }
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setGeneratedContent(data)
      toast.success('Contenido generado exitosamente')
    },
    onError: (error: any) => {
      toast.error('Error al generar contenido: ' + error.message)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  })

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async (contentData: any) => {
      const { data, error } = await supabase
        .from('content')
        .insert([contentData])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      toast.success('Contenido guardado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['content-recent'] })
    },
    onError: (error: any) => {
      toast.error('Error al guardar contenido: ' + error.message)
    }
  })

  const handleGenerateContent = () => {
    if (!selectedClient || !selectedPlatform || !selectedContentType) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const params = {
      client_id: selectedClient,
      type: selectedContentType,
      platform: selectedPlatform,
      topic: selectedBucket && selectedBucket !== 'auto' ? selectedBucket : null,
      custom_prompt: customPrompt || null
    }

    generateContentMutation.mutate(params)
  }

  const handleSaveContent = () => {
    if (!generatedContent) return

    const contentData = {
      client_id: selectedClient,
      campaign_id: selectedCampaign && selectedCampaign !== 'none' ? selectedCampaign : null,
      title: generatedContent.title,
      content_type: generatedContent.content_type,
      platform: generatedContent.platform,
      hook: generatedContent.hook,
      story: generatedContent.story,
      offer: generatedContent.offer,
      content_body: generatedContent.content_body,
      media_urls: generatedContent.suggested_media,
      status: 'draft'
    }

    saveContentMutation.mutate(contentData)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generador de Contenido</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crea contenido estratégico usando frameworks Russell Brunson
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Generation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Framework Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Framework Hook-Story-Offer
              </CardTitle>
              <CardDescription>
                Metodología probada de Russell Brunson para contenido de alta conversión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-blue-900">Hook</h3>
                  <p className="text-sm text-blue-700 mt-1">Captura atención instantánea</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-green-900">Story</h3>
                  <p className="text-sm text-green-700 mt-1">Conecta emocionalmente</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-purple-900">Offer</h3>
                  <p className="text-sm text-purple-700 mt-1">Impulsa a la acción</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Configuración de Contenido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Selection */}
                <div>
                  <Label htmlFor="client">Cliente *</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campaign Selection */}
                <div>
                  <Label htmlFor="campaign">Campaña (Opcional)</Label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar campaña" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin campaña específica</SelectItem>
                      {campaigns?.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label htmlFor="platform">Plataforma *</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${platform.color} mr-2`}></div>
                            {platform.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Type Selection */}
                <div>
                  <Label htmlFor="contentType">Tipo de Contenido *</Label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de contenido" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Bucket */}
              <div>
                <Label htmlFor="bucket">Categoría de Contenido (Opcional)</Label>
                <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automático</SelectItem>
                    {contentBuckets.map(bucket => {
                      const Icon = bucket.icon
                      return (
                        <SelectItem key={bucket.value} value={bucket.value}>
                          <div className="flex items-center">
                            <Icon className={`h-4 w-4 mr-2 ${bucket.color}`} />
                            {bucket.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div>
                <Label htmlFor="prompt">Instrucciones Adicionales (Opcional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ej: Enfócate en el problema de resistencia a químicos, menciona la ventaja de precio del 70%..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || !selectedClient || !selectedPlatform || !selectedContentType}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando contenido...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Contenido
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      {generatedContent.title}
                    </CardTitle>
                    <CardDescription>
                      {generatedContent.platform} • {generatedContent.content_type}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.content_body)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveContent}
                      disabled={saveContentMutation.isPending}
                    >
                      {saveContentMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook, Story, Offer Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Hook</h4>
                    <p className="text-sm text-blue-800">{generatedContent.hook}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Story</h4>
                    <p className="text-sm text-green-800 line-clamp-3">{generatedContent.story}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Offer</h4>
                    <p className="text-sm text-purple-800">{generatedContent.offer}</p>
                  </div>
                </div>

                {/* Final Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contenido Final</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                      {generatedContent.content_body}
                    </pre>
                  </div>
                </div>

                {/* Optimization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Optimización</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mejor horario:</span>
                        <span className="font-medium">{generatedContent.optimal_posting_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement esperado:</span>
                        <span className="font-medium text-green-600">
                          {generatedContent.engagement_prediction?.predicted_engagement_rate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hashtags Sugeridos</h4>
                    <div className="flex flex-wrap gap-1">
                      {generatedContent.hashtag_suggestions?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Media Suggestions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sugerencias de Media</h4>
                  <div className="space-y-1">
                    {generatedContent.suggested_media?.map((suggestion, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estrategia de Contenido</CardTitle>
              <CardDescription>
                Distribución recomendada Russell Brunson
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentBuckets.map(bucket => {
                  const Icon = bucket.icon
                  return (
                    <div key={bucket.value} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className={`h-4 w-4 mr-2 ${bucket.color}`} />
                        <span className="text-sm font-medium">{bucket.label.split('(')[0]}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {bucket.label.match(/\((.*?)\)/)?.[1]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenido Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentContent?.slice(0, 5).map(content => (
                  <div key={content.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {content.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {content.platform} • {new Date(content.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={content.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {content.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!recentContent || recentContent.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay contenido reciente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips de Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <p>El hook debe parar el scroll en los primeros 3 segundos</p>
                </div>
                <div className="flex items-start">
                  <Heart className="h-4 w-4 mr-2 mt-0.5 text-pink-600 flex-shrink-0" />
                  <p>Las historias crean conexión emocional profunda</p>
                </div>
                <div className="flex items-start">
                  <Zap className="h-4 w-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <p>La oferta debe tener urgencia y escasez</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}