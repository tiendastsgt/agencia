import React, { useState } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Copy, Check, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { generateContentWithAI, ContentGenerationRequest } from '@/lib/openai'

export default function AIContentGenerator() {
  const { activeClient, clients } = useActiveClient()
  const [selectedClient, setSelectedClient] = useState<typeof activeClient>(activeClient)
  const [contentType, setContentType] = useState('')
  const [platform, setPlatform] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [isUsingAI, setIsUsingAI] = useState(true)
  const [lastError, setLastError] = useState('')

  const contentTypes = [
    { value: 'social_post', label: 'Post de Red Social' },
    { value: 'blog_post', label: 'Artículo de Blog' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'ad_copy', label: 'Copia Publicitaria' },
    { value: 'story', label: 'Story/Historia' },
    { value: 'video_script', label: 'Guión de Video' }
  ]

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' }
  ]

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Amigable' },
    { value: 'authoritative', label: 'Autoritario' },
    { value: 'humorous', label: 'Humorístico' },
    { value: 'inspirational', label: 'Inspiracional' }
  ]

  const generateContent = async () => {
    if (!selectedClient || !contentType || !platform || !topic) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')
    setLastError('')

    try {
      if (isUsingAI) {
        // Usar OpenAI real
        const request: ContentGenerationRequest = {
          client: {
            name: selectedClient.name,
            business_type: selectedClient.business_type || 'negocio',
            industry: selectedClient.industry || 'industria',
            target_audience: selectedClient.target_audience || 'audiencia objetivo',
            unique_value_proposition: selectedClient.unique_value_proposition || 'propuesta de valor única',
            country: selectedClient.country || 'Guatemala'
          },
          contentType,
          platform,
          topic,
          tone: tone || 'professional'
        }

        const result = await generateContentWithAI(request)
        
        if (result.success) {
          setGeneratedContent(result.content)
          toast.success('¡Contenido generado con IA exitosamente!')
        } else {
          throw new Error(result.error || 'Error al generar contenido con IA')
        }
      } else {
        // Usar demo como fallback
        const demoContent = generateDemoContent()
        setGeneratedContent(demoContent)
        toast.success('¡Contenido generado exitosamente! (Modo Demo)')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setLastError(errorMessage)
      
      // Fallback a demo si falla la IA
      if (isUsingAI) {
        toast.error(`Error con IA: ${errorMessage}. Usando modo demo.`)
        const demoContent = generateDemoContent()
        setGeneratedContent(demoContent)
        setIsUsingAI(false)
      } else {
        toast.error('Error al generar contenido')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDemoContent = () => {
    const clientName = selectedClient?.name || 'tu empresa'
    const businessType = selectedClient?.business_type || 'negocio'
    
    return `🎯 **${topic}** - ${platform.toUpperCase()}

**Hook:** ¿Sabías que ${clientName} está revolucionando el ${businessType} en Guatemala?

**Contenido Principal:**
En ${clientName}, creemos que cada ${businessType} merece la mejor experiencia. Por eso hemos desarrollado soluciones innovadoras que están transformando la industria.

**Call to Action:**
¿Listo para ser parte del cambio? 
👉 Visita nuestro sitio web
📞 Contáctanos hoy mismo
💬 Comenta y comparte tu experiencia

**Hashtags:** #${clientName.replace(/\s+/g, '')} #${businessType.replace(/\s+/g, '')} #Guatemala #Innovación

---
*Generado con IA para ${clientName}*`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      toast.success('Contenido copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Error al copiar el contenido')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generador de Contenido IA</h1>
          <p className="text-gray-600 mt-2">
            Crea contenido de marketing profesional con inteligencia artificial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isUsingAI ? "default" : "secondary"} className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {isUsingAI ? "GPT-5 Nano (IA Real)" : "Modo Demo"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUsingAI(!isUsingAI)}
            disabled={isGenerating}
          >
            {isUsingAI ? "Cambiar a Demo" : "Usar IA Real"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Generación */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Contenido</CardTitle>
            <CardDescription>
              Define los parámetros para generar tu contenido personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selección de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select 
                value={selectedClient?.id || ''} 
                onValueChange={(value) => {
                  const client = clients.find(c => c.id === value)
                  setSelectedClient(client || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Contenido */}
            <div className="space-y-2">
              <Label htmlFor="contentType">Tipo de Contenido</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de contenido" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plataforma */}
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((plat) => (
                    <SelectItem key={plat.value} value={plat.value}>
                      {plat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tema */}
            <div className="space-y-2">
              <Label htmlFor="topic">Tema o Título</Label>
              <Input
                id="topic"
                placeholder="Ej: Lanzamiento de nuevo producto, Consejos de marketing..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Tono */}
            <div className="space-y-2">
              <Label htmlFor="tone">Tono (Opcional)</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tono" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((toneOption) => (
                    <SelectItem key={toneOption.value} value={toneOption.value}>
                      {toneOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateContent} 
              disabled={isGenerating || !selectedClient || !contentType || !platform || !topic}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUsingAI ? "Generando con IA..." : "Generando..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isUsingAI ? "Generar con IA" : "Generar Contenido"}
                </>
              )}
            </Button>

            {lastError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{lastError}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido Generado</CardTitle>
            <CardDescription>
              Tu contenido personalizado aparecerá aquí
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Listo para usar</Badge>
                    <Badge variant="outline" className="text-xs">
                      {isUsingAI ? "Generado con IA" : "Modo Demo"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>El contenido generado aparecerá aquí</p>
                <p className="text-sm">Completa el formulario y haz clic en "Generar Contenido"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}