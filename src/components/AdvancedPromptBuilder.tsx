import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Brain, Wand2, Target, Users, Palette, FileText, Video } from 'lucide-react'
import { advancedPromptService, createMarketingPrompt, optimizeImagePrompt, optimizeCopyPrompt } from '@/lib/advanced-prompt-service'

interface PromptTemplate {
  id: string
  name: string
  category: 'copywriting' | 'image_generation' | 'video_generation' | 'sentiment_analysis'
  structure: any
  variables: string[]
  examples: any[]
}

export default function AdvancedPromptBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [activeTab, setActiveTab] = useState('builder')

  // Cargar plantillas disponibles
  useEffect(() => {
    const availableTemplates = advancedPromptService.getAvailableTemplates()
    setTemplates(availableTemplates)
  }, [])

  // Generar prompt avanzado
  const generateAdvancedPrompt = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      const result = await advancedPromptService.generateAdvancedPrompt({
        template_id: selectedTemplate,
        variables,
        target_audience: variables.target_audience,
        brand_voice: variables.brand_voice,
        channel: variables.channel,
        objective: variables.objective
      })
      
      setGeneratedPrompt(result)
    } catch (error) {
      console.error('Error generando prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Optimizar prompt existente
  const optimizeExistingPrompt = async () => {
    if (!generatedPrompt) return

    setIsGenerating(true)
    try {
      const template = advancedPromptService.getTemplate(selectedTemplate)
      const category = template?.category || 'copywriting'
      
      const result = await advancedPromptService.optimizePrompt(
        generatedPrompt,
        category,
        variables.target_audience
      )
      
      setOptimizedPrompt(result.optimized_prompt)
    } catch (error) {
      console.error('Error optimizando prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Crear prompt para marketing guatemalteco
  const createGuatemalanPrompt = () => {
    const prompt = createMarketingPrompt(
      variables.product_name || 'Producto',
      variables.product_type || 'producto',
      variables.channel || 'Facebook',
      variables.objective || 'awareness'
    )
    setGeneratedPrompt(prompt)
  }

  // Obtener plantilla seleccionada
  const currentTemplate = templates.find(t => t.id === selectedTemplate)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Constructor Avanzado de Prompts
          </CardTitle>
          <CardDescription>
            Utiliza técnicas avanzadas de prompt engineering para crear prompts optimizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Constructor</TabsTrigger>
              <TabsTrigger value="optimizer">Optimizador</TabsTrigger>
              <TabsTrigger value="templates">Plantillas</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Plantilla</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            {template.category === 'image_generation' && <Palette className="h-4 w-4" />}
                            {template.category === 'copywriting' && <FileText className="h-4 w-4" />}
                            {template.category === 'video_generation' && <Video className="h-4 w-4" />}
                            {template.category === 'sentiment_analysis' && <Brain className="h-4 w-4" />}
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Objetivo</label>
                  <Select 
                    value={variables.objective || ''} 
                    onValueChange={(value) => setVariables(prev => ({ ...prev, objective: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Awareness</SelectItem>
                      <SelectItem value="conversion">Conversión</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="retention">Retención</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentTemplate && (
                <div className="space-y-4">
                  <h3 className="font-medium">Variables de la Plantilla</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentTemplate.variables.map((variable) => (
                      <div key={variable}>
                        <label className="text-sm font-medium capitalize">
                          {variable.replace(/_/g, ' ')}
                        </label>
                        <Input
                          value={variables[variable] || ''}
                          onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                          placeholder={`Ingresa ${variable.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={generateAdvancedPrompt}
                  disabled={!selectedTemplate || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generar Prompt Avanzado
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={createGuatemalanPrompt}
                  variant="outline"
                  disabled={isGenerating}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Marketing GT
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="optimizer" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Prompt a Optimizar</label>
                <Textarea
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  placeholder="Pega aquí el prompt que quieres optimizar..."
                  rows={6}
                />
              </div>

              <Button 
                onClick={optimizeExistingPrompt}
                disabled={!generatedPrompt || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Optimizando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Optimizar Prompt
                  </>
                )}
              </Button>

              {optimizedPrompt && (
                <div>
                  <label className="text-sm font-medium">Prompt Optimizado</label>
                  <Textarea
                    value={optimizedPrompt}
                    readOnly
                    rows={6}
                    className="bg-green-50 border-green-200"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {template.category === 'image_generation' && <Palette className="h-5 w-5" />}
                        {template.category === 'copywriting' && <FileText className="h-5 w-5" />}
                        {template.category === 'video_generation' && <Video className="h-5 w-5" />}
                        {template.category === 'sentiment_analysis' && <Brain className="h-5 w-5" />}
                        {template.name}
                      </CardTitle>
                      <CardDescription>
                        {template.structure.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Variables:</p>
                          <p className="text-sm text-gray-600">
                            {template.variables.join(', ')}
                          </p>
                        </div>
                        {template.examples.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Ejemplo:</p>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {template.examples[0].output}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {generatedPrompt && (
            <div className="mt-6">
              <label className="text-sm font-medium">Prompt Generado</label>
              <Textarea
                value={generatedPrompt}
                readOnly
                rows={8}
                className="bg-blue-50 border-blue-200"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                  variant="outline"
                  size="sm"
                >
                  Copiar Prompt
                </Button>
                <Button
                  onClick={() => setOptimizedPrompt('')}
                  variant="outline"
                  size="sm"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Técnicas Avanzadas Incluidas:</strong> EmotionPrompt, Chain-of-Thought, Power Words, 
          Contexto Cultural Guatemalteco, y Optimización Automática de Prompts.
        </AlertDescription>
      </Alert>
    </div>
  )
}
