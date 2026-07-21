import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { sentimentService, SentimentResult, SentimentProvider } from '@/lib/sentiment-service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw, Upload, FileText, BarChart3 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export default function SentimentAnalyzer() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('es')
  const [selectedProvider, setSelectedProvider] = useState<string>('auto')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SentimentResult | null>(null)
  const [batchResults, setBatchResults] = useState<SentimentResult[]>([])
  const [availableProviders, setAvailableProviders] = useState<SentimentProvider[]>([])
  const [isBatchMode, setIsBatchMode] = useState(false)

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ]

  useEffect(() => {
    loadAvailableProviders()
  }, [])

  const loadAvailableProviders = () => {
    const providers = sentimentService.getAvailableProviders()
    setAvailableProviders(providers)
    
    if (providers.length === 0) {
      toast.error('No hay proveedores de análisis de sentimientos configurados')
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Ingresa un texto para analizar')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await sentimentService.analyzeSentiment({
        text: text.trim(),
        language,
        provider: selectedProvider as any
      })

      if (response.success && response.result) {
        setResult(response.result)
        toast.success('Análisis completado exitosamente')
      } else {
        throw new Error(response.error || 'Error en el análisis')
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      toast.error('Error al analizar sentimiento: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBatchAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Ingresa textos para analizar (uno por línea)')
      return
    }

    const texts = text.split('\n').filter(t => t.trim())
    if (texts.length === 0) {
      toast.error('No hay textos válidos para analizar')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await sentimentService.analyzeBatch(texts, language)

      if (response.success && response.results) {
        setBatchResults(response.results)
        toast.success(`Análisis completado para ${response.results.length} textos`)
      } else {
        throw new Error(response.error || 'Error en el análisis por lotes')
      }
    } catch (error) {
      console.error('Error in batch analysis:', error)
      toast.error('Error al analizar textos: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentStats = () => {
    if (batchResults.length === 0) return null
    return sentimentService.getSentimentStats(batchResults)
  }

  const stats = getSentimentStats()

  // Datos para gráficos
  const sentimentData = stats ? [
    { name: 'Positivo', value: stats.positive, color: '#10b981' },
    { name: 'Negativo', value: stats.negative, color: '#ef4444' },
    { name: 'Neutral', value: stats.neutral, color: '#6b7280' }
  ] : []

  const confidenceData = batchResults.map((result, index) => ({
    index: index + 1,
    confidence: result.confidence * 100,
    sentiment: result.sentiment
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Análisis de Sentimientos
          </h2>
          <p className="text-gray-600">Analiza el sentimiento de textos usando múltiples APIs de IA</p>
        </div>
        <Button onClick={loadAvailableProviders} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar Proveedores
        </Button>
      </div>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (Mejor disponible)</SelectItem>
                  {availableProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} (Confianza: {Math.round(provider.confidence * 100)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant={isBatchMode ? "default" : "outline"}
                onClick={() => setIsBatchMode(!isBatchMode)}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isBatchMode ? 'Modo Individual' : 'Modo Lote'}
              </Button>
            </div>
          </div>

          {/* Proveedores disponibles */}
          <div>
            <Label>Proveedores Disponibles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableProviders.length > 0 ? (
                availableProviders.map((provider) => (
                  <Badge key={provider.id} variant="outline" className="flex items-center gap-1">
                    {provider.name}
                    <span className="text-xs">({Math.round(provider.confidence * 100)}%)</span>
                  </Badge>
                ))
              ) : (
                <Badge variant="destructive">No hay proveedores configurados</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entrada de texto */}
      <Card>
        <CardHeader>
          <CardTitle>Texto a Analizar</CardTitle>
          <CardDescription>
            {isBatchMode 
              ? 'Ingresa múltiples textos, uno por línea, para análisis por lotes'
              : 'Ingresa el texto que quieres analizar'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isBatchMode 
              ? "Texto 1\nTexto 2\nTexto 3\n..."
              : "Escribe aquí el texto que quieres analizar..."
            }
            rows={isBatchMode ? 8 : 4}
            className="mb-4"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={isBatchMode ? handleBatchAnalyze : handleAnalyze}
              disabled={isAnalyzing || availableProviders.length === 0}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  {isBatchMode ? 'Analizar Lote' : 'Analizar Sentimiento'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado individual */}
      {result && !isBatchMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSentimentIcon(result.sentiment)}
              Resultado del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getSentimentColor(result.sentiment)}>
                    {result.sentiment.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Proveedor: {result.provider}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Confianza</div>
                </div>
              </div>

              <div>
                <Label>Distribución de Sentimientos</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Positivo</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.scores.positive * 100} className="w-24" />
                      <span className="text-sm font-medium">
                        {Math.round(result.scores.positive * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Negativo</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.scores.negative * 100} className="w-24" />
                      <span className="text-sm font-medium">
                        {Math.round(result.scores.negative * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.scores.neutral * 100} className="w-24" />
                      <span className="text-sm font-medium">
                        {Math.round(result.scores.neutral * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados por lotes */}
      {batchResults.length > 0 && isBatchMode && (
        <div className="space-y-6">
          {/* Estadísticas generales */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estadísticas Generales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
                    <div className="text-sm text-gray-600">Positivos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
                    <div className="text-sm text-gray-600">Negativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
                    <div className="text-sm text-gray-600">Neutrales</div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sentimiento Dominante:</span>
                    <Badge className={getSentimentColor(stats.dominantSentiment)}>
                      {stats.dominantSentiment.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">Confianza Promedio:</span>
                    <span className="font-bold">{Math.round(stats.averageConfidence * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pastel */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Sentimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {sentimentData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de confianza */}
            <Card>
              <CardHeader>
                <CardTitle>Nivel de Confianza por Análisis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="confidence" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lista de resultados */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados Detallados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batchResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">#{index + 1}</span>
                      {getSentimentIcon(result.sentiment)}
                      <Badge className={getSentimentColor(result.sentiment)}>
                        {result.sentiment.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Confianza: {Math.round(result.confidence * 100)}%
                      </span>
                      <span className="text-sm text-gray-600">
                        {result.provider}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
