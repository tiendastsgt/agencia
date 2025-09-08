import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Client, Campaign, AI_ENABLED, TIENDASTS_CLIENT_ID } from '@/lib/supabase'
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
  Sparkles,
  Zap,
  BookOpen,
  Heart,
  TrendingUp,
  Copy,
  CheckCircle,
  AlertCircle,
  Cpu,
  Rocket
} from 'lucide-react'
import { toast } from 'sonner'

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

export default function AIContentGenerator() {
  const [selectedClient, setSelectedClient] = useState(TIENDASTS_CLIENT_ID)
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [selectedBucket, setSelectedBucket] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const queryClient = useQueryClient()

  // Fetch clients (con TiendaSTS como predeterminado)
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

  // AI Content Generation Mutation
  const generateContentMutation = useMutation({
    mutationFn: async (params: any) => {
      setIsGenerating(true)
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: params
      })
      
      if (error) throw error
      return data.data
    },
    onSuccess: (data) => {
      setGeneratedContent(data)
      toast.success('Contenido generado con IA real!')
    },
    onError: (error: any) => {
      toast.error('Error al generar contenido: ' + error.message)
      console.error('Content generation error:', error)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  })

  const handleGenerateContent = () => {
    if (!selectedClient || !selectedPlatform || !selectedContentType) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const params = {
      clientId: selectedClient,
      campaignId: selectedCampaign && selectedCampaign !== 'none' ? selectedCampaign : null,
      contentType: selectedContentType,
      platform: selectedPlatform,
      contentBucket: selectedBucket && selectedBucket !== 'auto' ? selectedBucket : null,
      customPrompt: customPrompt || null
    }

    generateContentMutation.mutate(params)
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Cpu className="h-8 w-8 mr-3 text-blue-600" />
            Generador de Contenido con IA
          </h1>
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <Rocket className="h-4 w-4 mr-2 text-green-600" />
            Sistema REAL - Generación dinámica con OpenAI GPT-5-nano
          </p>
        </div>
        {AI_ENABLED && (
          <Badge variant="default" className="bg-green-600">
            IA ACTIVA
          </Badge>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sistema de IA</p>
                <p className="text-2xl font-bold text-green-600">ACTIVO</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Modelo IA</p>
                <p className="text-2xl font-bold text-blue-600">GPT-5-nano</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Framework</p>
                <p className="text-lg font-bold text-purple-600">Russell Brunson</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Framework Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Framework Hook-Story-Offer
              </CardTitle>
              <CardDescription>
                Metodología de Russell Brunson con IA real de OpenAI
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
              <CardDescription>
                Generación personalizada para TiendaSTS con IA real
              </CardDescription>
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
                          {client.name} {client.id === TIENDASTS_CLIENT_ID && '(Principal)'}
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
                <Label htmlFor="prompt">Instrucciones Adicionales para IA (Opcional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ej: Enfócate en productos naturales vs químicos, menciona la ventaja para mujeres profesionales ocupadas..."
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
                    Generando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Contenido con IA Real
                  </>
                )}
              </Button>
              
              {!AI_ENABLED && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    Sistema de IA en configuración. Funcionalidad disponible próximamente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Content Display */}
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
                      {generatedContent.platform} • {generatedContent.content_type} • Generado con IA
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedContent.content_body)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook, Story, Offer Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Hook (IA)</h4>
                    <p className="text-sm text-blue-800">{generatedContent.hook}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Story (IA)</h4>
                    <p className="text-sm text-green-800 line-clamp-3">{generatedContent.story}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Offer (IA)</h4>
                    <p className="text-sm text-purple-800">{generatedContent.offer}</p>
                  </div>
                </div>

                {/* Final Content */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contenido Final Generado por IA</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                      {generatedContent.content_body}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Estado del Sistema IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">OpenAI API</span>
                  <Badge variant="default" className="bg-green-600">Conectado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Modelo IA</span>
                  <Badge variant="secondary">GPT-5-nano</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Framework</span>
                  <Badge variant="outline">Russell Brunson</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cliente Activo</span>
                  <Badge variant="default" className="bg-blue-600">TiendaSTS</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estrategia de Contenido</CardTitle>
              <CardDescription>
                Distribución Russell Brunson
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

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips de IA para Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <Sparkles className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <p>La IA analiza el perfil completo de TiendaSTS para generar contenido personalizado</p>
                </div>
                <div className="flex items-start">
                  <Zap className="h-4 w-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <p>Cada generación es única y optimizada para la plataforma seleccionada</p>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                  <p>El sistema aprende de los frameworks de Russell Brunson para maximizar conversiones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}